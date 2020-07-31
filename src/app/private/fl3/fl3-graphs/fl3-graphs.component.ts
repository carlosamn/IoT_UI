import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationsService } from './../../locations/locations.service';
import { AppSharedService } from '../../../app.shared-service';

import { FL3Service } from './../fl3.service';
import { FL3SharedService } from '../fl3-shared.service';
//import { ConfirmationDialogService } from '../../../common/confirmation-dialog/confirmation-dialog.service';

import { LoadingService } from '../../shared/loading.service';
import { DevicesService } from './../../devices/devices.service';
import { EtdService } from '../../home/etd.service';
import { ClientsService } from '../../clients/clients.service';
import { AlarmsService } from '../../alarms/alarms.service';
import { ContainersService } from '../../containers/containers.service';

import { b64toBlob } from '../../../common/utilities/baseToBlob';

import * as transform from '../../../common/fl3-filters/transformers';
import * as helpers from '../../../common/filters/text-transform';
import * as dom from '../../../common/filters/chart-buttons';

import * as Highcharts from 'highcharts/highstock';
import * as HighchartsExporting from 'highcharts/modules/exporting.src';
import * as HighchartsBoosting from 'highcharts/modules/boost.src';
import * as EventSource from 'eventsource';


import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { ISubscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/debounceTime';

HighchartsExporting(Highcharts);
HighchartsBoosting(Highcharts);

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import { IfObservable } from 'rxjs/observable/IfObservable';
import { forEach } from '@angular/router/src/utils/collection';
import { stringify } from '@angular/core/src/render3/util';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'fl3-graphs',
  templateUrl: './fl3-graphs.component.html',
  styleUrls: ['./fl3-graphs.component.css']
})

export class FL3GraphsComponent implements OnInit, OnDestroy {

  @ViewChild('wav') wavFile;
  @ViewChild('collarGraph', { read: ElementRef }) collarGraph: ElementRef;
  @ViewChild('baselineGraph', { read: ElementRef }) baselineGraph: ElementRef;

  @ViewChild('swal') private swal: SwalComponent;
  @ViewChild('errors') private errors: SwalComponent;

  public sensors;
  public activedSensors = 0;
  public auxSensors;
  public datamessage;
  public pollServer;
  public lastUpdate;


  public selectedDevice;
  public selectedLocation;
  public fl3Records;
  public fl3EmptyRows;
  public wavdata;
  public collarData;
  public fl3Settings;

  //  Informative
  public acousticFactor;
  public acousticVelocity;
  public shotStartTime;
  public arrowText = '>>';

  public yRangeLimits = 32768;
  public baselineChart;
  public collarChart;
  public options;
  public baselineGraphData;
  public collarGraphData;
  public collarParams;
  public collarVisibility: boolean;

  public filterType;
  //  Sensible data
  public zeroValue;
  public peakValue;
  public kickTime;

  public interval;
  public currentFilter: string;

  public dragOptions;

  public unparsedWavData;
  public typeButtons = ['lock', 'kick', 'zero'];

  public selectedIndex = 0;
  public clickedRow = false;
  public dragEdited = false;
  public fluidLevel;
  public swalWindowOptions = {};
  public swalErrors = { type: 'error', title: 'Oops', text: 'Something its wrong updating the zero and peak values' };

  public captureStatus;
  public commandInterval;
  public captureMode;

  public controller;
  public timer;
  public uidArray: any = [];
  public totalReports: any = [];
  private source;
  private isRedraw: boolean;

  private captureButton: boolean;

  //  Este flag aplica despues de tomar foto a un chart y actualizar el campo 'drawn', si solo se está
  //  Haciendo patch a drawn entonces, este será true (sirve para no repetir los procesos en fl3stream)
  private isChartImageFlag: boolean;

  private deviceSubscription: ISubscription;
  private companySubscription: ISubscription;
  private sensorsSubscription: ISubscription;
  private locationSubscription: ISubscription;
  private alarmsSubscription: ISubscription;
  private getAllRecordsSubscriptions: ISubscription;
  private getWavDataSubscription: ISubscription;

  // RXJS Subscriptions
  public SUBS = {
    location: <any>{},
    isCollar: <any>{}
  };

  public UX = {
    isCollarAnalysis: false,
    fl3NoRecordsEnable: false
  }

  //  Streams
  constructor(private fl3Service: FL3Service,
    private fl3Shared: FL3SharedService,
    private appShared: AppSharedService,
    private loading: LoadingService,
    private deviceService: DevicesService,
    private locationsService: LocationsService,
    private etdService: EtdService,
    private clientsService: ClientsService,
    private alarmsService: AlarmsService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private containers: ContainersService
  ) {

    this.collarGraphData = [];
    this.collarData = [];
    this.collarParams = {};
    this.fl3Records = [];
    this.fl3EmptyRows = [];
    this.sensors = [];
    this.datamessage = 'Loading data...';
    this.wavdata = [];
    this.fl3Settings = [];
    this.dragOptions = 'lock';
    this.filterType = 'baseline';
    this.shotStartTime = '';

    //  Aqui seteamos la visiblidad del componente options
    this.fl3Shared.setVisibility(true);
    //  Aqui oimos que pasa cuando clickea radiobuton

    //  An observable watching if the button 'redraw is called'
    this.fl3Shared.getFl3ClickedButton.subscribe(buttonType => {
      if (buttonType === 'baselineDraw') {
        this.redrawBaseline();
      } else if (buttonType === 'collarDraw') {
        this.drawCollar();
      }
    });
  }



