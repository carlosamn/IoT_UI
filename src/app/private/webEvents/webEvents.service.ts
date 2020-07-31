/*
  ------------------------------------------------



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

// Enviroment
import { environment } from "../../../environments/environment";
// Event Streaming
import * as EventSource from "eventsource";
// --------------------------------------------------------- //




// --------------------------------------------------------- //
// -- Import Shared Service -------------------------------- //
// --------------------------------------------------------- //
import { AppSharedService } from "../../app.shared-service";
import { QSONotificationService } from './../qso/qso.service.notifications';
import { AlarmsService } from './../alarms/alarms.service';
// --------------------------------------------------------- //





// --------------------------------------------------------- //
// -- Import Filters & Pipes ------------------------------- //
// --------------------------------------------------------- //
import { filterQuery } from "../../common/filters/query.filter";
import { HttpModule } from "@angular/http";
// --------------------------------------------------------- //




// --------------------------------------------------------- //
// -- Import  Models & Classes                             - //
// --------------------------------------------------------- //
import { IComlinkNotification } from './../qso/lib/models/IComlinkNotification';
import { IAlarmsNotification } from './../alarms/lib/models/IAlarmNotification';

// --------------------------------------------------------- //





// --------------------------------------------------------- //
// -- Alarms Service                                       - //
// --------------------------------------------------------- //
@Injectable()
export class WebEventsService {


  // -- Paths & URL -- //
  private path = {
    base: `${environment.basepath}`,
    model: "alarms",
    streaming: `${environment.basepath}/webEvents/change-stream`
  };

  // -- Streaming Source Events -- //
  public STREAMING = {
    source: <any>{}
  };

  public UID = '';

  // -- Centralize / Observable / Storage -- //
  digitalController = new BehaviorSubject<any>([-1, -1, -1, -1, -1, -1, -1]);


  constructor(private http: HttpClient,
    private sharedService: AppSharedService,
    private alarmService: AlarmsService,
    private qsoNotificationService: QSONotificationService) {

  }


  async startWebEventService() {


    this.STREAMING.source = new EventSource(this.path.streaming);
    this.STREAMING.source.onopen = async event => {
      const alarms = await this.alarmService.updateAlarms();
      this.alarmService.setAlarms(alarms);
      //console.log("STREAMING/WEB EVENTS CONNECTING STREAMING CHANNEL");
    };
    this.STREAMING.source.onerror = async event => {
      //console.log("STREAMING/WEB EVENTS NETWORK ERROR");
    };
    this.STREAMING.source.addEventListener("data", async event => {

      let data = JSON.parse(event["data"])["data"];
      let dataClass = data["class"];
      let dataType = data["type"];
      let dataUID = data["uid"];

      if (dataType == "DINPUT" && dataUID == this.UID) {
        this.digitalController.next(data["eventData"]["inputs"])
      }

      // COMLINK STATUS ALARM (NO CONNECTION)
      if (dataClass == 'ALARM' && dataType == 'COMSTATUS_NEW') {
        const comlinkNotification = <IComlinkNotification>{
          location: {
            id: data['locationId'],
            description: data['location']
          },
          project: data['projectId'],
          uid: data['uid'],
          timestamp: '',
          message: `COMLINK NO CONNECTION ${data['uid']}`,
          type: 'COMSTATUS_NO_SIGNAL'
        }

        const currentProjectId = JSON.parse(localStorage.getItem('currentProject')).id;
        if (data['projectId'] == currentProjectId) {

          const isNewNotification = !this.qsoNotificationService.isANewNotificationByLocationId(comlinkNotification.location.id);
          if (isNewNotification) {
            this.qsoNotificationService.addNotification(comlinkNotification);
          }


        }
      }


      // CONTROLLERS ANALOG ALARMS
      if (dataClass == 'ALARM') {
        const currentProjectId = JSON.parse(localStorage.getItem('currentProject')).id;

        const alarmNotification = <any>{
          id: data['eventData']['alarmId'],
          location: {
            id: data['locationId'],
            description: data['location']
          },
          project: data['projectId'],
          uid: data['uid'],
          timestamp: data['eventData']['packetTime'],
          message: data['eventData']['alarmMessage'],
          type: data['eventData']['sensorType'],
          channel: {
            id: data['eventData']['channelId'],
            name: data['eventData']['sensorName'],
            value: data['eventData']['sensorValue'],
            units: data['eventData']['sensorUnit']
          }
        }
        if (dataType == 'ALARM_NEW') {
          this.qsoNotificationService.playAudio();
          this.alarmService.add(alarmNotification);
        }
        if (dataType == 'ALARM_CLEAR') {
          this.alarmService.remove(alarmNotification);
        }
      }



    });
  }



  async closeWebEventService() {
    this.STREAMING.source.close();
  }

  async getDigitalIO() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.basepath}/dinputs/devicedata/recent/uid/${this.UID}`).toPromise()
        .then(data => {
          let inputs = data["devicedata"]["inputs"];
          this.digitalController.next(inputs)
          resolve(inputs)
        })
        .catch(error => {
          resolve(error);
        })
    })
  }


  appendDigitals(currentDigitalControllers, dataEventDataInputs) {
    let isInArray = currentDigitalControllers.filter(item => { return item.locationId == dataEventDataInputs.locationId });
    if (!isInArray) {
      currentDigitalControllers.push(dataEventDataInputs);
    } else {
      let k = currentDigitalControllers.findIndex(item => { return item.locationId == dataEventDataInputs.locationId });
      currentDigitalControllers[k] = dataEventDataInputs;
    }
    return currentDigitalControllers;
  }





}
