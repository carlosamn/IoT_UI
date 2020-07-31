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
export class QSOStageService {
  // PATH's for HTTP Request and Streaming Services
  public path = {
    base: `${environment.basepath}`,
    model: 'locations',
    streaming: `${environment.basepath}/stream/sensor?`
  };


  public UI = {
    stage : new BehaviorSubject<number>(0),
    stages : new BehaviorSubject<number[]>([0, 1, 2, 3]),
  };

  // QSO Constructor
  constructor(public http: HttpClient, public sharedService: AppSharedService) { }



  setStages(stages) { this.UI.stages.next(stages); }
  getStages() { return this.UI.stages.getValue(); }

  setStage(stage) { this.UI.stage.next(stage); }
  getStage(stage) { return this.UI.stage.getValue(); }

  syncStages() { return this.UI.stages.asObservable(); }
  syncStage() { return this.UI.stage.asObservable(); }


  initStagesByProjectID(projectId) {
    return new Promise( (resolve, reject) => {
        // Get Stages For This Project
        const currentProject = JSON.parse(localStorage.getItem('currentProject'));
        const stages = currentProject.dashboardLayout.stages;
        this.setStages(stages);
        this.setStage(stages[0]);
        resolve(true);
    });
  }


  getDashboardStages(projectId) {
    return new Promise((resolve, reject) => {
      const id = projectId;
      const url = `${this.path.base}/projects/${id}`;
      this.http.get(url).toPromise().then(response => {
        resolve(response['dashboardLayout'].stages);
      });

    });
  }
  setDashboardStages(projectId, Stages) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

}