  waiting(mili) {
    return new Promise((resolve, reject) => {
      setTimeout(x => {
        resolve()
      }, mili)
    });
  }

  async ngOnInit() {


    try { this.initializeChangeStream(); } catch (e) { console.error('Errir init Stream') }

    this.UX.fl3NoRecordsEnable = false;


    // get Location
    this.SUBS.location = this.appShared.currentLocationObj.debounceTime(2500).subscribe(async location => {
      this.selectedLocation = location;

      this.fl3Shared.streamingClose();
      this.fl3Shared.streamingBegin(this.selectedLocation, 'sensor');


      if (this.selectedLocation['locationId']) {
        let verifyFL3isDone = await this.verifyFl3Event();

        await this.getSettingsLoadWithGraphType();
        //await this.fl3Service.getSettingsLoadWithGraphType(this.selectedLocation,this.fl3Service,this.captureMode,this.fl3Settings,this.filterType,this.acousticFactor,this.acousticVelocity,this.fl3Shared,this.getAllFl3Records);

        this.UX.fl3NoRecordsEnable = true;
        if (this.selectedLocation.uid != 'NA') {
          this.controller = `${this.selectedLocation.clientCode}${this.selectedLocation.uid}`;
          this.controller = `${this.selectedLocation.clientCode}${this.selectedLocation.uid}`;
          let sensors = await this.getSensors(this.selectedLocation);
        }
      }



    });

    this.sensorsSubscription = this.fl3Shared.getFl3StreamSensor.subscribe(async sensors => {
      try { this.sensors[0]['value'] = sensors[0]['analogInput1']; } catch (e) { }
      try { this.sensors[1]['value'] = sensors[0]['analogInput2']; } catch (e) { }
      try { this.sensors[2]['value'] = sensors[0]['analogInput3']; } catch (e) { }
      try { this.sensors[3]['value'] = sensors[0]['analogInput4']; } catch (e) { }
      try { this.lastUpdate = sensors[0]['timestamp']; } catch (e) { }
    });


    this.SUBS.isCollar = this.fl3Shared.getFl3CollarAnalysisEnable.debounceTime(500).subscribe(isCollarEnable => {
      this.UX.isCollarAnalysis = isCollarEnable;
    });

  }

  ngOnDestroy() {
    try {
      this.source.close()
    } catch (e) {
      console.error(' -------------------------------- ')
      console.error(' Error at close SourceEvent Error ')
      console.error(' -------------------------------- ')
    }
    try { this.SUBS.location.unsubscribe(); } catch (e) { }
    try { this.fl3Shared.setVisibility(false); } catch (e) { }

    try { this.source.close(); } catch (e) { }
    try { this.companySubscription.unsubscribe(); } catch (e) { }
    try { this.fl3Shared.streamingClose(); } catch (e) { }
    try { this.getAllRecordsSubscriptions.unsubscribe(); } catch (e) { }
    try { this.getWavDataSubscription.unsubscribe(); } catch (e) { }
    try { this.locationSubscription.unsubscribe(); } catch (e) { }
    try { this.alarmsSubscription.unsubscribe(); } catch (e) { }
    try { this.fl3Shared.streamingClose(); } catch (e) { }
    try { this.SUBS.isCollar.unsubscribe() } catch (e) { }
  }


  verifyFl3Event() {
    return new Promise((resolve, reject) => {
      this.fl3Shared.getFl3Events.subscribe(fl3 => {
        if (fl3 === 'baseline' || fl3 === 'baseline2') {
          this.filterType = fl3;
        }
        resolve()
      });
    });
  }

  getAllFl3Records() {
    // this.fl3Service.getAllFl3Records2(this.baselineChart, this.selectedLocation,this.fl3Service,
    // this.fl3EmptyRows,this.getAllRecordsSubscriptions,this.fl3Records)
    return new Promise((resolve, reject) => {

      let query = {
        fields: {
          filterApplied: true,
          recordId: true,
          uid: true,
          captureTimestamp: true,
          baseline: true,
          captureStatus: true,
          isBaselineGraph: true,
          isCollarGraph: true,
          casingPressure: true
        },
        order: 'captureTimestamp DESC',
        where: {
          //  uid: this.selectedDevice.uid,
          captureStatus: 'Done',
          locationId: { like: this.selectedLocation.locationId }
          //projectId: this.selectedLocation.projectId
        }
      };

      this.getAllRecordsSubscriptions = this.fl3Service.getAllFl3Records(query).subscribe(async fl3Records => {
        this.fl3Records = fl3Records;
        let recordsForReport = this.fl3Service.getRecordsForReport();

        this.fl3Records.map(fl3Record => {
          let exists = recordsForReport.find(recordId => fl3Record.recordId == recordId);
          if (exists) fl3Record.selectedForReport = true;
        });
        this.fl3Service.addEmptyRows(this.fl3Records, this.fl3EmptyRows);
        if (fl3Records.length) {
          resolve(fl3Records);
        } else {
          this.baselineChart = undefined;
          resolve(fl3Records);
        }

      });

    })

  }

  public deleteFL3() {
    if (confirm('Do you really want to  permanently delete this FL3 record?')) {
      //const recordId = this.fl3Records[this.selectedIndex];
      const recordId = this.fl3Records[this.selectedIndex].recordId;
      this.fl3Service.deleteFl3(recordId)
        .subscribe(result => {
          this.fl3Records.splice(this.selectedIndex, 1);
        });
    }
    else return false;
  }

