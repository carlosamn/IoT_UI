import { Router } from '@angular/router';

//  Observables
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {AppHTTPService} from '../../app.http-service'
import { AppSharedService } from '../../app.shared-service';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class FL3Service {
  private fl3Path = { base: `${environment.basepath}`, model: 'fl3s' };
  private fl3SettingsPath = { base: `${environment.basepath}`, model: 'fl3settings' };
  private deviceContainerPath = { base: `${environment.basepath}`, model: 'deviceStorages' };
  //public reportStored:any=[];

  constructor(private http: AppHTTPService, private sharedService: AppSharedService) {

  }

  public addEmptyRows(fl3Records,fl3EmptyRows) {
    if (fl3Records.length > 4) return false;
    else {
      for (let i = 0; i < 6 - fl3Records.length; i++) {
        fl3EmptyRows.push({ column1: 'No data', column2: 'No data' });
      }
    }
  }

  public addItemToReport(recordId) {
    let records = [];
    const recordsForReport = localStorage.records;
      if (recordsForReport) {
      records = JSON.parse(recordsForReport);

      records.push(recordId);
      localStorage.records = JSON.stringify(records);

    } else {
      records.push(recordId);
      localStorage.records = JSON.stringify(records);
    }

  }

  public removeItemToReport(recordId) {
    let recordsForReport = localStorage.records;
    let records = JSON.parse(recordsForReport);

    let index = records.findIndex(record => record == recordId);
    if (index > -1) records.splice(index, 1);

    localStorage.records = JSON.stringify(records);
  }

  public removeAllReportItems() {
    const reports = JSON.stringify([]);
    localStorage.records = reports;
  }

  public getRecordsForReport() {
    const records = localStorage.records;
    if (records) {
      return JSON.parse(records);
    } else {
      return [];
    }
  }

  getAllFl3Records(query) {
    let stringFilter = `?filter=${JSON.stringify(query)}`;
    let url = `${this.fl3Path.base}/${this.fl3Path.model}${stringFilter}`;
    return this.http.get(url).map((data: any) => {
      return data;
    })
    .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  getWavDataById(id) {
    let url = `${this.fl3Path.base}/${this.fl3Path.model}/${id}`;
    return this.http.get(url).map((data: any) => {
      return data;
    })
    .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  deleteFl3(recordId) {
    let url = `${this.fl3Path.base}/${this.fl3Path.model}/${recordId}`;
    return this.http.delete(url).map((data: any) => {
      return data;
    })
    .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  patchFl3(id, data) {
    let url = `${this.fl3Path.base}/${this.fl3Path.model}/${id}`;

    return this.http.patch(url, data)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }
  /*
  POST: /fl3settings
  Create a new instance of the model and persist it into the data source.
  */
  runFilter(data) {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}/filter`;
    return this.http.post(url, data)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }


  /*
  POST: /fl3settings
  Create a new instance of the model and persist it into the data source.
  */
  addFl3Settings(settings) {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}`;
    return this.http.post(url, settings)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /fl3settings/load
  Find controller configuration
  */
  loadFl3SettingsFromControllers(uid, mode) {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}/load/uid/${uid}/config/${mode}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /fl3settings
  Find all instances of the model matched by filter from the data source.
  */
  getAllFl3Settings(options?) {
    let filter = '';
    if(options) filter = filterQuery(options);
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}${filter}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  PATCH: /fl3settings/{id}
  Patch attributes for a model instance and persist it into the data source.
  */
  patchFl3Settings(id, data) {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}/${id}`;
    return this.http.patch(url, data)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /fl3settings/{id}
  Find a model instance by {{id}} from the data source.
  */
  getFl3SettingsById(id) {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}/${id}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch( error => {
        return error
      });
  }

  /*
  DELETE: /fl3settings/{id}
  Delete a model instance by {{id}} from the data source.
  */
  deleteFl3Settings(id) {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}/${id}`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /fl3settings/count
  Count instances of the model matched by where from the data source.
  */
  countFl3Settings() {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}/count`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  private errorHandler(error: any): void {
    return error;
  }

  uploadWav(options, data) {
    let url = `${this.deviceContainerPath.base}/${this.deviceContainerPath.model}/fl3/upload?uid=${options.uid}`;
    //  alert(url);
    return this.http.post(url, data)
    .map((data: any) => {
      //console.log(data);
      return data;
    })
    .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  capture(command, uid) {
    let url = `${this.fl3SettingsPath.base}/${this.fl3SettingsPath.model}/fl3event/uid/${uid}/command/${command}`;
    /*
    console.log(" ")
    console.error(" ***  ***")
    console.error(" *** WARNING :: FL3 CAPTURE COMMAND ")
    console.error(" ***  ***")
    console.log(" /command : " + command)
    console.log(" /uid : " + uid)
    console.log(" /url : " + url)
    */
    return this.http.post(url, {})
    .map((data: any) => {
      return data;
    })
  }

  getFl3ChangeStreamURL(options?) {
    let url = `${this.fl3Path.base}/${this.fl3Path.model}/change-stream`;
    return url;
  }

}
