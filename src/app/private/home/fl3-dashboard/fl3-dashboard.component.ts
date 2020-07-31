import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppSharedService } from '../../../app.shared-service';

import { FL3Service } from '../fl3.service';

import * as transform from '../../../common/fl3-filters/transformers';
import * as Highcharts from 'highcharts/highstock';

import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-fl3-dashboard',
  templateUrl: './fl3-dashboard.component.html',
  styleUrls: ['./fl3-dashboard.component.css']
})

export class FL3DashboardComponent implements OnInit {
  @ViewChild("container", { read: ElementRef }) container: ElementRef;
  public wavdata;
  public loadsettings;

  public yRangeLimits = 32768;
  public chart;
  public options;
  public DataWithTimeStamp1;

  //  Sensible data
  public zeroValue;
  public peakValue;

  public fluidZeroValue;
  public tempFluidPeakValue;

  public interval;

  public dragOptions;

  //  Hardcoded values
  public demo1 = 1;
  public demo2 = 1;
  //  Hardcoded values

  public clickCounter = 0;

  public settingsConfig;

  constructor (private fl3Service: FL3Service, private appShared: AppSharedService) {
    this.wavdata = [];
    this.loadsettings = [];
    this.dragOptions = 'lock';
    this.settingsConfig = {};
  }

  getWavData() {
    this.fl3Service.getWavData()
      .subscribe(wavdata => {
        this.wavdata = wavdata;
        if (wavdata != null && wavdata != '') {
          //  Si la respuesta es mayor que 1, el segundo grafico se activa
          if (wavdata.length > 1) {
              //  Mostrar el segundo grafico
          }
          else {
              //  Si la respuesta es 1 o menos, no se mostrará el grafico
             //  Ocultar el segundo grafico
          }
          this.getSettingsLoadWithGraphType();
        }
      });
  }

