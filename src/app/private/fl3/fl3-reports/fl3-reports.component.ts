import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';
import { FL3SharedService } from '../fl3-shared.service';
import { LoadingService } from '../../shared/loading.service';

import { FL3Service } from '../fl3.service';

import { IFl3Record } from '../../../common/models/fl3record';

import Swal from 'sweetalert2'

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import * as Highcharts from 'highcharts/highcharts';
import * as HighchartsExporting from 'highcharts/modules/exporting.src';
import * as HighchartsBoosting from 'highcharts/modules/boost.src';

import { createImageInDataURL, formatDateForChart } from '../../../common/helpers/helpers';

HighchartsExporting(Highcharts);
HighchartsBoosting(Highcharts);

@Component({
    selector: 'app-fl3-reports',
    templateUrl: './fl3-reports.component.html',
    styleUrls: ['./fl3-reports.component.css']
})
export class FL3ReportsComponent implements OnInit {
    public selectedLocation;
    public availableRecords;
    public selectedRecords;
    public imagesForReport;
    public fl3Settings;

    public logoDataURL: string;
    public overviewGraphDataURL: string;

    public isSelectedCollar: boolean = false;
    constructor(private readonly router: Router,
                private readonly fl3Service: FL3Service,
                private readonly appShared: AppSharedService,
                private readonly loading: LoadingService,
                private readonly activeRoute: ActivatedRoute, 
                private readonly fl3Shared: FL3SharedService) {
      this.imagesForReport = [];
      this.availableRecords = [];
      this.selectedRecords  = [];
    }


    // RXJS Subscriptions
    public SUBS = {
      location: <any>{},
      isCollar : <any>{}
    };

    async ngOnInit() {
      this.loading.show();
      this.logoDataURL = await createImageInDataURL('/containers/clientbanner/download/pit.jpeg', null);
      // get Location
      this.SUBS.location = this.appShared.currentLocationObj.debounceTime(2500).subscribe(async location => {
        this.selectedLocation = location;
        if (location['locationId']) {
          this.fl3Settings = await this.getAllFl3SettingsByLocationId(location['locationId']);
          await this.getAllFl3Records();
        }
      });
    }

    getAllFl3SettingsByLocationId(locationId) {
      return new Promise((resolve: Function, reject: Function) => {
        this.fl3Service.getFl3SettingsById(locationId)
          .subscribe(fl3Settings => {
            resolve(fl3Settings);
          }, error => {
            reject(error);
          });
      });
    }

    getAllFl3Records() {
        return new Promise( (resolve,reject) => {
          let query = {
            fields: {
              filterApplied: true,
              recordId: true,
              uid: true,
              captureTimestamp: true,
              baseline: true,
              captureStatus: true,
              acousticVelocity: true,
              casingPressure: true,
              measurementUnit: true,
              isBaselineGraph: true,
              isCollarGraph: true,
              collarParams: true
            },
            order: 'captureTimestamp DESC',
            where: {
              //  uid: this.selectedDevice.uid,
              captureStatus: 'Done',
              locationId: { like : this.selectedLocation.locationId}
              //projectId: this.selectedLocation.projectId
            }
          };


          this.fl3Service.getAllFl3Records(query).subscribe(async availableRecords => {
            this.availableRecords = availableRecords;
            console.log('available records');
            console.log(this.availableRecords);
            let recordsForReport = this.fl3Service.getRecordsForReport();

            for (var i = 0; i < this.availableRecords.length; i++) {
              let exists = recordsForReport.find(recordId => this.availableRecords[i].recordId == recordId);
              if (exists) {
                  this.availableRecords[i].selected = true;
                  this.selectedRecords.push(this.availableRecords[i]);
              }
            }
            this.loading.hide();
          });

        })

    }

    selectRecord(item, $index) {
        item.selected = true;
        this.fl3Service.addItemToReport(item.recordId);
        this.selectedRecords.push(item)
    }

    unselectRecord(item, $index) {
        item.selected = false;
        this.fl3Service.removeItemToReport(item.recordId);
        this.selectedRecords.splice($index, 1);
    }

