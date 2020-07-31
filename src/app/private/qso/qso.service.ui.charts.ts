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
export class QSOChartService {

  // PATH's for HTTP Request and Streaming Services
  public path = {
    base: `${environment.basepath}`,
    model: 'locations',
    streaming: `${environment.basepath}/stream/sensor?`
  };


  public UI = {
  };

  // QSO Constructor
  constructor(public http: HttpClient, public sharedService: AppSharedService) { }


  /**
*  --------------------
* |  Method Name : getInitChartData()
* |  Description :
* |  @param : none
* |  @returns : none
*  --------------------
*/
  getInitChartData(sensorStore, chartTimeWindowMinutes: number = 10, chartTimeStep: number = 2) {

    const mjs_dateTo = moment().utc().format('YYYYMMDDHHmmss');
    const mjs_dateFrom = moment().utc().subtract(chartTimeWindowMinutes, 'm').format('YYYYMMDDHHmmss');

    const project_id = sensorStore[0].project;
    const locations_id = sensorStore.map(sensor => sensor.location.id).toString();
    const timestamp_from = mjs_dateFrom; //YYYYMMDDHHmmss
    const timestamp_to = mjs_dateTo;
    const skipTime_value = 60 * chartTimeWindowMinutes / (800); //SECONDS
    const skipTime_max = 30 * 60; //SECONDS
    const skipTime_min = 1; //SECONDS
    const skipTime = parseInt(Math.min(Math.max(skipTime_value, skipTime_min), skipTime_max) + '');
    //const skipTime = 50;

    const uri_base = `${this.path.base}/${this.path.model}/graph/realtime?`;
    const uri_project_id = `projectId=${project_id}&`;
    const uri_locations_id = `locationIds=${locations_id}&`;
    const uri_timestamp_from = `fromTimestamp=${timestamp_from}&`;
    const uri_timestamp_to = `toTimestamp=${timestamp_to}&`;
    const uri_skip_time = `skipTime=${skipTime}`;


    const uri = `${uri_base}${uri_project_id}${uri_locations_id}${uri_timestamp_from}${uri_timestamp_to}${uri_skip_time}`;

    return new Promise((resolve, reject) => {

      if (environment.production) {
        this.http.get(uri).toPromise()
          .then(response => {

            console.warn('qsoServiceUIChart.ts');
            console.warn({
              uri_timestamp_to: moment().utc().format('YYYY/MM/DD HH:mm:ss'),
              uri_timestamp_from: moment().utc().subtract(chartTimeWindowMinutes, 'm').format('YYYY/MM/DD HH:mm:ss'),
              uri_skip_time: skipTime,
              uri_skip_time_minutes: skipTime / 60,
              uri_minutes: chartTimeWindowMinutes
            });

            if (response['rtgraph']) {
              const rtgraph = response['rtgraph'];
              const locations = rtgraph.locationIds;
              const locations_ids = Object.keys(locations);
              const locations_values = Object.values(locations);
              const locations_data = [];
              let location_qso_15 = [];

              locations_values.map((data, k) => {

                //console.error(locations_ids[k]);
                if (locations_ids[k] === '5c1e57ea463e1b60eeb6f7cb') {

                  const timestamps = data['epochTimestmaps'];
                  const values = Object.values(data['dataPoints']);

                  let channel0 = [];

                  timestamps.map((kTimestamp, k) => {
                    channel0.push([
                      moment(1000 * kTimestamp).utc().format('YYYY/MM/DD HH:mm:ss'),
                      parseFloat(values[0][k])
                    ]);
                  });

                  location_qso_15 = channel0;

                }

              });

              console.warn('location_qso_15');
              console.warn(location_qso_15);
            }




            resolve(response);
          })
          .catch(error => {
            resolve(error);
          });
      }

    });

  }




}
