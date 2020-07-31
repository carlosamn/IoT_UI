/*
  ------------------------------------------------

    Shared Alarm Service :

    Description :

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
import { AppHTTPService } from '../../app.http-service'


import { NgZone } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { map } from 'rxjs/operator/map';

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
import { AlarmEventSourceToObs } from "./lib/scripts/AlarmEventSourceHelpers";
import { AlarmRequest } from "./lib/scripts/AlarmEventSourceHelpers";
import { streamingArrToObj } from "../qso/lib/scripts/QSO_SEE";
import { resolve } from "url";
// --------------------------------------------------------- //





// --------------------------------------------------------- //
// -- Alarms Service                                       - //
// --------------------------------------------------------- //
@Injectable()
export class LocationsService {



  // ------------------------------------//
  // -- Constants & Settings ------------//
  // ------------------------------------//

  // -- Paths & URL -- //
  private path = {
    base: `${environment.basepath}`,
    model: "locations",
    streaming: `${environment.basepath}/webEvents/change-stream`
  };





  // ------------------------------------//
  // -- Parameters & Properties ---------//
  // ------------------------------------//

  // -- Streaming Source Events -- //
  public STREAMING = {
    source: <any>{}
  }

  // -- Centralize / Observable / Storage -- //
  public STORAGE = {
    locations: new BehaviorSubject<any[]>([]),
  };



  // ------------------------------------//
  // -- Alarms Service Constructor ------//
  // ------------------------------------//
  constructor(private http: AppHTTPService, private sharedService: AppSharedService) {
    //let initLocations = this.updateLocationsFromServer();
  }
  //service for getting map api from locationIQ

  getLocationFromMap(): Observable<any> {
    let urlMap = "api-iam.intercom.io/messenger/web/events"


    return this.http.get(urlMap)
      .map((data: any) => {
        return data;
      })

  }


  getLocations() {
    return this.STORAGE.locations;
  }

  setLocations(locations) {
    this.STORAGE.locations.next(locations)
  }



  /*
  GET: /devices
  Find all instances of the model matched by filter from the data source.
  */
  getLocationsAsObs(options?): Observable<any> {
    let filter = '';
    if (options) {
      filter = filterQuery(options);
    }
    const url = `${this.path.base}/${this.path.model}${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }


  getAllLocationsAsObs() {
    return this.http.get(`${this.path.base}/${this.path.model}`)
      .map(res => {
        return res;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  //  Error Handlers
  errorHandler(error: any): void {
    return error.error.error;
  }



  updateLocationsFromServer(project?) {
    let filter = '';
    let currentProject;
    if (project) {
      currentProject = project;
    } else {
      currentProject = localStorage.getItem("project")
    }
    const url = `${this.path.base}/locations`;
    this.http.get(url)
      .map((data: any) => { return data; })
      .toPromise()
      .then(locations => {
        let _locationsOnProject = locations.filter(location => {
          return location.projectId == currentProject || location.projectId == currentProject.replace("_", " ")
        });
        this.setLocations(_locationsOnProject);
      })
  }




  updateLocationsFromServerPromise(project?) {
    return new Promise((resolve, reject) => {

      let filter = '';
      let currentProject;

      if (project) {
        currentProject = project;
      } else {
        currentProject = localStorage.getItem("project")
      }

      const url = `${this.path.base}/locations`;
      this.http.get(url)
        .map((data: any) => { return data; })
        .toPromise()
        .then(locations => {
          let _locationsOnProject = locations.filter(location => {
            return location.projectId == currentProject || location.projectId == currentProject.replace("_", " ") || location.projectId == currentProject.replace(" ", "_") || location.projectId == currentProject.replace("%20", " ") || location.projectId == currentProject.replace("%20", "_")
          });
          this.setLocations(_locationsOnProject);
          resolve(_locationsOnProject);
        })


    })

  }

  getLocationsListByName(project?, array?): Observable<any> {
    let filtering = ['?filter[where][and][0][projectId]=' + project];
    for (var each = 0; each < array.length; each++) {

      filtering.push('&filter[where][or][' + each + '][companyId]=' + array[each]);

    }
    let filterString = filtering.toString()
    let withoutComma = filterString.replace(/,/g, '');

    const url = `${this.path.base}/${this.path.model}${withoutComma}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }



  getDeviceByLocation(location) {
    return new Promise<any>((resolve, reject) => {
      let id = location.uid;
      if (id) {
        const url = `${this.path.base}/devices/${id}`;
        this.http.get(url)
          .map((data: any) => { return data })
          .toPromise()
          .then(x => { resolve(x) })
          .catch(e => { resolve({ uid: "NA" }); })
      } else {
        resolve({ uid: "NA" });
      }

    });
  }



  /*
  EDIT: /locations/{id}
  Edit a model instance by {{id}} from the data source.
  */
  public editLocationById(id, data) {
    return new Promise<any>((resolve, reject) => {
      const url = `${this.path.base}/${this.path.model}/${id}`;
      this.http.patch(url, data)
        .map((data: any) => { return data }).toPromise().then(x => {
          resolve(data);
        }).catch(x => {
          reject(x);
        })
    });

  }


  /*
  ADD: /locations/
  Add a model instance
  */
  public addLocation(data) {
    return new Promise<any>((resolve, reject) => {
      const url = `${this.path.base}/${this.path.model}`;
      this.http.post(url, data)
        .map((data: any) => { return data })
        .toPromise()
        .then(x => {
          resolve(data);
          alert(JSON.stringify(data));
        }).catch(x => {
          reject();
          alert(JSON.stringify(x));
        })
    });

  }


  /*
  DELETE: /locations/{id}
  Delete a model instance by {{id}} from the data source.
  */
  public deleteLocationById(id) {
    return new Promise<any>((resolve, reject) => {
      const url = `${this.path.base}/${this.path.model}/${id}`;
      this.http.delete(url)
        .map((data: any) => {
          //console.log(data)
          resolve(data);
        }).toPromise();

    });

  }


}
