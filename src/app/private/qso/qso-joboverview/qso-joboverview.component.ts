import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// ------------------------------------------------------------ //
// -- Imports :: Chart Options
// ------------------------------------------------------------ //
import { QSOStreamingService } from './../qso.service.streaming';
import { QSOSidebarMenuService } from './../qso.service.ui.sidebar.menu';
import { QSOStageService } from './../qso.service.ui.stages';
import { QSONotificationService } from './../qso.service.notifications';
import { QSOChartService } from './../qso.service.ui.charts';
// ------------------------------------------------------------ //


// ------------------------------------------------------------ //
// -- Imports :: Models and Interfaces
// ------------------------------------------------------------ //
import { ISensorQSO, toISensorQSO, IChannelSensorQSO } from './../lib/models/ISensorQSO';
import { IComlinkNotification } from './../lib/models/IComlinkNotification';
import { IHighChartOptions } from './../lib/models/IHighChartOptions';
import { colors } from '../../../common/utilities/colors';
// ------------------------------------------------------------ //


// ------------------------------------------------------------ //
// -- Imports :: Chart Options
// ------------------------------------------------------------ //
import { HighChartOptions } from './qso-joboverview.component.options';
// ------------------------------------------------------------ //


// ------------------------------------------------------------ //
// -- Imports :: HighCharts.js Resources
// ------------------------------------------------------------ //
import * as Highcharts from 'highcharts/highstock';
import * as HighchartsBoosting from 'highcharts/modules/boost.src';
import * as moment from 'moment';
import { chart } from 'highcharts';
HighchartsBoosting(Highcharts);
// ------------------------------------------------------------ //
@Component({
  selector: 'app-qso-joboverview',
  templateUrl: './qso-joboverview.component.html',
  styleUrls: ['./qso-joboverview.component.less']
})
export class QsoJoboverviewComponent implements OnInit {

  // propieties :: HighCharts
  public qsoFracViewChart: Highcharts.ChartObject;

  // Properties :: DATA & STORE
  public DATA = {
    sensors: <ISensorQSO[]>[]
  };

  // Properties :: SUBSCRIPTIONS
  public SUBS = {
    stream: <any>{},
    stage: <any>{}
  };

  public UI = {
    CURRENT_STAGE: 0,
    RANGE_BUTTON: 0,
    isLoading: false,
  };

  // viewChild :: DOM Objects
  @ViewChild('chartTag') chartTag: ElementRef;

  constructor(private qsoStreamingService: QSOStreamingService,
    private qsoUISidebarMenuService: QSOSidebarMenuService,
    private qsoUIStageService: QSOStageService,
    private qsoUIChartService: QSOChartService,
    private qsoNotificationService: QSONotificationService) { }

  async ngOnInit() {

    // Enable SidebarMenu
    this.qsoUISidebarMenuService.setQSOSidebarMenuEnable(true);

    // Enable Notifications
    this.qsoNotificationService.setQSONotificationEnable(true);

    // Init Sensor Store
    const isSensorStoreReady = await this.qsoStreamingService.initSensorStore();
    const sensorStore = this.qsoStreamingService.getSensorStore();
    const sensorStoreUIDs = sensorStore.map(sensor => sensor.uid);

    // Init Sensor Streaming Service
    const isSensorStreamingReady = await this.qsoStreamingService.initSensorStreaming(sensorStoreUIDs);
    const isStagesReady = await this.qsoUIStageService.initStagesByProjectID('QSO');

    // Set Init Stage
    this.qsoUIStageService.setStage(0);
    this.UI.RANGE_BUTTON = 1;

    // Init Data.sensor
    this.DATA.sensors = Object.assign(JSON.parse(JSON.stringify(Object.assign(sensorStore)) + ""));

    // Init Chart
    this.qsoFracViewChart = await this.doHighChart(Object.assign(sensorStore), 60 * 24);
    //this.setGraphData(24);

    // --------------------------------------------------- //
    // -- Streaming :: Update new packet incoming -------- //
    // --------------------------------------------------- //
    this.SUBS.stream = this.qsoStreamingService.syncSensorStream().subscribe(sensor => {

      if (sensor['location']) {
        this.qsoNotificationService.removeNotification(sensor['location'].id);
        this.DATA.sensors.map(data_sensor => {
          if (data_sensor.uid === sensor.uid) {
            if (!sensor.isRetransmit) {
              data_sensor.channels = sensor.channels;
              data_sensor.timestamp = sensor.timestamp;
              data_sensor.isRetransmit = sensor.isRetransmit;
            }
          }
        });
      }

    });
    // --------------------------------------------------- //


    // --------------------------------------------------- //
    // -- Stage :: Someone change stage on sidebar menu -- //
    // --------------------------------------------------- //
    this.SUBS.stage = this.qsoUIStageService.syncStage().subscribe(stage => {
      this.UI.CURRENT_STAGE = +stage;
      this.doFilterSeriesByStage(+stage);
    });
    // --------------------------------------------------- //

  }