  deleteFl3(recordId) {
    this.fl3Service.deleteFl3(recordId)
      .subscribe(values => {
        console.log('deleted');
      });
  }

  async runDeletion() {
    for (let i = 0; i < this.fl3Records.length; i++) {
      await this.deleteAllFl3Records(this.fl3Records[i].recordId);
    }
  }

  deleteAllFl3Records(recordId) {
    return new Promise((resolve, reject) => {
      this.fl3Service.deleteFl3(recordId)
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  /*public addEmptyRows() {
    if (this.fl3Records.length > 4) return false;
    else {
      for (let i = 0; i < 6 - this.fl3Records.length; i++) {
        this.fl3EmptyRows.push({ column1: 'No data', column2: 'No data' });
      }
    }
  }*/

  getWavData(id, index, clicked?) {
    if (clicked) this.clickedRow = true;
    return new Promise((resolve, reject) => {

      this.collarVisibility = false;
      this.selectedIndex = index;
      this.loading.show();
      this.getWavDataSubscription = this.fl3Service.getWavDataById(id)
        .subscribe(async wavdata => {
          this.wavdata = wavdata;
          //  Setting the acoustic Factor
          if (this.wavdata.acousticVelocity.manualMode === 1) {
            this.acousticFactor = 'Specified';
            this.acousticVelocity = this.wavdata.acousticVelocity.manualVelocity;

          }
          //  Setting the acoustic Factor
          if (this.wavdata.acousticVelocity.autoMode === 1) {
            this.acousticFactor = 'Collar Based';
            this.acousticVelocity = this.wavdata.acousticVelocity.autoVelocity;
          }
          console.log(this.acousticVelocity, this.acousticFactor);
          this.shotStartTime = transform.convertFileNameToShotStart(wavdata.recordId);
          if (wavdata != null && wavdata != '') {
            this.chartConfiguration('baselineData', this.filterType);
          }
          resolve();
        });

    })


  }
  unselectReports() {
    this.fl3Records.map(fl3Report => fl3Report.selectedForReport = false);
    this.fl3Service.removeAllReportItems();
  }

  addToReport() {
    let selectedForReport = this.fl3Records[this.selectedIndex].selectedForReport;
    if (!selectedForReport) {
      this.fl3Records[this.selectedIndex].selectedForReport = true;
      // Add to array
      this.fl3Service.addItemToReport(this.fl3Records[this.selectedIndex].recordId);
    } else {
      this.fl3Records[this.selectedIndex].selectedForReport = false;
      //  Remove from arrays
      this.fl3Service.removeItemToReport(this.fl3Records[this.selectedIndex].recordId);
    }
  }


  getSettingsLoadWithGraphType() {
    //this.fl3Service.getSettingsLoadWithGraphType(this.selectedLocation,this.fl3Service,this.captureMode,this.fl3Settings,this.filterType,this.acousticFactor,
    // this.acousticVelocity,this.fl3Shared,this.getAllFl3Records);
    return new Promise<any>((resolve, reject) => {
      if (this.selectedLocation['locationId']) {
        this.fl3Service.getFl3SettingsById(this.selectedLocation['locationId'])
          .subscribe(async fl3settings => {

            switch (fl3settings.captureMode.modeValue) {
              case 0:
                this.captureMode = 'Auto';
                break;
              case 1:
                this.captureMode = 'Manual';
                break;
              default:
                this.captureMode = 'Listen';
                break;
            }
            this.fl3Settings = fl3settings;

            this.filterType = fl3settings.defaultFiltersApplied == 0 ? 'baseline' : 'baseline2';
            this.fl3Shared.setFl3Settings(fl3settings);

            try {

              let AllFl3Records = await this.getAllFl3Records();
              let FirstFL3Record = AllFl3Records[0];
              await this.getWavData(FirstFL3Record.recordId, 0)


            }
            catch (e) {
              console.error('NO FL3 DATA FOR THIS LOCATION')
            }


            resolve()

          }, err => {
            reject(err);
          });
      }
    });
  }

  filterData(filter, type) {
    this.dragEdited = false;
    this.chartConfiguration(filter, type);
  }

  async chartConfiguration(filter, type) {
    if (type === 'raw') type = 'rawDataPoints';
    else type = 'filteredDataPoints';

    if (this.fl3Settings != null) {

      let LoadFirstGraphOnly = true;
      if (LoadFirstGraphOnly == true) {
        this.unparsedWavData = this.wavdata[filter][type];
        this.zeroValue = this.wavdata.baseline.zerotime * 1000;

        this.peakValue = this.wavdata.baseline.peaktime * 1000;
        this.kickTime = this.peakValue - this.zeroValue;

        this.interval = Math.round(1000 / this.wavdata.baseline.samplerate * 100) / 100;

        var startTime = 0;

        this.baselineGraphData = [];
        for (var i = 0; i < this.unparsedWavData.length; i++) {
          if (i !== 0) startTime = startTime + this.interval;
          this.baselineGraphData.push([Math.round(startTime * 100) / 100, parseInt(this.unparsedWavData[i])]);
        }

        //  NEW CODE
        this.baselineChart = undefined;

        await this.plotChart();
        //  NEW CODE
      }
    } else {
      //$('.loading-content').hide();
      //  HideLoading(true);
      //alert('error');
    }
  }

  async plotChart() {
    return new Promise(async (resolve: Function) => {
      var me = this;
      let chartConfig = {
        chart: {
          events: {
            load: function (e) {
              setTimeout(function () {
                me.baselineChart.xAxis[0].setExtremes(me.zeroValue - 200, me.peakValue + 200);
                console.log('chart updated');
                //if (!me.wavdata.isBaselineGraph) me.saveChartImage('baselineGraph');
                console.log('initializing save image');
                if (me.clickedRow) {
                  me.clickedRow = false;
                  setTimeout(() => me.saveChartImage('baselineGraph'), 500);
                }
              }, 1000);
            }
          },
          backgroundColor: 'rgb(242,242,242)',
          zoomType: 'x',
          panning: true,
          panKey: 'shift',
          alignTicks: false,
          inverted: false,
          height: 370,
          width: me.baselineGraph.nativeElement.offsetWidth - 10,
        },
        legend: {
          enabled: false
        },
        title: {
          text: ''
        },
        rangeSelector: {
          enabled: true,
          inputEnabled: false,
          buttons: [{
            type: 'millisecond',
            count: 200,
            text: '200ms'
          },
          {
            type: 'millisecond',
            count: 500,
            text: '500ms'
          },
          {
            type: 'millisecond',
            count: 1000,
            text: '1s'
          },
          {
            type: 'all',
            text: 'All'
          },
          {
            type: 'viewselection',
            text: 'View Selection'
          }],
          buttonTheme: {
            width: null,
            style: {
              color: '#000'
            }
          },
          labelStyle: {
            color: '#000'
          }
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          title: {
            text: ''
          },
          tickColor: '#000',
          events: {
            setExtremes: (e: any) => {
              if (e.rangeSelectorButton) {
                if (e.rangeSelectorButton.type == 'viewselection') {
                  let aditional = 200;
                  let difference = me.peakValue - me.zeroValue;
                  if (difference < 800) aditional = 10;

                  setTimeout(() => {
                    me.baselineChart.xAxis[0].setExtremes(me.zeroValue - aditional, me.peakValue + aditional);
                  }, 1000);
                }
              }
            }
          },
          tickInterval: me.zeroValue,
          //step: 3,
          labels: {
            style: {
              color: '#000'
            },
            enabled: true,
            formatter: function () {
              return transform.dateFormats(this.value, me.zeroValue) + 'ms';
              //return (transform.getSecondsFromTimestamp(this.value) + ':' + transform.getMillisecondsFromTimestamp(this.value));
            },
            tickPositions: transform.getTickArray(this.baselineGraphData.length, 0.2)
          },
          //  PlotBands es el sombreado entre las dos lineas
          plotBands: [{
            color: 'rgba(238, 250, 121, 0.24)',
            from: this.zeroValue,
            to: this.peakValue,
            events: {

            }
          }],
          plotLines: [{
            color: '#FF0000', // Red
            width: 2,
            value: this.zeroValue,
            zIndex: 5
          },
          {
            color: '#FF0000', // Red
            width: 2,
            value: this.peakValue,
            zIndex: 5
          }]
        },
        yAxis: {
          tickColor: '#000',
          labels: {
            style: {
              color: '#000'
            }
          },
          title: {
            text: 'Amplitude'
          },
          max: this.yRangeLimits,
          min: -this.yRangeLimits,
          tickInterval: this.yRangeLimits
        },
        tooltip: {
          valueDecimals: 1,
          formatter: function () {
            let s = [];
            //let kickOffSet = me.peakValue - me.zeroValue;
            //let itemToPush = `<span style='color:#000;border:1px solid #1E537D:background-color:rgba(247,247,247,0.85);padding:5px;'>${this.x}<span><br><span>Value: ${this.y}<span><br><span>Kick: ${kickOffSet}<span>`;
            let itemToPush = `<span style='color:#000;border:1px solid #1E537D:background-color:rgba(247,247,247,0.85);padding:5px;'>X value: ${((me.zeroValue - this.x) * -1).toFixed(2)}<span><br><span>Y value: ${this.y}<span><br><span>Kick: ${me.kickTime.toFixed(2)}</span>`;
            s.push(itemToPush);
            return s.join(' and ');
          },
          positioner: (labelWidth, labelHeight, point) => {
            let tooltipX, tooltipY;
            if (point.plotX + labelWidth > me.baselineChart.plotWidth) {
              tooltipX = point.plotX + me.baselineChart.plotLeft - labelWidth - 20;
            } else {
              tooltipX = point.plotX + me.baselineChart.plotLeft + 20;
            }
            tooltipY = point.plotY + me.baselineChart.plotTop - 20;

            return {
              x: tooltipX,
              y: tooltipY
            };
          }
        },
        series: [{
          color: '#1E537D',
          name: 'Value',
          cursor: 'pointer',
          data: this.baselineGraphData,
        }],
        boost: {
          useGPUTranslations: true,
          usePreAllocated: true
        },
        exporting: {
          buttons: {
            Lock: {
              text: 'Lock Cursors',
              className: 'custom-chart button-lock',
              onclick: function () {
                me.dragOptionsClick('lock');
              }
            },
            Kick: {
              text: 'Drag Kick',
              className: 'custom-chart button-kick',
              onclick: function () {
                me.dragOptionsClick('kick');
              }
            },
            Zero: {
              text: 'Drag Zero',
              className: 'custom-chart button-zero',
              onclick: function () {
                me.dragOptionsClick('zero')
              }
            },
            Scale25: {
              text: '25%',
              className: 'custom-chart button-25',
              onclick: function () {
                me.scaleOptions(me.yRangeLimits * 0.25)
              }
            },
            Scale50: {
              text: '50%',
              className: 'custom-chart button-50',
              onclick: function () {
                me.scaleOptions(me.yRangeLimits * 0.50)
              }
            },
            Scale75: {
              text: '75%',
              className: 'custom-chart button-75',
              onclick: function () {
                me.scaleOptions(me.yRangeLimits * 0.75)
              }
            },
            Scale100: {
              text: '100%',
              className: 'custom-chart button-100',
              onclick: function () {
                me.scaleOptions(me.yRangeLimits)
              }
            },
            scales: {
              text: 'Scales:',
              className: 'custom-chart no-pointer button-scale',
              onclick: function () {
              }
            },
            baseline: {
              text: 'Detected Level',
              className: 'custom-chart button-baseline',
              onclick: function () {
                me.filterData('baselineData', 'filtered');
              }
            },
            default: {
              text: 'Detailed Data',
              className: 'custom-chart button-default',
              onclick: function () {
                me.filterData('baselineData', 'raw');
              }
            },
          }
        },
        plotOptions: {
          series: {
            turboThreshold: 3000,
            cursor: 'pointer',
            lineWidth: 1,
            point: {
              events: {
                click: function (e) {
                  me.dragAxis(e.point.x);
                }.bind(this)
              }
            },
            states: {
              hover: {
                enabled: true,
                lineWidth: 1
              }
            },

          }
        },
        navigator: {
          enabled: false,
          xAxis: {
            labels: {
              formatter: function () {
                return transform.dateFormats(this.value, me.zeroValue) + 'ms';
                //return (transform.getSecondsFromTimestamp(this.value) + ':' + transform.getMillisecondsFromTimestamp(this.value));
              }
            }
          }
        }
      };

      this.baselineChart = Highcharts.chart(this.baselineGraph.nativeElement, <any>chartConfig);

      this.loading.hide();
      //  Red button for lock cursors
      dom.highlightButtons('lock', this.typeButtons);
      // this.baselineChart = Highcharts.stockChart(this.baselineGraph.nativeElement, chartConfig);
      //  Requesting about the collar data
      let result = await this.requestCollarDataPoints(this.wavdata.recordId);

      if (result.length && result[0].collar && result[0].collar.filteredDataPoints) {
        this.collarData = result[0].collar;
        this.collarGraphConfiguration();
      }

      if (this.captureButton) {
        if (this.fl3Settings.collarGraph) {
          console.log('Capture button has called and collar is true');
          console.log('we will plot a collar now');
          this.captureButton = false;
          this.drawCollar();
        }
      } else {
        if (!result[0].collar && this.fl3Settings.collarGraph) {
          //  No hay data de collar, pero el collar automatico está activo
          this.drawCollar();
        }
      }
      resolve();
    });
  }

  scaleOptions(value) {
    this.baselineChart.yAxis[0].update({
      max: value,
      min: -value,
      tickInterval: value
    });
  }

  async dragAxis(value) {
    switch (this.dragOptions) {
      case 'zero':
        this.processZero(value);
        break;
      case 'kick':
        this.processKick(value);
        break;
    }
  }

  processKick(value) {
    this.dragEdited = true;
    this.peakValue = value;
    this.updateLines();
  }

  processZero(value) {
    this.dragEdited = true;
    this.zeroValue = value;
    this.updateLines();
    this.baselineChart.xAxis[0].setExtremes(this.zeroValue - 200, this.peakValue + 200);
  }

  processLock() {
    this.wavdata.baseline.zerotime = this.zeroValue / 1000;
    this.wavdata.baseline.peaktime = this.peakValue / 1000;
    this.wavdata.baseline.fluidLevel = this.updateFluidLevel();
    let recordId = this.wavdata.recordId;

    if (this.dragEdited) {
      this.loading.show();
      this.fl3Service.patchFl3(recordId, { baseline: this.wavdata.baseline })
        .subscribe(res => {
          this.loading.hide();
          //  Updating the fl3Records
          this.fl3Records[this.selectedIndex].baseline = this.wavdata.baseline;
          this.swalWindowOptions = { type: 'success', title: 'Succeded', text: 'The cursors has been disabled and the Zero and Kick values has been updated' };
          setTimeout(() => { this.swal.show() }, 200);
        }, err => {
          this.errors.show();
          this.loading.hide();
        });
    }
  }

  updateFluidLevel() {
    let velocity = 0;
    if (this.fl3Settings.acousticVelocity.autoMode) {
      velocity = this.fl3Settings.acousticVelocity.autoVelocity;
    } else {
      velocity = this.fl3Settings.acousticVelocity.manualVelocity;
    }
    return ((this.wavdata.baseline.peaktime - this.wavdata.baseline.zerotime) * velocity) / 2;
  }

  updateLines() {
    this.baselineChart.xAxis[0].update({
      plotBands: [{
        color: 'rgba(238, 250, 121, 0.24)',
        from: this.zeroValue,
        to: this.peakValue
      }],
      plotLines: [{
        color: '#FF0000', // Red
        width: 2,
        value: this.zeroValue,
        zIndex: 5
      },
      {
        color: '#FF0000', // Red
        width: 2,
        value: this.peakValue,
        zIndex: 5
      }]
    });
  }

  uploadWavFile() {
    this.loading.show();
    let wavFile = this.wavFile.nativeElement;
    const wavFileForm = new FormData();
    wavFileForm.append('filename', wavFile.files[0]);

    let uid = `${this.controller}`
    let options = {
      uid: uid,
      time: new Date().getTime()
    };


    this.fl3Service.uploadWav(options, wavFileForm)
      .subscribe(async res => {
        $('#loadWav').modal('hide');
        this.loading.hide();
        await this.getAllFl3Records();
      }, err => {
        this.loading.hide();
        ////console.log(err);
      });

  }

  dragOptionsClick(type) {
    if (type === this.dragOptions) {
      return false;
    }

    dom.highlightButtons(type, this.typeButtons);
    this.dragOptions = type;

    if (type === 'lock') this.processLock();
  }

  getSensors(device) {

    let uid, controller;
    if (device && device.uid) {
      uid = device.uid;
      controller = this.controller;
    }


    return new Promise<any>((resolve, reject) => {
      if (uid) {
        this.etdService.getAnalogInputs(uid).subscribe(async (sensor: any[]) => {
          const data = [];
          this.auxSensors = await this.getSensorValues(controller);
          this.lastUpdate = this.auxSensors.sensordata.timeStamp;
          console.log('lastUpdate');
          console.log(this.lastUpdate);
          if (!this.auxSensors.sensordata.error) {
            for (let s = 0; s < sensor.length; s++) {
              sensor[s].timestamp = this.auxSensors.sensordata.timeStamp;
              switch (s) {
                case 0:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput1;
                  break;
                case 1:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput2;
                  break;
                case 2:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput3;
                  break;
                case 3:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput4;
                  break;
                case 4:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput5;
                  break;
                case 5:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput6;
                  break;
                case 6:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput7;
                  break;
                case 7:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput8;
                  break;
              }
            }
          } else {
            this.datamessage = 'No data available';
          }

          this.sensors = sensor.slice(0, 3);

          this.activedSensors = this.activeSensors();

          if (!this.sensors.length) {
            this.datamessage = 'No data available';
          }

          resolve(this.sensors);
        });
      } else {
        resolve({});
      }
    });
  }

  getSensorValues(controller): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.etdService.getSensorValues(controller).subscribe(values => {
        resolve(values);
      });
    });
  }

