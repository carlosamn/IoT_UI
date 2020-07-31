import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class VideoService {
	private path = { base: `${environment.basepath}`, model: 'video' };
	constructor(private http: HttpClient) {}

	/*
	GET: /devices
	Find all instances of the model matched by filter from the data source.
	*/

	errorHandler(error: any): void {
		return error.error.error;
	}
}