    async generateReport() {
        this.loading.show();

        let data: IFl3Record[] = this.selectedRecords;
        data.map(item => item.collarImageURL = `/containers/clientcollarrecords/download/${item.recordId.toLowerCase()}.jpeg`);
        data.map(item => item.baselineImageURL = `/containers/clientbaselinerecords/download/${item.recordId.toLowerCase()}.jpeg`);
        data.sort(function(a, b) {
            let dateA: any = new Date(a.captureTimestamp), dateB: any = new Date(b.captureTimestamp);
            return dateA - dateB;
        });
        console.log(data);
        await this.buildChart(data);

        let doc = new jsPDF();


        /*
        *  PDF RENDERIZATION
        */

        /*
        *  FIRST PAGE (LOGO)
        */
        const project = localStorage.project;
        doc.addImage(this.logoDataURL, 'JPEG', 56, 80, 100, 60);

        doc.setFontSize(20);
        doc.text(100, 150, 'FL3');
        doc.setFontSize(14);
        doc.text(75, 160, 'Acoustic Fluid Level Report');
        doc.setFontSize(12);
        doc.text(94, 170, project);

        /*
        *  SECOND PAGE (OVERVIEW GRAPH)
        */
        doc.addPage();
        console.log(this.fl3Settings);
        doc.setFontSize(16);
        doc.setFontStyle('bold');
        doc.text(7, 50, 'Overview Graph');
        doc.addImage(this.overviewGraphDataURL, 'JPEG', 7, 60, 200, 60);
        doc.setFontSize(12);
        doc.setFontStyle('bold');
        doc.text(7, 140, 'User Settings Applied:');
        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text(7, 155, 'Shot recording algorithm used:');
        doc.text(20, 165, `° FL3 listens for 500ms and waits for ${(this.fl3Settings.baselineGraph.zeroTimeDetection)*1000}ms before searching for the shot location.`);
        doc.text(20, 170, `° The Zero location is detected by the first peak with an amplitude of ${this.fl3Settings.baselineGraph.zeroDetectionLevel}.`);
        doc.text(20, 175, `° FL3 Acoustic filter waits ${this.fl3Settings.baselineGraph.kickTimeDetection} seconds before searching for the kick.`);

        let largeText = doc.splitTextToSize('The kick is the pulse that is recorded when the shot is echoed back to the microphone.', 200);
        doc.text(7, 185, largeText);

        /*
        *  THIRD PAGE (ALL DATA RECORDS)
        */

        let baselineImageData;
        let collarImageData;
        let zeroValue;
        let peakValue;
        let kickTime;
        let measurement;
        let units: any = {};
        let params : any = {};

        //  Establecemos un contador (no utilizaremos el del for, el contador aplicará cada item para/impar, no 
        //  contabilizará si existe una falla)

        for(var i = 0; i < data.length; i++) {
            if (data[i].measurementUnit === 1) {
                //  Metric
                units.casingPressure = 'kPa';
                units.fluidLevel = 'm';
            } else {
                //  Imperial
                units.casingPressure = 'psi';
                units.fluidLevel = 'ft';
            }
            zeroValue = parseFloat(data[i].baseline.zerotime) * 1000;
            peakValue = parseFloat(data[i].baseline.peaktime) * 1000;

            kickTime  = peakValue - zeroValue;
            if (!this.isSelectedCollar) {
              try {
                baselineImageData = await createImageInDataURL(data[i].baselineImageURL, data[i].recordId);
                if (i % 2 === 0) {
                    doc.addPage();
                    params.hourValign = 30;
                    params.resultsValign = 40;
                    params.summaryValign = 45;
                    params.filterAppliedValign = 50;
                    params.chartValign = 55;
                } else {
                    params.hourValign = 165;
                    params.resultsValign = 175;
                    params.summaryValign = 180;
                    params.filterAppliedValign = 185;
                    params.chartValign = 195;
                }

                doc.setFontSize(18);
                console.log('fecha aqui');
                console.log(data[i].captureTimestamp);
                let date = formatDateForChart(data[i].captureTimestamp);
                console.log('transformada');
                console.log(date);
                doc.text(7, params.hourValign, date);
                doc.setFontStyle('bold');
                doc.setFontSize(12);
                doc.text(7, params.resultsValign, 'Results:');
                doc.setFontStyle('normal');
                doc.setFontSize(9);

                let acousticVelocity;
                if (data[i].acousticVelocity.autoMode === 1) acousticVelocity = data[i].acousticVelocity.autoVelocity;
                if (data[i].acousticVelocity.manualMode === 1) acousticVelocity = data[i].acousticVelocity.manualVelocity;

                doc.text(7, params.summaryValign, `Fluid Level Detected at ${(kickTime/1000).toFixed(2)} seconds = ${data[i].baseline.fluidLevel.toFixed(2)} ${units.fluidLevel} based on acoustic velocity of ${acousticVelocity} ${units.fluidLevel}/second with a casing pressure of ${data[i].casingPressure} ${units.casingPressure}.`);
                doc.text(7, params.filterAppliedValign, `Filter Applied:  ${data[i].filterApplied}`);
                
                doc.addImage(baselineImageData, 'JPEG', 7, params.chartValign, 200, 70);
              } catch (recordId) {
                console.log(recordId);
              }              
            } else {
              try {
                baselineImageData = await createImageInDataURL(data[i].baselineImageURL, data[i].recordId);
                collarImageData = await createImageInDataURL(data[i].collarImageURL, data[i].recordId);
                doc.addPage();
                params.hourValign = 30;
                params.resultsValign = 40;
                params.summaryValign = 45;
                params.filterAppliedValign = 50;
                params.chartValign = 55;

                let date = formatDateForChart(data[i].captureTimestamp);
                doc.setFontSize(18);
                doc.text(7, params.hourValign, date);
                doc.setFontStyle('bold');
                doc.setFontSize(12);
                doc.text(7, params.resultsValign, 'Results:');
                doc.setFontStyle('normal');
                doc.setFontSize(9);

                let acousticVelocity;
                if (data[i].acousticVelocity.autoMode === 1) acousticVelocity = data[i].acousticVelocity.autoVelocity;
                if (data[i].acousticVelocity.manualMode === 1) acousticVelocity = data[i].acousticVelocity.manualVelocity;

                doc.text(7, params.summaryValign, `Fluid Level Detected at ${(kickTime/1000).toFixed(2)} seconds = ${data[i].baseline.fluidLevel.toFixed(2)} ${units.fluidLevel} based on acoustic velocity of ${acousticVelocity} ${units.fluidLevel}/second with a casing pressure of ${data[i].casingPressure} ${units.casingPressure}.`);
                doc.text(7, params.filterAppliedValign, `Filter Applied:  ${data[i].filterApplied}`);
                
                doc.addImage(baselineImageData, 'JPEG', 7, params.chartValign, 200, 70);

                doc.setFontSize(18);
                doc.text(7, 165, 'Collar Graph');

                

                /* Calipers */
                let calipers = data[i].collarParams.calipers ? data[i].collarParams.calipers.toFixed(2) : 0;
                doc.setFontSize(10);
                doc.setFontStyle('bold');
                doc.text(7, 180, 'Calipers: ');
                doc.setFontSize(8);
                doc.setFontStyle('normal');
                doc.text(26, 180, `${calipers} mS`);

                /* Avg Joint Per Sec */
                let avgJoint = data[i].collarParams.avgJoint ? data[i].collarParams.avgJoint.toFixed(2) : 0;
                doc.setFontSize(10);
                doc.setFontStyle('bold');
                doc.text(47, 180, 'Avg Joint Per Sec: ');
                doc.setFontSize(8);
                doc.setFontStyle('normal');
                doc.text(82, 180,`${avgJoint} Jts/sec`);

                /* Joint To Liquid */
                let jointToLiquid = data[i].collarParams.jointToLiquid ? data[i].collarParams.jointToLiquid.toFixed(2) : 0;
                doc.setFontSize(10);
                doc.setFontStyle('bold');
                doc.text(107, 180, 'Joint To Liquid: ');
                doc.setFontSize(8);
                doc.setFontStyle('normal');
                doc.text(135, 180, `${jointToLiquid}jts`);

                /* Acoustic Factor */
                let acousticFactor = data[i].collarParams.acousticFactor ? data[i].collarParams.acousticFactor.toFixed(2) : 0;
                doc.setFontSize(10);
                doc.setFontStyle('bold');
                doc.text(155, 180, 'Acoustic Factor: ');
                doc.setFontSize(8);
                doc.setFontStyle('normal');
                doc.text(185, 180, `${acousticFactor}${this.fl3Settings.measurementUnit === 1 ? 'm/s': 'ft'}`);

                doc.addImage(collarImageData, 'JPEG', 7, 195, 200, 70);

              } catch (recordId) {
                console.log(recordId);
              }               
            }

        }

        this.loading.hide();
        doc.save(`fl3-report-${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDay()}`);
    }