  capture(data) {
    let command: number;
    data === 'start' ? command = 5 : command = 6;
    if (data === 'start') {
      this.isRedraw = false;
      this.captureButton = true;
      this.captureStatus = 'Capturing';
      command = 5;
      if (this.captureMode === 'Auto' && this.fl3Settings.autoMode.numOfShots > 1) {
        this.runCaptureTimers();
      }
    } else {
      command = 6;
      this.captureStatus = false;
      this.captureStatus = 'Stopping';
    }

    this.fl3Service.capture(command, this.selectedLocation.uid)
      .subscribe(res => {
        if (command === 5) {
          let transformedResponse = transform.getFl3WavFilename(res.ack);
          this.shotStartTime = transformedResponse.shotStart;
        } else {
          this.captureStatus = 'Command stopped';
        }
      }, err => {
        ////console.log(err);
        this.captureStatus = 'Error';
      });
  }

  activeSensors() {
    let activeSensors = 0;
    this.sensors.map(sensor => {
      if (sensor.enable) activeSensors = activeSensors + 1;
    });
    return activeSensors;
  }

  openOrCloseFlotant() {
    if (this.arrowText === '>>') {
      this.closeFlotant();
    }
    else this.openFlotant();
  }

  openFlotant() {
    let flotantContainer = document.getElementById('flotant-container');
    flotantContainer.style.transition = '1s';
    flotantContainer.style.right = '208px';

    let flotantDate = document.getElementById('floating-date');
    flotantDate.style.transition = '1s';
    flotantDate.style.right = '80px';
    this.arrowText = '>>';
  }

