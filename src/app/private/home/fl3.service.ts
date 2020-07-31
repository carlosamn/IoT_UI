import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppHTTPService } from '../../app.http-service'
import { AppSharedService } from '../../app.shared-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class FL3Service {

  constructor(private http: AppHTTPService, private sharedService: AppSharedService) {}



  getAllRecords() {
    let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/allrecords.json';
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  getInputs() {
    let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/inputs.json';
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  loadSettings() {
    let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/settingsload.json';
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  loadSettingsWithGraphType() {

    let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/settingsloadwithgraphtype.json';
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  collarAnalysisLoad(controllerId?) {
    //  Controller Id is a obligatory parameter
    let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/collaranalysisload.json';
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  countWavData(controllerId?) {
    //  Controller Id is a obligatory parameter
    let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/wavdatacount.json';
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  getWavData(controllerId?, page?) {
    let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/wavdata.json';
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }


  private errorHandler(error: any): void {
    return error.error.error;
  }

}
