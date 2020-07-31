import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

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
import { HighChartOptions } from './qso-realtime.component.options';
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



// ------------------------------------------------------------ //
// -- @Component QSO Realtime
// ------------------------------------------------------------ //
@Component({
  selector: 'app-qso-realtime',
  templateUrl: './qso-realtime.component.html',
  styleUrls: ['./qso-realtime.component.less']
})
// ------------------------------------------------------------ //






// ------------------------------------------------------------ //
// -- Component Class
// ------------------------------------------------------------ //
export class QsoRealtimeComponent implements OnInit {
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
    CURRENT_STAGE: 0
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

    // Init Data.sensor
    this.DATA.sensors = Object.assign(JSON.parse(JSON.stringify(Object.assign(sensorStore)) + ""));

    // Init Chart
    this.qsoFracViewChart = await this.doHighChart(Object.assign(sensorStore));


    // --------------------------------------------------- //
    // -- Streaming :: Update new packet incoming -------- //
    // --------------------------------------------------- //
    this.SUBS.stream = this.qsoStreamingService.syncSensorStream().subscribe(sensor => {

      if (sensor['location']) {
        // Remove Comlink Notification
        this.qsoNotificationService.removeNotification(sensor['location'].id);

        // Update Left Side Controllers
        this.DATA.sensors.map(data_sensor => {
          if (data_sensor.uid === sensor.uid && sensor.isRetransmit === false) {
            data_sensor.channels = sensor.channels;
            data_sensor.timestamp = sensor.timestamp;
            data_sensor.isRetransmit = sensor.isRetransmit;
            data_sensor['alarms'] = ['asdfa', '453434'];
            data_sensor['comlink'] = ['asdfa', '453434'];
          }
        });

        // Update Graph/Series
        this.qsoFracViewChart.series.map(serie => {

          if ((serie['userOptions'].location.id === sensor.location.id)) {

            const channelIndex = <number>+serie['userOptions']['channel'];
            const channelObject = <IChannelSensorQSO>sensor.channels[channelIndex];
            const sensor_serie_timestamp_utc = moment(new Date(sensor.timestamp + ' UTC')).utc();
            const analogValue = <number>parseFloat('' + channelObject.value) + 0.0;

            const nowTime = moment().utc().add(1, 'minutes');
            const nowBefore10MinutesTime = moment().utc().subtract(11, 'm');
            const nowPacketTime = sensor_serie_timestamp_utc;
            const isSensorPacketTimeInRange = nowPacketTime.isBetween(nowBefore10MinutesTime, nowTime);
            const analogTime = <number>+sensor_serie_timestamp_utc.unix() * 1000;

            if (isSensorPacketTimeInRange && channelObject.enable) {
              serie.addPoint([analogTime, analogValue], false, false);
            }

            serie.data.map(data => {
              const dataEpochMoment = moment(data['x']).utc();
              const isSerieDataTimeInRange = dataEpochMoment.isBetween(nowBefore10MinutesTime, nowTime);
              if (!isSerieDataTimeInRange) {
                console.warn({
                  component: 'qso-realtime.component.ts',
                  data: data,
                  isSerieDataTimeInRange: isSerieDataTimeInRange,
                  dataEpochMoment: dataEpochMoment
                })
                data.remove();
              }
            });
          }

        });

        this.qsoFracViewChart.redraw();
        this.qsoFracViewChart.xAxis.map(axis => axis.setExtremes());



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
    this.SUBS.stream.unsubscribe();
    this.SUBS.stage.unsubscribe();

    // Close All Streamings
    this.qsoStreamingService.closeSensorStreaming();

  }


  async doHighChart(sensorsStore: ISensorQSO[]) {
    // Init Data for HighChart
    const qsoChartInit = await this.qsoUIChartService.getInitChartData(sensorsStore);

    // HighChart Options
    const qsoChartOptions = new HighChartOptions();

    qsoChartOptions.setTitle('QSO REALTIME CHART *');
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

}