  closeFlotant() {
    let flotantContainer = document.getElementById('flotant-container');
    flotantContainer.style.transition = '1s';
    flotantContainer.style.right = '-600px';

    let flotantDate = document.getElementById('floating-date');
    flotantDate.style.transition = '1s';
    flotantDate.style.right = '-600px';

    this.arrowText = '<<';
  }

  redrawBaseline() {
    this.loading.show();
    let data = {
      id: this.selectedLocation.locationId,
      uid: this.selectedLocation.uid,
      type: this.filterType,
      recordPath: this.wavdata.recordPath
    };
    this.fl3Service.runFilter(data)
      .subscribe(result => {
        if (this.filterType === 'baseline2' || this.filterType === 'baseline') {
          this.loading.hide();
          this.wavdata.baseline = result.baseline.meta;
          this.wavdata.baselineData = result.baseline.data;
          this.fl3Records[this.selectedIndex].baseline.fluidLevel = result.baseline.meta.fluidLevel;
          this.saveAfterRedraw();
        } else {
          //console.error('Server error, please retry');
          //console.log(result);
          this.loading.hide();
        }

      });
  }

  drawCollar() {
    this.isRedraw = true;
    this.loading.show();
    let collar = { id: this.selectedLocation.locationId, uid: this.selectedLocation.uid, type: 'collar', recordPath: this.wavdata.recordPath };
    this.fl3Service.runFilter(collar).subscribe(result => {
      this.collarData = result.collar;
      if (!this.collarData) {
        alert('Collar filter Plot Error: Please contact admin');
        this.loading.hide();
        return false;
      }
      this.collarGraphConfiguration();
      this.loading.hide();
    });
  }

