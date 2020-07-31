/*
  ------------------------------------------------

    Shared Alarm Service :

    Description :

    -
    -
    -

    +
    +
    +

  ------------------------------------------------
*/

// --------------------------------------------------------- //
// -- Import Angular & System Resources                    - //
// --------------------------------------------------------- //
import { Router } from "@angular/router";
// Observables
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { HttpClient } from "@angular/common/http";
import { AppHTTPService } from './../../app.http-service';

// Enviroment
import { environment } from "../../../environments/environment";
// Event Streaming
import * as EventSource from "eventsource";
// --------------------------------------------------------- //

// --------------------------------------------------------- //
// -- Import Shared Service -------------------------------- //
// --------------------------------------------------------- //
import { AppSharedService } from "../../app.shared-service";
// --------------------------------------------------------- //

// --------------------------------------------------------- //
// -- Import Filters & Pipes ------------------------------- //
// --------------------------------------------------------- //
import { filterQuery } from "../../common/filters/query.filter";
// --------------------------------------------------------- //

// --------------------------------------------------------- //
// -- Import  Models & Classes                             - //
// --------------------------------------------------------- //
import { getEventToAlarm } from "./lib/scripts/AlarmEventSourceHelpers";
import { getAppendedAlarmList } from "./lib/scripts/AlarmEventSourceHelpers";
import { getRemovedAlarmList } from "./lib/scripts/AlarmEventSourceHelpers";
import { getMapResToAlarm } from "./lib/scripts/AlarmEventSourceHelpers";

import { IAlarmsNotification } from './lib/models/IAlarmNotification';
// --------------------------------------------------------- //

// --------------------------------------------------------- //
// -- Alarms Service                                       - //
// --------------------------------------------------------- //
@Injectable()
export class AlarmsService {
  // ------------------------------------//
  // -- Constants & Settings ------------//
  // ------------------------------------//

  // -- Paths & URL -- //
  private path = {
    base: `${environment.basepath}`,
    model: "alarms",
    streaming: `${environment.basepath}/alarms/change-stream`
  };

  // ------------------------------------//
  // -- Parameters & Properties ---------//
  // ------------------------------------//

  // -- Streaming Source Events -- //
  public STREAMING = {
    source: <any>{}
  };

  // -- Centralize / Observable / Storage -- //
  public STORAGE = {
    alarms: new BehaviorSubject<any[]>([]),
    alarmsList: new BehaviorSubject<any[]>([])
  };


  public DATA = {
    alarms: new BehaviorSubject<IAlarmsNotification[]>([]),
  }

  // ------------------------------------//
  // -- Alarms Service Constructor ------//
  // ------------------------------------//
  constructor(private httpClient: HttpClient, private http: AppHTTPService, private sharedService: AppSharedService) {

  }



  add(alarm: IAlarmsNotification) {

    const alarmsStorage = <IAlarmsNotification[]>JSON.parse(JSON.stringify(this.DATA.alarms.getValue()) + '');
    const isNewAlarm = alarmsStorage.filter(alarmStorage => alarmStorage.id === alarm.id).length === 0;
    if (isNewAlarm) {
      alarmsStorage.push(alarm);
    } else {
      alarmsStorage.map(alarmStorage => {
        if (alarmStorage.id === alarm.id) {
          return alarm;
        } else {
          return alarmStorage;
        }
      });
    }
    this.DATA.alarms.next(alarmsStorage);
  }

  remove(alarm: IAlarmsNotification) {
    const alarmsStorage = <IAlarmsNotification[]>JSON.parse(JSON.stringify(this.DATA.alarms.getValue()) + '');
    const isNewAlarm = alarmsStorage.filter(alarmStorage => alarmStorage.id === alarm.id).length === 0;
    const newAlarmsStorage = alarmsStorage.filter(alarmStorage => alarmStorage.id !== alarmStorage.id);
    this.DATA.alarms.next(newAlarmsStorage);
  }

  sync() {
    return this.DATA.alarms.asObservable()
  }



  setAlarms(alarms): void {
    this.STORAGE.alarms.next(alarms);
  }

  getAlarms() {
    return this.STORAGE.alarms.getValue();
  }

  async updateAlarms() {
    return new Promise(async (resolve, reject) => {

      const _url = this.path.base + "/" + this.path.model;
      const _alarmList = <Array<any>>await this.http.get(_url).toPromise();
      const alarmsStore = <IAlarmsNotification[]>[];

      _alarmList.map(_alarm => {
        const alarmNotification = <IAlarmsNotification>{
          id: _alarm.alarmId,
          location: {
            id: _alarm.locationId,
            description: _alarm.location
          },
          project: _alarm.projectId,
          uid: _alarm.uid,
          timestamp: _alarm.alarmInfo['packetTime'] || _alarm.alarmInfo['lastPacketTimestamp'],
          type: _alarm.alarmType,
          message: _alarm.alarmInfo['alarmMessage'],
          channel: {
            id: _alarm.alarmInfo['channelId'],
            name: _alarm.alarmInfo['sensorName'],
            value: _alarm.alarmInfo['sensorValue'],
            units: _alarm.alarmInfo['sensorUnit']
          }

        }

        alarmsStore.push(alarmNotification);
      });

      resolve(alarmsStore);

    });
  }

  getAlarmsByProject(options?) {
    let filter = "";
    if (options) {
      filter = filterQuery(options);
    }
    const url = `${this.path.base}/${this.path.model}${filter}`;

    return this.http.get(url).map((data: any) => {
      return data;
    });
  }

  async closeAlarmsService() {
    try { this.STREAMING.source.close(); } catch (e) { console.error("Error Closing Alarm Streaming  @alarm.service") }
  }
  async startAlarmsService() {

    const alarms = await this.updateAlarms();
    this.setAlarms(alarms);

    /*
    this.STREAMING.source = new EventSource(this.path.streaming);
    this.STREAMING.source.onopen = async event => {
      console.warn("STREAMING/ALARMS CONNECTING STREAMING CHANNEL");
      const alarms = await this.updateAlarms();
      this.setAlarms(alarms);
      console.warn('')
      console.warn(' Updating Alarms From Server ')
      console.warn(alarms)
      console.warn('')

    };
    this.STREAMING.source.onerror = async event => {
      console.warn("STREAMING/ALARMS NETWORK ERROR");
    };
    this.STREAMING.source.addEventListener("data", async event => {
      console.warn("STREAMING/ALARMS DATA INCOMING");
      const alarms = await this.updateAlarms();
      this.setAlarms(alarms);
      let alarm_list_current = this.sharedService.getCurrentAlarms();
      let alarm_new_current = await getEventToAlarm(event);

      if (!alarm_new_current["command"]) {
        let alarm_list_next = await getAppendedAlarmList(alarm_new_current, alarm_list_current);
        this.sharedService.setCurrentAlarms(alarm_list_next)
      } else {
        let alarm_to_remove_id = alarm_new_current["content"]["where"]["alarmId"];
        let alarm_list_next = await getRemovedAlarmList(alarm_to_remove_id, alarm_list_current);
        this.sharedService.setCurrentAlarms(alarm_list_next)
      }

    });
*/
  }



}