  getSettingsLoadWithGraphType() {
    this.fl3Service.loadSettingsWithGraphType()
      .subscribe(settingsLoad => {
        if (settingsLoad != null && settingsLoad.length > 0) {

            if (settingsLoad[0].ModeType == 0) {
                // Modetype 0
                // Getting params from -> AMNumberOfShots, AMShotDuration, AMShotInterval.
                this.settingsConfig.onSOM = 0;
                this.settingsConfig.offSOM = 0;
                this.settingsConfig.modeType = 'Auto Capture Mode';
                this.settingsConfig.numberOfShots = settingsLoad[0].AMNumberOfShots;
                this.settingsConfig.shotDuration = transform.millisecondsToMSM(settingsLoad[0].AMShotDuration);
                this.settingsConfig.shotInterval = transform.secondsToHMS(settingsLoad[0].AMShotInterval);
                //  NumberofShots = true (visible);
                //  ShotInterval = true (visible);
                //  NumberSection = true (visible);

            }
            else if (settingsLoad[0].ModeType == 1) {
                // Modetype 1
                // Getting params from -> MMShotDuration.
                this.settingsConfig.onSOM = 1;
                this.settingsConfig.offSOM = 1;
                this.settingsConfig.modeType = 'Manual Capture Mode';
                this.settingsConfig.shotDuration = transform.millisecondsToMSM(settingsLoad[0].MMShotDuration);
                //  NumberofShots = false (not visible);
                //  ShotInterval = false (not visible);
                //  NumberSection = false (not visible);
            }
            else if (settingsLoad[0].ModeType == 2) {
                // Modetype 2
                // Getting params from -> LMShotDuration.
                this.settingsConfig.onSOM = 2;
                this.settingsConfig.offSOM = 2;
                this.settingsConfig.modeType = 'Listen Mode';
                this.settingsConfig.shotDuration = transform.secondsToMS(settingsLoad[0].LMShotDuration);
                //  NumberofShots = false (not visible);
                //  ShotInterval = false (not visible);
                //  NumberSection = false (not visible);
            }

            if (localStorage.getItem('IP') != '' && localStorage.getItem('IP') != 'null') {
                //  Si no existe localstorage ip, creamos uno
                //localStorage.setItem('IP', localStorage.getItem('IP'));
            }
            else {
                //  Si existe el localStorage de lip, evaluamos el modetype
                if (settingsLoad[0].ModeType == '0') {
                    localStorage.setItem('IP', settingsLoad[0].EthernetIP);
                }
                else if (settingsLoad[0].ModeType == '1') {
                    localStorage.setItem('IP', settingsLoad[0].WiFiIP);
                }
                else if (settingsLoad[0].ModeType == '2') {
                    localStorage.setItem('IP', settingsLoad[0].CellularIP);
                }
            }


            //  Creamos localStorage
            localStorage.setItem("UpdatedStartTimeForCollar", this.wavdata[0].UpdatedStartTimeForCollar);
            localStorage.setItem("UpdatedIntervalTimeForCollar", this.wavdata[0].UpdatedIntervalTimeForCollar);

            var cliperInterval = localStorage.getItem("ClipersInterval");
            if (cliperInterval == null || cliperInterval == undefined) {
                $(".cliperInterval").text("34.5" + ' ms');
                $(".avgJointPerSec").text("28.99" + ' Jts/sec');
                $(".jointToLiquid").text("235.42" + ' Jts');
            }
            else {
                $(".cliperInterval").text(cliperInterval + ' ms');
                $(".avgJointPerSec").text(localStorage.getItem("AvgJointPerSec") + ' Jts/sec');
                $(".jointToLiquid").text(localStorage.getItem("jointToLiquid") + ' Jts');
            }

            localStorage.setItem('CollarStartDetection', settingsLoad[0].CollarStartDetection);
            localStorage.setItem('NumberPeaks', settingsLoad[0].NumberPeaks);
            localStorage.setItem('ModeType', settingsLoad[0].ModeType);
            localStorage.setItem('PumpDepth', settingsLoad[0].PumpDepth);
            localStorage.setItem('WellDepth', settingsLoad[0].WellDepth);
            localStorage.setItem('NumberOfCollarDetected', settingsLoad[0].NumberOfCollarDetected);
            localStorage.setItem('AcousticVelocity', settingsLoad[0].AcousticVelocity);
            localStorage.setItem('ZeroTimeDetection', settingsLoad[0].ZeroTimeDetection);
            localStorage.setItem('PeakDetectionLevel', settingsLoad[0].PeakDetectionLevel);
            localStorage.setItem('KickDetection', settingsLoad[0].KickDetection);
            localStorage.setItem('UnitsMeasurement', settingsLoad[0].UnitsMeasurement);
            localStorage.setItem('SearchZero', settingsLoad[0].SearchZero);
            localStorage.setItem('DefaultGraphType', settingsLoad[0].DefaultGraphType);
            localStorage.setItem('DefaultFiltersApplied', settingsLoad[0].DefaultFiltersApplied);
            if (settingsLoad[0].CasingPressure != '' && settingsLoad[0].CasingPressure != null && settingsLoad[0].CasingPressure != '0') {
                $('.firstgraph .CasingPressureCalculatedValue').html(settingsLoad[0].CasingPressure);
                //console.log('From database');
            }
            else {
                var SensorHeaderUnits =  "2.70kPa"; //  Modified  $('#cp1').text();
                var pattern = "kPa"; // Modified $('#cp1 .header-unit').text();
                let splittedData = SensorHeaderUnits.split(pattern);
                SensorHeaderUnits = splittedData[0] + ' ' + 'kPa'
                //$('.firstgraph .CasingPressureCalculatedValue').html(SensorHeaderUnits);
                //console.log('Empty from database');
            }

            if (this.wavdata[0].DefaultFiltersApplied == '1') {
                $('input[class=AcousticVelocity]').prop('checked', true);
                localStorage.setItem('AcousticVelocityChecked', '1');
            }
            else {
                $('input[class=AcousticVelocity]').prop('checked', false);
                localStorage.setItem('AcousticVelocityChecked', '0');
            }

            if (localStorage.getItem('NewCapture') == '1') {
                localStorage.setItem('GraphType', localStorage.getItem('DefaultGraphType'));
                $('input[name=GraphType][value=' + localStorage.getItem('DefaultGraphType') + ']').prop('checked', true);
                localStorage.setItem('NewCapture', '0');
            }
            else {
                localStorage.setItem('GraphType', settingsLoad[0].GraphType);
                $('input[name=GraphType][value=' + settingsLoad[0].GraphType + ']').prop('checked', true);
            }

            localStorage.setItem('WellDepth', settingsLoad[0].WellDepth);
            //  Modified Functions UnitsLoad();

            let LoadFirstGraphOnly = true;
            if (this.wavdata.length > 0) {
                if (LoadFirstGraphOnly == true) {
                    if (this.wavdata.length >= 1) {
                        //$('.firstgraph .FileName').val('wavdata[0].FileName');
                        //$('.firstgraph .DownloadFile').attr('href', FTPURL + localStorage.getItem('ProjectId') + '_' + localStorage.getItem('ProjectName') + '/' + wavdata[0].FileName + '.wav');
                        //$('.firstgraph .DownloadFile').attr('download', wavdata[0].FileName);

                        //  Obtenemos la
                        var captureDateTime = this.wavdata[0].FileName.toString().replace(/_/gi, ':');
                        captureDateTime = captureDateTime.replace(/FL3:/gi, '');
                        captureDateTime = captureDateTime.slice(0, 10) + ' ' + captureDateTime.slice(11);
                        captureDateTime = captureDateTime.split(' ');
                        captureDateTime = captureDateTime[0].replace(/:/gi, '-') + ' ' + captureDateTime[1];
                        //captureDateTime = captureDateTime.split(' ')[0].split('-')[2] + '-' + captureDateTime.split(' ')[0].split('-')[1] + '-' + captureDateTime.split(' ')[0].split('-')[0] + ' ' + captureDateTime.split(' ')[1];
                        $('.firstgraph .CaptureTime').html((captureDateTime));
                        //$('.firstgraph .CaptureTime').data('info', '222');
                        // Sample rate, zero level, peak level and interval
                        var SampleRate1 = this.wavdata[0].SamplingRate;

                        if (this.wavdata[0].UpdatedZeroLevel != '' && this.wavdata[0].UpdatedZeroLevel != null) {
                            this.wavdata[0].UpdatedZeroLevel = transform.addDot(this.wavdata[0].UpdatedZeroLevel);
                            this.wavdata[0].UpdatedPeakLevel = transform.addDot(this.wavdata[0].UpdatedPeakLevel);
                        }
                        else {
                            this.wavdata[0].UpdatedZeroLevel = '0.000';
                            this.wavdata[0].UpdatedPeakLevel = '0.000';
                        }
                        var StartPoint1 = this.wavdata[0].UpdatedZeroLevel;
                        var PeakLevel1 = this.wavdata[0].UpdatedPeakLevel;
                        var Interval1 = this.wavdata[0].Interval;
                        var Data1 = this.wavdata[0].DataPoints;


                        var DataCollarAnalysis = this.wavdata[0].CollarAnalysisDataPoints;
                        if (DataCollarAnalysis != null && DataCollarAnalysis != undefined) {
                            localStorage.setItem("CollarAnalysisDataPoints", this.wavdata[0].CollarAnalysisDataPoints);
                        }
                        else {
                            localStorage.setItem("CollarAnalysisDataPoints", '0');
                        }


                        var TempStartPoint1 = this.wavdata[0].UpdatedZeroLevel.toString().split(".")[0];
                        var TempStartPoint2 = this.wavdata[0].UpdatedZeroLevel.toString().split(".")[1].substring(0, 3);
                        StartPoint1 = Date.UTC(2017, 3, 21, 0, 0, TempStartPoint1, TempStartPoint2);
                        var ZeroLevel1 = StartPoint1;

                        TempStartPoint1 = this.wavdata[0].UpdatedPeakLevel.toString().split(".")[0];
                        TempStartPoint2 = this.wavdata[0].UpdatedPeakLevel.toString().split(".")[1].substring(0, 3);
                        PeakLevel1 = Date.UTC(2017, 3, 21, 0, 0, TempStartPoint1, TempStartPoint2);

                        //if (wavdata[0].UpdatedFilter == 'Acoustic Velocity') {
                        //    $('.firstgraph .AcousticVelocity').prop('checked', true);
                        //}
                        //else {
                        //    $('.firstgraph .AcousticVelocity').prop('checked', false);
                        //}

                        //$('.firstgraph .fluid-level .interval').val(Math.round((Math.round(1000 / parseInt(Interval1))) / 8));
                        $('.firstgraph .interval').val(Math.round(1000 / parseInt(Interval1)));

                        //  $('.firstgraph .FluidZeroValue').val(ZeroLevel1);
                        //  $('.firstgraph .FluidPeakValue').val(PeakLevel1);
                        this.interval = Math.round(1000 / parseInt(Interval1));
                        this.fluidZeroValue = ZeroLevel1;
                        this.tempFluidPeakValue = PeakLevel1;

                        PeakLevel1 = transform.subtractMinFromDate(PeakLevel1, transform.getHoursFromTimestamp(StartPoint1), transform.getMinutesFromTimestamp(StartPoint1), transform.getSecondsFromTimestamp(StartPoint1), transform.getMillisecondsFromTimestamp(StartPoint1));
                        StartPoint1 = transform.subtractMinFromDate(StartPoint1, transform.getHoursFromTimestamp(StartPoint1), transform.getMinutesFromTimestamp(StartPoint1), transform.getSecondsFromTimestamp(StartPoint1), transform.getMillisecondsFromTimestamp(StartPoint1));

                        this.zeroValue = StartPoint1;
                        this.peakValue = PeakLevel1;
                        $('.firstgraph .zero-value').val(StartPoint1);
                        $('.firstgraph .peak-value').val(PeakLevel1);
                        $('.firstgraph .collar-analysis .collar-analysis-start').val(StartPoint1);

                        var StartTime1 = 1492732800000;
                        StartTime1 = transform.subtractMinFromDate(StartTime1, transform.getHoursFromTimestamp(ZeroLevel1), transform.getMinutesFromTimestamp(ZeroLevel1), transform.getSecondsFromTimestamp(ZeroLevel1), transform.getMillisecondsFromTimestamp(ZeroLevel1));
                        StartTime1 = StartTime1 - parseInt('1'/* $('.firstgraph .interval').val() */);

                        //$('.firstgraph').find('.data').val(Data1);
                        Data1 = Data1.split(',');
                        localStorage.setItem('TotalDataPoints', Data1.length);
                        this.DataWithTimeStamp1 = new Array();
                        for (var i = 0; i < Data1.length; i++) {
                            //if ((parseInt(i) % 8) == 0) {
                            StartTime1 = StartTime1 + parseInt('1'/*$('.firstgraph .interval').val()*/);
                            this.DataWithTimeStamp1.push([StartTime1, parseInt(Data1[i])]);
                            //}
                        }

                        //collar graph Starts
                        var StartTimeforCollarGraphStatic = 1492732800000;
                        var CollarStartDetection = localStorage.getItem('CollarStartDetection');
                        var StartTimeforCollarGraph = StartTimeforCollarGraphStatic + (parseInt(CollarStartDetection) * 1000);


                        localStorage.setItem('CollarAnalysisTime', this.wavdata[0].CollarAnalysisTime);
                        localStorage.setItem('CollarAnalysisInterval', this.wavdata[0].CollarAnalysisInterval);

                        var CollarAnalysisIntervalAverage;
                        var CollarAnalysisIntervalSum = 0;
                        var CollarAnalysisIntervalArray = localStorage.getItem('CollarAnalysisInterval').split(',');
                        for (var i = 0; i < CollarAnalysisIntervalArray.length; i++) {

                            CollarAnalysisIntervalSum = CollarAnalysisIntervalSum + parseFloat(CollarAnalysisIntervalArray[i]);
                        }
                        CollarAnalysisIntervalAverage = CollarAnalysisIntervalSum / CollarAnalysisIntervalArray.length;
                        //CollarAnalysisIntervalAverage = CollarAnalysisIntervalAverage.toFixed(3).toString();
                        //  //console.log("CollarAnalysisIntervalAverage: " + CollarAnalysisIntervalAverage);
                        //CollarAnalysisIntervalAverage = CollarAnalysisIntervalAverage.replace('.', '');

                        localStorage.setItem('CollarAnalysisIntervalAverage', CollarAnalysisIntervalAverage);

                        if (DataCollarAnalysis != null && DataCollarAnalysis != undefined) {
                            $('.firstgraph').find('.dataCollar').val(DataCollarAnalysis);
                            DataCollarAnalysis = DataCollarAnalysis.split(',');
                            localStorage.setItem('TotalCollarAnalysisDataPoints', DataCollarAnalysis.length);
                            var DataWithTimeStampForCollarGraph = new Array();
                            var a = 0;
                            for (var i = 0; i < DataCollarAnalysis.length; i++) {
                                if (i == 0) {
                                    StartTimeforCollarGraph = StartTimeforCollarGraph;
                                }
                                else {
                                    StartTimeforCollarGraph = StartTimeforCollarGraph + 1;//parseInt(CollarAnalysisIntervalAverage);
                                }
                                DataWithTimeStampForCollarGraph[a] = new Array(StartTimeforCollarGraph, parseInt(DataCollarAnalysis[i]));
                                a++;
                            }
                        }
                        //  //console.log("DataWithTimeStampForCollarGraph:" + JSON.stringify(DataWithTimeStampForCollarGraph));

                        // Modified Function CalculateFluidValue($('.firstgraph'));
                        var LineTime1 = parseInt(StartPoint1) - parseInt('1'/*$('.firstgraph .interval').val()*/);
                        var LinePlots = [];
                        for (var i = 0; i < settingsLoad[0].NumberOfCollarDetected; i++) {
                            LineTime1 = LineTime1 + parseInt('1'/*$('.firstgraph .interval').val()*/);

                            LinePlots.push({ color: '#FF0000', width: 2, value: LineTime1, zIndex: 5 });
                        }

                        LinePlots.push({ color: '#FF0000', width: 2, value: PeakLevel1,  zIndex: 5 });

/*                        $('.firstgraph').find('[name=yRange]').change(function () {
                            yRange = $(this).val();
                            window.chart1.yAxis[0].update({
                                max: yRange,
                                min: -yRange,
                                tickInterval: yRange
                            });
                        });*/
                        //  $('#FluidGraph1 .highcharts-plot-lines-5 path').remove();




                       //  NEW CODE
                       this.runFirstChart();

                       //  NEW CODE
                    }
                }
            }
        }
        else {
            $('.FilterApplied').prop('disabled', false);
            $('.FilterApplied').html('Update');
            //$('.loading-content').hide();
            //  HideLoading(true);
            //alert('error');
        }
      })
  }

