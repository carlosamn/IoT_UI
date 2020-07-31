import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppHTTPService } from '../../app.http-service';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class AinputsService {
	private path = { base: `${environment.basepath}`, model: 'ainputs' };
	constructor(private http: AppHTTPService) {}

	/*
	PATCH: /ainputs
	Patch an existing model instance or insert a new one into the data source.
	*/
	patchAinput(ainput) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;
		return this.http.patch(url, ainput)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}


	/*
	GET: /ainputs
	Find all instances of the model matched by filter from the data source.
	*/
	getAinputs(options?) : Observable<any> {
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
	PUT: /ainputs
	Replace an existing model instance or insert a new one into the data source.
	*/
	putAinput(ainput) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.put(url, ainput)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /ainputs
	Create a new instance of the model and persist it into the data source.
	*/
	addAinput(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PATCH: /ainputs/{id}
	Patch attributes for a model instance and persist it into the data source
	*/
	patchAinputById(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.patch(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	Get: /ainputs/{id}
	Find a model instance by {{id}} from the data source.
	*/
	getAinputById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /ainputs/{id}
	Replace attributes for a model instance and persist it into the data source.
	*/
	updateAinput(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.put(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /ainputs/{id}
	Delete a model instance by {{id}} from the data source.
	*/
	deleteInput(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /ainputs/{id}/exists
	Check whether a model instance exists in the data source.
	*/
	verifyAinputById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}/exists`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /ainputs/{id}/replace
	Replace attributes for a model instance and persist it into the data source.
	*/
	replaceInputById(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}/replace`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /ainputs/change-stream
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
	POST: /ainputs/change-stream
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
	GET: /ainputs/count
	Count instances of the model matched by where from the data source.
	*/
	countAinputs(options) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/count`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /ainputs/findOne
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
	POST: /ainputs/replaceOrCreate
	Replace an existing model instance or insert a new one into the data source.
	*/
	replaceOrCreateAinput(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/replaceOrCreate`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /ainputs/update
	Update instances of the model matched by {{where}} from the data source.
	*/
	whereUpdateAinput(data, options?) : Observable<any> {
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
	POST: /ainputs/upsertWithWhere
	Update an existing model instance or insert a new one into the data source based on the where criteria.
	*/
	upsertAinputWithWhere(data, options?) : Observable<any> {
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
	POST: /ainputs/savetodevice/:uid
	Update an existing model instance or insert a new one into the data source based on the where criteria.
	*/
	ainputsBulkUpdate(uid, ainputs) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/savetodevice/${uid}`;
		
		return this.http.post(url, ainputs)
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
