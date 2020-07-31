import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class ContainersService {
	private path = { base: `${environment.basepath}`, model: 'containers' };
	constructor(private http: HttpClient) {}


	// POST /containers/{container}/upload
	uploadImage(data, type, company) {
	let headers = new HttpHeaders({ clientId: company });
	return this.http.post(`${this.path.base}/${this.path.model}/client${type}/upload`, data, { headers: headers })
	  .map((data: any) => {
	  	let url = `${this.path.base}/${this.path.model}/client${type}/download/${company}.jpeg`
	  	return url;
	  })
	  .catch((e: any) => Observable.throw(this.errorHandler(e)));

	}

	//  Basic error handler
	errorHandler(error: any): void {
		return error.error.error;
	}
}