    buildChart(data) {
        return new Promise(async (resolve: Function) => {
            let datesArray = data.map(item => item.captureTimestamp);
            let fluidLevels = data.map(item => item.baseline.fluidLevel);
            const title = {
                text: 'FL3 Overview Graph'   
            };
            const xAxis = {
                categories: datesArray       
            };
            const yAxis = {
               title: {
                  text: 'Fluid Level'
               },
               plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
               }]
            };   

            const plotOptions = {
                line: {
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                          return this.y.toFixed(2);
                        },
                    },
                    enableMouseTracking: false
                }
            };
                
            const series =  [{
                name: 'Date-time',
                data: fluidLevels
               }
            ];

            const legend = {
                enabled: false
            };

            const chart = {
                events: {
                    render: event => {
                        setTimeout(async () => {
                            await this.overviewGraphToCanvas();
                            resolve();
                        }, 1500);
        
                    }
                }
            };

            const options: any = {};
            options.plotOptions = plotOptions;
            options.title = title;
            options.xAxis = xAxis;
            options.yAxis = yAxis;
            options.legend = legend;
            options.series = series;
            options.chart = chart;

            Highcharts.chart('container', options); 
        });

    }

    overviewGraphToCanvas() {
        return new Promise((resolve: Function) => {
            html2canvas(document.getElementById('container')).then(async canvas => {
                // Generate the base64 representation of the canvas
                var base64image = canvas.toDataURL("image/png");
                this.overviewGraphDataURL = base64image;
                resolve();
            });

        });
    }

    ngOnDestroy() {
      this.SUBS.location.unsubscribe();
    }
}

