import { timeStamp } from './../pit/pipeTimeStamp';
/*
  ------------------------------------------------
    QSO  STREAMING SERVICE :

    Share controllers/devices data between components
    and pull http request from Loopback API
  ------------------------------------------------
*/



// --------------------------------------------------------- //
// -- Import Angular Resources                             - //
// --------------------------------------------------------- //
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// --------------------------------------------------------- //

// --------------------------------------------------------- //
// -- Import App Shared Services                           - //
// --------------------------------------------------------- //
import { AppSharedService } from '../../app.shared-service';

import { environment } from '../../../environments/environment';
import { filterQuery } from '../../common/filters/query.filter';
import { streamingArrToObj, checkRecordStatus, updateSensorRecord, filterQueryUIDs } from './lib/scripts/QSO_SEE';
// --------------------------------------------------------- //

// --------------------------------------------------------- //
// -- Import  Models & Classes                             - //
// --------------------------------------------------------- //
import { ISensorQSO, toISensorQSO, IControllerSensorQSO } from './lib/models/ISensorQSO';
import { IAnalogInput } from './lib/models/IAnalogInput';
import { IDevice, toIDevice } from './lib/models/IDevice';
// --------------------------------------------------------- //

// --------------------------------------------------------- //
// -- Import Vendors Lib's                                -- //
// --------------------------------------------------------- //
import * as moment from 'moment';
import * as EventSource from 'eventsource';
// --------------------------------------------------------- //







// --------------------------------------------------------- //
// -- QSO Service                                          - //
// --------------------------------------------------------- //
@Injectable()
export class QSOStreamingService {

  // PATH's for HTTP Request and Streaming Services
  public path = {
    base: `${environment.basepath}`,
    model: 'locations',
    streaming: `${environment.basepath}/stream/sensor?`
  };

  public STREAM = {
    sensor: new BehaviorSubject<ISensorQSO>({} as ISensorQSO),
    eventSource: <any>{},
    pause: <boolean>false
  };

  public SENSORS = {
    data: new BehaviorSubject<ISensorQSO[]>([])
  };

  // QSO Constructor
  constructor(public http: HttpClient,
    public sharedService: AppSharedService) { }



  setSensorStream(sensorStream): void {
    this.STREAM.sensor.next(sensorStream);
  }

  getSensorStream(): ISensorQSO {
    return <ISensorQSO>this.STREAM.sensor.getValue();
  }

  setSensorStore(sensorStore): void {
    this.SENSORS.data.next(sensorStore);
  }
  getSensorStore(): ISensorQSO[] {
    const sensorStore = <ISensorQSO[]>Object.assign(this.SENSORS.data.getValue());
    return sensorStore;
  }

  syncSensorStore() {
    return this.SENSORS.data.asObservable();
  }
  syncSensorStream() {
    return this.STREAM.sensor.asObservable();
  }



  /**
   *  --------------------------------------------------------------------------
   *  Init Sensor Store as Array of <ISensorQSO>
   *  --------------------------------------------------------------------------
   *  Step 1: initControllers / Load schema, locations, uid,  but no sensor info.
   *  Step 2: initChannels / Load info from device setup
   *  Step 3: initValues / Load last logged values from each channel
   */
  async initSensorStore() {
    return new Promise(async (resolve, reject) => {
      const areControllersLoaded = await this.initControllers();
      const areChannelLoaded = await this.initChannels();
      const areValuesLoaded = await this.initValues();
      console.warn('initSensorStore()');
      console.warn(this.SENSORS.data.getValue())
      resolve(true);
    });
  }
  async initControllers() {
    return new Promise(async (resolve, reject) => {

      const currentProjectId = JSON.parse(localStorage.getItem('currentLocation')).projectId;
      const filterByProject = filterQuery({ projectId: currentProjectId });
      const urlLocations = `${this.path.base}/${this.path.model}${filterByProject}`;

      this.http.get<ISensorQSO[]>(urlLocations).toPromise().then(sensors => {
        const SensorsQSO = sensors.map(sensor => toISensorQSO(sensor));
        this.SENSORS.data.next(SensorsQSO);
        resolve(true);
      });
    });
  }
  async initChannels() {
    return new Promise(async (resolve, reject) => {

      const sensorStore = this.getSensorStore();
      const _uids = sensorStore.map(sensor => sensor.uid);
      const _queryUIDs = filterQueryUIDs({ field: 'uid', values: _uids });
      const _urlAnalogUIDs = `${this.path.base}/ainputs${_queryUIDs}`;

      this.http.get<IAnalogInput[]>(_urlAnalogUIDs).toPromise().then(analogs => {

        const _analogs = <IAnalogInput[]>analogs;
        sensorStore.map(qsoSensor => {
          const analogByuid = _analogs.filter(analogItem => analogItem.uid === qsoSensor.uid);
          for (let k = 0; k < analogByuid.length; k++) {
            if (analogByuid[k].enable) {
              try {
                qsoSensor.channels[k].id = k;
                qsoSensor.channels[k].name = analogByuid[k].name;
                qsoSensor.channels[k].enable = analogByuid[k].enable;
                qsoSensor.channels[k].units = analogByuid[k].unit;
                qsoSensor.channels[k].alarms = {
                  high: {
                    enable: analogByuid[k].enable_alarm_h,
                    limit: analogByuid[k].alarm_h
                  },
                  low: {
                    enable: analogByuid[k].enable_alarm_l,
                    limit: analogByuid[k].alarm_l
                  }
                };
              } catch (e) {
                if (window['debug-qso-streaming']) {
                  console.error('qso-service.streaming.ts line 153  qsoSensor.channels[k] , k : ' + k);
                  console.error(qsoSensor.channels[k])
                }
              }
            }
          }
          return qsoSensor;
        });
        this.SENSORS.data.next(sensorStore);
      });

      resolve(true);
    });
  }
  async initValues() {
    return new Promise(async (resolve, reject) => {
      const sensorStore = Object.assign(this.getSensorStore());
      const _uidsAsArray = sensorStore.map(sensor => sensor.uid);
      const _uidsAsString = _uidsAsArray.reduce((uidAsStr, uidAsItem) => `${uidAsStr},${uidAsItem}`) || '';
      const _urlValuesUIDs = `${this.path.base}/devices/sensordata/uid/${_uidsAsString}`;

      this.http.get<IDevice[]>(_urlValuesUIDs).toPromise().then(devices => {

        const sensorsStore = Object.assign(this.getSensorStore());
        const sensorsdata = Object.values(devices['sensordata']);

        sensorsStore.map(sensor => {
          const sensor_data = sensorsdata.filter(device => device['uid'] === sensor.uid)[0];
          if(sensor_data){
            const _device = <IDevice>toIDevice(sensorsdata.filter(device => device['uid'] === sensor.uid)[0]);
            const _timestamp = _device.timestamp;
            const _value1 = _device.packetData.analogInput1;
            const _value2 = _device.packetData.analogInput2;
            const _value3 = _device.packetData.analogInput3;

            sensor.timestamp = _timestamp;
            sensor.channels[0].value = _value1;
            sensor.channels[1].value = _value2;
            sensor.channels[2].value = _value3;
          }

        });
        this.SENSORS.data.next(Object.assign(sensorStore));
        resolve(true);
      });


    });
  }