  saveAfterRedraw() {
    let data = {
      baseline: {
        samplerate: this.wavdata.baseline.samplerate,
        fluidLevel: this.wavdata.baseline.fluidLevel,
        peaktime: this.wavdata.baseline.peaktime,
        zerotime: this.wavdata.baseline.zerotime
      },
      baselineData: {
        rawDataPoints: this.wavdata.baselineData.rawDataPoints,
        filteredDataPoints: this.wavdata.baselineData.filteredDataPoints
      },
      filterApplied: this.filterType === 'baseline' ? 'Baseline 1' : 'Baseline 2'
    };

    this.fl3Service.patchFl3(this.wavdata.recordId, data)
      .subscribe(fl3 => {
        this.wavdata.filterApplied = fl3.filterApplied;
      });

    this.filterData('baselineData', 'filtered');
  }

  initializeChangeStream() {

    let shot;
    const me = this;
    let url = this.fl3Service.getFl3ChangeStreamURL();
    this.source = new EventSource(url);
    this.source.addEventListener('data', async function (msg) {
      ////console.log(msg);
      var jsonData = JSON.parse(msg.data);
      shot = jsonData.data.shotNumber ? jsonData.data.shotNumber : 0;
      me.captureStatus = jsonData.data.captureStatus ? jsonData.data.captureStatus : 'No data';
      console.log('Verificaremos si isChart image is true o false');
      console.log(me.isChartImageFlag);
      console.log('verificaremos el me');
      console.log(me);
      if (me.captureStatus == 'Done' && !me.isRedraw && !me.isChartImageFlag) {
        try {
          let AllFl3Records = await me.getAllFl3Records();
          let FirstFL3Record = AllFl3Records[0];
          await me.getWavData(FirstFL3Record.recordId, 0)
          await me.getSensors(me.selectedLocation);
        }
        catch (e) {
          await me.getSensors(me.selectedLocation);
        }

      } else {
        // cambiamos ischart a false para que continúe con el proceso
        this.isChartImageFlag = false;
      }
    });
  }