  async ngOnInit() {
    await this.getWavData();
    //await this.runChart();
  }

  runFirstChart() {
    /*    this.options = {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Linechart'
        },
        rangeSelector: {
          enabled: true,
          selected: 4,
          inputEnabled: true
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: 'Line 1',
            data: [1, 2, 3]
          }
        ]
      }
    this.chart = new Chart(this.options); */
      var _this = this;
      this.chart = Highcharts.stockChart(this.container.nativeElement, {
        chart: {
          events: {
            load: function(e) {
              setTimeout(function() {
                _this.chart.xAxis[0].setExtremes(_this.zeroValue - 200, _this.peakValue + 200);
              }, 100);
            }
          },
          zoomType: 'x',
          panning: true,
          panKey: 'shift',
          alignTicks: false,
          backgroundColor: 'rgb(242,242,242)'
        },
        legend: {
          enabled: false
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        rangeSelector: {
          enabled: true,
          inputEnabled: false,
          buttons: [{
            type: 'millisecond',
            count: 2000,
            text: '2s'
          },
          {
            type: 'millisecond',
            count: 5000,
            text: '5s'
          },
          {
            type: 'millisecond',
            count: 10000,
            text: '10s'
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
            color:'#000'
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
            afterSetExtremes: (e) => {
              // //console.log(e);
              // this.button = e.rangeSelectorButton.count;

            },
            setExtremes: (e: any) => {
              if (e.rangeSelectorButton) {
                if(e.rangeSelectorButton.type == 'viewselection') {
                  let aditional = 200;
                  let difference = _this.peakValue - _this.zeroValue;
                  if(difference < 800) aditional = 10;

                  setTimeout(() => {
                    _this.chart.xAxis[0].setExtremes(_this.zeroValue - aditional, _this.peakValue + aditional);
                  }, 100);
                }
              }
            }
          },
          tickInterval: 1000,
          labels: {
            style: {
              color: '#000'
            },
            enabled: true,
            formatter: function() {
              return (transform.getSecondsFromTimestamp(this.value) + ':' + transform.getMillisecondsFromTimestamp(this.value));
            }
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
          formatter: function() {
            let s = [];
            let kickOffSet = _this.peakValue - _this.zeroValue;
            let itemToPush = `<span style="color:#000;border:1px solid #1E537D:background-color:rgba(247,247,247,0.85);padding:5px;">${transform.getHoursFromTimestamp(this.x)}:${transform.getMinutesFromTimestamp(this.x)}.${transform.getSecondsFromTimestamp(this.x)}.${transform.getMillisecondsFromTimestamp(this.x)}<span><br><span>Value: ${this.y}<span><br><span>Kick: ${transform.getSecondsFromTimestamp(kickOffSet)}.${transform.getMillisecondsFromTimestamp(kickOffSet)}<span>`;
            s.push(itemToPush);
            return s.join(' and ');
          },
          positioner: (labelWidth, labelHeight, point) => {
            let tooltipX, tooltipY;
            if (point.plotX + labelWidth > _this.chart.plotWidth) {
                tooltipX = point.plotX + _this.chart.plotLeft - labelWidth - 20;
            } else {
                tooltipX = point.plotX + _this.chart.plotLeft + 20;
            }
            tooltipY = point.plotY + _this.chart.plotTop - 20;
            alert(tooltipX);
            alert(tooltipY);
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
          data: this.DataWithTimeStamp1
        }],
        plotOptions: {
          series: {
            turboThreshold:3000,
            cursor: 'pointer',
            point: {
                events: {
                    click: function(e){
                      if(_this.dragOptions == 'zero') _this.dragAxis('zero', e.point.x);
                      if(_this.dragOptions == 'peak') _this.dragAxis('peak', e.point.x);
                      if(_this.dragOptions == 'lock') _this.dragAxis('lock');

                    }.bind(this)
                }
            }
          }
        },
        navigator: {
          enabled: true,
          xAxis: {
            labels: {
              formatter: function() {
                return (transform.getSecondsFromTimestamp(this.value) + ':' + transform.getMillisecondsFromTimestamp(this.value));
              }
            }
          }
        }
      });
  }

  updateChart() {

  }


  wellViewBar() {

  }

  async dragAxis(type, value?) {
    if(type === 'zero') {
      //this.zeroValue = value;
      await this.processZeroValue(value);
    }
    else if(type === 'peak') this.peakValue = value;

    if(type !== 'plot') {
      this.chart.xAxis[0].update({
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
  }

  processZeroValue(selectedPoint) {
    return new Promise<any>((resolve, reject) => {
      let result = parseInt(this.zeroValue, 10) - parseInt(selectedPoint, 10);
      result = result * this.interval;

      this.fluidZeroValue = this.fluidZeroValue - (result - 1);
      this.peakValue = this.peakValue + (result - 1);
      this.adjustZeroValue();
      resolve();
    });
  }

  processPeakValue(selectedPoint) {
    return new Promise<any>((resolve, reject) => {

    });
  }


  dragConfig(option) {
    switch(option) {
      case 'zero':
        this.dragOptions = 'zero';
      break;
      case 'peak':
        this.dragOptions = 'peak';
      break;
      case 'lock':
        this.dragOptions = 'lock';
      break;
    }
  }

  scaleOptions(value) {
    this.chart.yAxis[0].update({
      max: value,
      min: -value,
      tickInterval: value
    });
  }

  adjustZeroValue() {
    let startPoint = this.fluidZeroValue;
    let startTime = 1492732800000;

    startTime = transform.subtractMinFromDate(startTime, transform.getHoursFromTimestamp(startPoint), transform.getMinutesFromTimestamp(startPoint), transform.getSecondsFromTimestamp(startPoint), transform.getMillisecondsFromTimestamp(startPoint));

    if(this.clickCounter == 0) {
      startTime = startTime - this.interval;
    } else{
      startTime = startTime + (this.clickCounter -1);
    }
    this.peakValue = this.peakValue + 1;
    this.clickCounter ++;
    // OK!

    let newDataForPlotting = [];
    let dataPoints = this.DataWithTimeStamp1;

    for (var i = 0; i < dataPoints.length; i++) {
        //if ((parseInt(i) % 8) == 0) {
        startTime = startTime + this.interval;
        newDataForPlotting.push([startTime + this.interval, dataPoints[i][1]]);
        //}
    }

    //  Updating hardcoded values
    this.demo2 = this.demo2 + 1;
    this.demo1 = this.demo1 - 1;
    //  Updating hardcoded values

    this.chart.series[0].update({
      data: newDataForPlotting
    }, true);

  }

}
