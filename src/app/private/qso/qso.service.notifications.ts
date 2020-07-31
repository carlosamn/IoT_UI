/*
  ------------------------------------------------

    QSO SERVICE :

    Share controllers/devices data between components
    and pull http request from Loopback API

  ------------------------------------------------
*/

// --------------------------------------------------------- //
// -- Import Angular Resources                             - //
// --------------------------------------------------------- //

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../../environments/environment';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as EventSource from 'eventsource';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';

// --------------------------------------------------------- //




// --------------------------------------------------------- //
// -- Import App Shared Services                           - //
// --------------------------------------------------------- //
import { AppSharedService } from '../../app.shared-service';
// --------------------------------------------------------- //




// --------------------------------------------------------- //
// -- Import  Models & Classes                             - //
// --------------------------------------------------------- //
import { filterQuery } from '../../common/filters/query.filter';
import { ISensorQSO, toISensorQSO } from './lib/models/ISensorQSO';
import { IComlinkNotification } from './lib/models/IComlinkNotification';
import { IControllerSensorQSO, toIControllerSensorQSO } from './lib/models/ISensorQSO';
import { streamingArrToObj, checkRecordStatus, updateSensorRecord, filterQueryUIDs } from './lib/scripts/QSO_SEE';
// --------------------------------------------------------- //




// --------------------------------------------------------- //
// -- Import API Mocks                                    -- //
// --------------------------------------------------------- //
import * as initChartDataMockAPI from './lib/mocks/initChartAPI.json';
import * as moment from 'moment';
// --------------------------------------------------------- //


// --------------------------------------------------------- //
// -- QSO Service                                          - //
// --------------------------------------------------------- //
@Injectable()
export class QSONotificationService {
  // PATH's for HTTP Request and Streaming Services
  public path = {
    base: `${environment.basepath}`,
    model: 'locations',
    streaming: `${environment.basepath}/stream/sensor?`
  };

  public NOTIFICATIONS = {
    comlink: new BehaviorSubject<IComlinkNotification[]>([])
  }


  public UI = {
    notifications: new BehaviorSubject<boolean>(false),
    audibleAlarm: new BehaviorSubject<boolean>(false)
  };

  public audio;

  // QSO Constructor
  constructor(public http: HttpClient, public sharedService: AppSharedService) {
    this.audio = new Audio();
  }


  setQSONotificationEnable(visibility) {
    this.UI.notifications.next(visibility);
  }
  syncQSONotificationEnable() {
    return this.UI.notifications.asObservable();
  }

  setQSONotifications(comlink_notifications: IComlinkNotification[]) {
    return this.NOTIFICATIONS.comlink.next(comlink_notifications);
  }
  syncQSONotifications() {
    return this.NOTIFICATIONS.comlink.asObservable();
  }

  getQSONotifications(): IComlinkNotification[] {
    return <IComlinkNotification[]> this.NOTIFICATIONS.comlink.getValue();
  }

  isANewNotificationByLocationId(locationId: string) {
    const notifications = Object.assign(JSON.parse(JSON.stringify(this.NOTIFICATIONS.comlink.getValue()) + ''));
    return notifications.filter(notification => notification.location.id == locationId).length > 0;
  }

  addNotification(notification: IComlinkNotification) {
    const notifications = this.NOTIFICATIONS.comlink.getValue();
    notifications.push(notification);
    this.NOTIFICATIONS.comlink.next(notifications);
  }
  removeNotification(id) {
    const notifications = this.NOTIFICATIONS.comlink.getValue();
    const notification_removed = notifications.filter(notification => notification.location.id !== id);
    this.NOTIFICATIONS.comlink.next(notification_removed);
  }

  playAudio() {
    const isAudible = this.UI.audibleAlarm.getValue();
    if (isAudible) {
      this.audio.src = "../../../assets/audio/comstatus_alarm.mp3";
      navigator.vibrate([500, 250, 500, 250]);
      this.audio.load();
      this.audio.onended = () => {
        this.audio.pause();
        this.audio.currentTime = 0;

      };
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }

  setEnableAudibleAlarm() {
    this.UI.audibleAlarm.next(true);
    //this.playAudio();
  }
  setDisableAudibleAlarm() {
    this.UI.audibleAlarm.next(false);
    //this.audio.pause();
    //this.audio.currentTime = 0;
  }


}