  getLogIntervalByController(controller) {
    const filter = {
      uid: controller
    };
    let logInterval;
    return new Promise<any>((resolve, reject) => {
      this.deviceService.getLogIntervalByController(filter).subscribe((interval: any[]) => {
        if (interval.length > 0) {
          logInterval = interval[0].interval * 1000;
        } else {
          logInterval = 10000;
        }
        resolve(logInterval);
      });
    });
  }

  runCaptureTimers() {
    let shotInterval = this.fl3Settings.autoMode.shotInterval * 60000;
    let countDownDate = new Date().getTime() + shotInterval;

    // Update the count down every 1 second
    let x = setInterval(() => {

      // Get todays date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id='demo'
      this.timer = `->  Next shot in ${hours}h${minutes}m${seconds}s`;

      // If the count down is finished, write some text
      if (distance < 0) {
        this.timer = '';
        clearInterval(x);
        if (this.wavdata.shotNumber > 2) {
          this.runCaptureTimers();
        }
      }
    }, 1000);
  }

  async spanAdjustment(number) {
    const ntt = this.collarData.ntt;
    this.collarParams.calipers = this.collarParams.calipers + number;

    let ntdAvg = (this.collarParams.calipers / this.fl3Settings.collarAnalysis.collarCycles);
    this.collarParams = transform.collarParams(ntdAvg, this.fl3Settings, this.kickTime);
    const plotLines = transform.getCollarPlotLines(this.collarParams.calipers, ntt, this.fl3Settings.collarAnalysis.collarStartDetection);
    await this.plotCollarGraph(plotLines);
    if (!this.wavdata.isCollarGraph) this.saveChartImage('collarGraph');
  }

  async collarGraphConfiguration() {
    let ntt = this.collarData.ntt;
    let ntdAvg = this.collarData.data.ntdAvg;
    this.collarParams = transform.collarParams(ntdAvg, this.fl3Settings, this.kickTime);
    let plotLines = transform.getCollarPlotLines(this.collarParams.calipers, ntt, this.fl3Settings.collarAnalysis.collarStartDetection);
    await this.plotCollarGraph(plotLines);
    if (!this.wavdata.isCollarGraph) this.saveChartImage('collarGraph');
  }

