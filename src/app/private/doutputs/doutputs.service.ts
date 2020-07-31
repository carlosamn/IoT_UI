import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppHTTPService } from '../../app.http-service'
//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class DoutputsService {
	private path = { base: `${environment.basepath}`, model: 'doutputs' };
	constructor(private http: AppHTTPService) {}

	/*
	PATCH: /outputs
	Patch an existing model instance or insert a new one into the data source.
	*/
	patchDoutput(output) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;
		return this.http.patch(url, output)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}


	/*
	GET: /outputs
	Find all instances of the model matched by filter from the data source.
	*/
	getDoutputs(options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}${filter}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /outputs
	Replace an existing model instance or insert a new one into the data source.
	*/
	putDoutput(output) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.put(url, output)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /doutputs
	Create a new instance of the model and persist it into the data source.
	*/
	addDoutput(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PATCH: /doutputs/{id}
	Patch attributes for a model instance and persist it into the data source
	*/
	patchDoutputById(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.patch(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	Get: /doutputs/{id}
	Find a model instance by {{id}} from the data source.
	*/
	getDoutputById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /doutputs/{id}
	Replace attributes for a model instance and persist it into the data source.
	*/
	updateDoutput(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.put(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /doutputs/{id}
	Delete a model instance by {{id}} from the data source.
	*/
	deleteDoutput(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /doutputs/{id}/exists
	Check whether a model instance exists in the data source.
	*/
	verifyDoutputById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}/exists`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /doutputs/{id}/replace
	Replace attributes for a model instance and persist it into the data source.
	*/
	replaceDoutputById(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}/replace`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /doutputs/change-stream
	Create a change stream.
	*/
	getChangeStreams() : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/change-stream`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /doutputs/change-stream
	Create a change stream.
	*/
	addChangeStream(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/change-stream`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /doutputs/count
	Count instances of the model matched by where from the data source.
	*/
	countDoutputs(options) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/count`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /doutputs/findOne
	Find first instance of the model matched by filter from the data source.
	*/
	findOne(options) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/findOne`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /doutputs/replaceOrCreate
	Replace an existing model instance or insert a new one into the data source.
	*/
	replaceOrCreateDoutput(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/replaceOrCreate`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /doutputs/update
	Update instances of the model matched by {{where}} from the data source.
	*/
	whereUpdateDoutput(data, options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}/update${filter}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /doutputs/upsertWithWhere
	Update an existing model instance or insert a new one into the data source based on the where criteria.
	*/
	upsertDoutputWithWhere(data, options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}/upsertWithWhere${filter}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
		POST: /doutputs/save?type=<>&action=<>
		Save the digital output to controller
		in :
			data: post payload
			params: query params if any
	*/
	saveDigitalOutputs(data, params?) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/save/`;
		if (!data) data={};
		// let queryParams = '';
		// if(params) {
		// 	url = `${url}?`;
		// 	params.forEach(kv => {
		// 		url = `${url}${kv.key}=${kv.value}&`;
		// 	});
		// }
		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	// Handling custom errors
	errorHandler(error: any): void {
		return error.error.error;
	}
}
