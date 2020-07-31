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
export class QSOSidebarMenuService {

  // PATH's for HTTP Request and Streaming Services
  public path = {
    base: `${environment.basepath}`,
    model: 'locations',
    streaming: `${environment.basepath}/stream/sensor?`
  };


  public UI = {
    sidebarMenu: new BehaviorSubject<boolean>(false),
    audiblealarm: new BehaviorSubject<boolean>(false)
  };

  // QSO Constructor
  constructor(public http: HttpClient, public sharedService: AppSharedService) { }


  setQSOSidebarMenuEnable(visibility) {
    this.UI.sidebarMenu.next(visibility);
  }
  syncQSOSidebarMenu() {
    return this.UI.sidebarMenu.asObservable();
  }

  setEnableAudibleAlarm() {
    this.UI.audiblealarm.next(true);
  }
  setDisableAudibleAlarm() {
    this.UI.audiblealarm.next(false);

  }



}