  plotCollarGraph(plotLines) {
    return new Promise((resolve: Function, reject: Function) => {
      this.collarVisibility = true;
      const me = this;
      let data = this.collarData.filteredDataPoints;
      let startTimeForCollar = 0;

      for (let i = 0; i < data.length; i++) {
        if (i > 0) startTimeForCollar = startTimeForCollar + 0.2;
        this.collarGraphData[i] = [startTimeForCollar, data[i]];
      }
      //console.log(this.collarGraphData);
      let chartConfig = {
        chart: {
          events: {
            load: function (e) {
            }
          },
          backgroundColor: 'rgb(242,242,242)',
          zoomType: 'x',
          panning: true,
          panKey: 'shift',
          alignTicks: false
        },
        legend: {
          enabled: false
        },
        title: {
          text: ''
        },
        subTitle: {
          text: ''
        },
        rangeSelector: {
          enabled: true,
          inputEnabled: false,
          buttons: [{
            type: 'millisecond',
            count: 2000,
            text: '2s'
          }, {
            type: 'millisecond',
            count: 5000,
            text: '5s'
          }, {
            type: 'millisecond',
            count: 10000,
            text: '10s'
          }, {
            type: 'all',
            text: 'All'
          }],
          buttonTheme: {
            width: null,
            style: {
              color: '#000'
            }
          },
          labelStyle: {
            color: '#000'
          }
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          title: {
            text: 'Time (Seconds)'
          },
          tickColor: '#000',
          events: {
            setExtremes: (e: any) => {

            }
          },
          tickInterval: 1000,
          labels: {
            style: {
              color: '#000'
            },
            enabled: true,
            formatter: function () {
            }
          },
          plotBands: [{
            color: '#ffffff',
            from: me.collarGraphData,
            events: {
              click: (e) => {

              }
            }
          }],
          plotOptions: {
            series: {
              dataGrouping: {
                enabled: false
              },
              turboThreshold: 60000
            }
          }
        },
        yAxis: {
          tickColor: '#000',
          labels: {
            style: {
              color: '#000'
            }
          },
          title: {
            text: 'Amplitude',
          },
          max: this.yRangeLimits,
          min: -this.yRangeLimits,
          tickInterval: this.yRangeLimits
        },
        tooltip: {
          valueDecimals: 1,
          formatter: function () {
            let s = [];
            //let kickOffSet = me.peakValue - me.zeroValue;
            //let itemToPush = `<span style='color:#000;border:1px solid #1E537D:background-color:rgba(247,247,247,0.85);padding:5px;'>${this.x}<span><br><span>Value: ${this.y}<span><br><span>Kick: ${kickOffSet}<span>`;
            let itemToPush = `<span style='color:#000;border:1px solid #1E537D:background-color:rgba(247,247,247,0.85);padding:5px;'>X value: ${(this.x).toFixed(4)}</span><br><span>Y value: ${this.y.toFixed(4)}</span>`;
            s.push(itemToPush);
            return s.join(' and ');
          },
          positioner: (labelWidth, labelHeight, point) => {
            let tooltipX, tooltipY;
            if (point.plotX + labelWidth > me.baselineChart.plotWidth) {
              tooltipX = point.plotX + me.baselineChart.plotLeft - labelWidth - 20;
            } else {
              tooltipX = point.plotX + me.baselineChart.plotLeft + 20;
            }
            tooltipY = point.plotY + me.baselineChart.plotTop - 20;

            return {
              x: tooltipX,
              y: tooltipY
            };
          }
        },
        series: [{
          color: '#1E537D',
          name: 'Value',
          data: me.collarGraphData, //DataWithTimeStamp1,
          cursor: 'pointer',
          lineWidth: 1,
          states: {
            hover: {
              enabled: true,
              lineWidth: 1
            }
          },
        }]
      };

      this.collarChart = Highcharts.chart(this.collarGraph.nativeElement, <any>chartConfig);

      this.collarChart.xAxis[0].update({
        plotLines: plotLines
      });
      this.fl3Shared.setFl3ClickedButton('');
      resolve();
    })
  }

  requestCollarDataPoints(recordId) {
    let query = { fields: { recordId: true, collar: true }, where: { recordId: recordId } };
    return new Promise<any>((resolve, reject) => {
      this.fl3Service.getAllFl3Records(query)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
          },
          err => reject(err)
        );
    });
  }

  saveChartImage(type) {
    this.loading.show();
    // Type = baselineGraph, collarGraph
    html2canvas(document.getElementById(type)).then(async canvas => {
      // Generate the base64 representation of the canvas
      var base64image = canvas.toDataURL('image/png');
      // Split the base64 string in data and contentType
      var block = base64image.split(';');
      // Get the content type
      var mimeType = block[0].split(':')[1];// In this case 'image/png'
      // get the real base64 content of the file

      if (!block[1]) {
        console.log('data not found');
        this.saveChartImage(type);
        return false;
      } else {
        console.log('data found');
        var realData = block[1].split(',')[1];// For example:  iVBORw0KGgouqw23....

        // Convert b64 to blob and store it into a variable (with real base64 as value)
        var canvasBlob = b64toBlob(realData, mimeType);
        let result = await this.uploadScreenshot(canvasBlob, type);

        let data: any = {};
        if (type === 'baselineGraph') {
          data.isBaselineGraph = true;
        } else {
          data.isCollarGraph = true;
          data.collarParams = {
            calipers: this.collarParams.calipers,
            avgJoint: this.collarParams.jointsPerSec,
            jointToLiquid: this.collarParams.jointsToLiquid,
            acousticFactor: this.collarParams.acousticFactor
          };
        }

        this.fl3Service.patchFl3(this.wavdata.recordId, data)
          .subscribe(fl3 => {
            // Hiro, este flag define si el changestream debe actualizarse (true para actualizar)
            console.log('fl3 patched');
            this.isChartImageFlag = true;
            this.loading.hide();
          }, err => {
            this.loading.hide();
          });
      }
    });
  }

  uploadScreenshot(blob, type) {
    let container;
    if (type === 'baselineGraph') container = 'baselinerecords';
    else container = 'collarrecords';
    return new Promise<any>((resolve, reject) => {
      let userSubs = this.appShared.currentUserObject.subscribe((user: any) => {
        const clientId = user.clientId;
        const screenshotFormData = new FormData();
        screenshotFormData.append('', blob);
        this.containers.uploadImage(screenshotFormData, container, this.wavdata.recordId)
          .subscribe(res => {
            console.log('res');
            console.log(res.toLowerCase());
            resolve(res);
          }, err => {
            //console.log(err);
            reject(err);
          });
      });
    });
  }
}
