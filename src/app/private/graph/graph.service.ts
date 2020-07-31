import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class GraphService {
	private path = { base: `${environment.basepath}`, model: 'graph' };
	constructor(private http: HttpClient) {}

	/*
	GET: /devices
	Find all instances of the model matched by filter from the data source.
	*/
    getWavData(options?) {
        options = { limit: 1 };
        let filter = '';
        if(options) filter = filterQuery(options, 'nowhere');
    
        let url = `${this.path.base}/${this.path.model}${filter}&filter[order]=captureTimestamp DESC`;
        //let url = 'https://s3-us-west-2.amazonaws.com/fl3testing/newwavdata.json';
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
    
	errorHandler(error: any): void {
		return error.error.error;
	}
}