  async ngOnDestroy() {

    // Close All Subscriptions
    try { this.SUBS.stream.unsubscribe(); } catch (e) { }
    try { this.SUBS.stage.unsubscribe(); } catch (e) { }

    // Close All Streamings
    try { this.qsoStreamingService.closeSensorStreaming(); } catch (e) { }

  }


  async doHighChart(sensorsStore: ISensorQSO[], minutes: number) {


    // Init Data for HighChart ----
    const qsoChartInit = await this.qsoUIChartService.getInitChartData(sensorsStore, minutes);

    //console.error('job-overview :: minutes ' + minutes);
    //console.error(qsoChartInit);

    // HighChart Options
    const qsoChartOptions = new HighChartOptions();

    qsoChartOptions.setTitle('QSO JOB OVERVIEW CHART ' + minutes + ' h ');
    qsoChartOptions.setXAxisTitle('Time');
    qsoChartOptions.setYAxisTitle('Analog Inputs');

    qsoChartOptions.setSensors(sensorsStore);
    qsoChartOptions.setInitData(qsoChartInit);
    qsoChartOptions.setColors(colors);

    // HighChart Charts
    return Highcharts.stockChart(this.chartTag.nativeElement, <IHighChartOptions>qsoChartOptions.getOptions());
  }

  async doFilterSeriesByStage(stage: number) {

    const sensorsOnStage = this.DATA.sensors
      .filter(sensor => sensor.layout.containerIndex === this.UI.CURRENT_STAGE);
    this.qsoFracViewChart.series.map(serie => {
      if (serie['userOptions'].stage === stage) {

        const sensorSerieLocationId = <ISensorQSO>sensorsOnStage
          .find(sensor => {
            return sensor.location.id === serie['userOptions'].location.id;
          });

        const k = sensorSerieLocationId.layout.itemIndex + 0;

        if (serie['userOptions'].channel === 0) {
          serie.update({ color: colors[k].light });
        }
        if (serie['userOptions'].channel === 1) {
          serie.update({ color: colors[k].middle });
        }
        if (serie['userOptions'].channel === 2) {
          serie.update({ color: colors[k].complete });
        }
        serie.setVisible(true);
      } else {
        serie.setVisible(false);
      }
    });
  }

  async setGraphData(hours: number) {

    const sensorsStore = JSON.parse(JSON.stringify(this.DATA.sensors) + '');
    this.qsoFracViewChart = null;
    this.UI.isLoading = true;
    this.qsoFracViewChart = await this.doHighChart(Object.assign(sensorsStore), 60 * hours);
    this.UI.isLoading = false;
    this.UI.RANGE_BUTTON = hours;
    this.doFilterSeriesByStage(this.UI.CURRENT_STAGE);
  }


}