  /**
   *  --------------------------------------------------------------------------
   *  Streaming Methods
   *  --------------------------------------------------------------------------
   *
   */
  initSensorStreaming(uids): Promise<boolean> {
    return new Promise((resolve) => {


      const uri_3000 = `${this.path.streaming}uids=${uids.map(uid => 'QSO' + uid).join()}`;
      const uri_2579 = uri_3000.replace('3000', '2579');

      this.STREAM.eventSource = new EventSource(uri_2579);
      this.STREAM.eventSource.onopen = () => { };
      this.STREAM.eventSource.onerror = () => { };
      this.STREAM.eventSource.addEventListener('sensor', x => {


        if (!this.STREAM.pause) {

          const sensor_packet = JSON.parse(x.data).packet;
          const sensor_alarms = JSON.parse(x.data).alarms;
          const sensor_trends = JSON.parse(x.data).trend;
          const sensor_data = streamingArrToObj(sensor_packet);
          const sensor_store_str = JSON.stringify(this.getSensorStore());
          const sensor_store = <ISensorQSO[]>Object.assign(JSON.parse(sensor_store_str + ""));
          const sensor_obj = Object.assign(sensor_store.filter(sensor => (`QSO${sensor.uid}` === sensor_data.uid))[0]);
          const sensor_store_key = sensor_store.findIndex(sensor => sensor.location.id === sensor_obj.location.id);
          const sensorUpdated = <ISensorQSO>Object.assign(JSON.parse(JSON.stringify(sensor_obj) + ""));

          sensorUpdated.timestamp = sensor_data.timestamp + " ";
          sensorUpdated.isRetransmit = (sensor_data.retransmitBit === 1);
          sensorUpdated.channels[0].value = sensor_data.analogInput1 + 0.0;
          sensorUpdated.channels[1].value = sensor_data.analogInput2 + 0.0;
          sensorUpdated.channels[2].value = sensor_data.analogInput3 + 0.0;
          sensorUpdated.channels[3].value = sensor_data.analogInput4 + 0.0;

          sensor_store.map(sensor => {
            if (sensor.location.id === sensorUpdated.location.id) {
              return sensorUpdated;
            } else {
              return sensor;
            }
          });

          this.setSensorStream(<ISensorQSO>sensorUpdated);
          this.setSensorStore(<ISensorQSO[]>sensor_store);
        }

      });

      resolve(true);

    });
  }

  pauseSensorStreaming(): Promise<boolean> {
    return new Promise((resolve) => {
      this.STREAM.pause = true;
      resolve(true);
    });
  }

  resumeSensorStreaming(): Promise<boolean> {
    return new Promise((resolve) => {
      this.STREAM.pause = false;
      resolve(true);
    });
  }

  closeSensorStreaming(): Promise<boolean> {
    return new Promise((resolve) => {
      this.STREAM.eventSource.close();
      resolve(true);
    });
  }






  /**
   *  --------------------------------------------------------------------------
   *  -- Streaming Methods
   *  --------------------------------------------------------------------------
   *
   */
  updateDataBySensor(data_sensor, sensor): Promise<ISensorQSO> {
    return new Promise((resolve) => {
      const data_sensorUID = sensor.uid;
      const sensorUID = sensor.uid;
      if (data_sensorUID === sensorUID && sensor['location'] && !sensor['isRetransmit']) {
        data_sensor['channels'] = sensor['channels'];
        data_sensor['timestamp'] = sensor['timestamp'];
      }
      resolve(data_sensor as ISensorQSO);
    });
  }
  updateSeriesBySensor(series, sensor): Promise<any[]> {
    return new Promise((resolve) => {
      resolve([] as any[]);
    });
  }



}
