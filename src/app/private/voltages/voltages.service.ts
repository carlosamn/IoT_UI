import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class VoltagesService {
	private path = { base: `${environment.basepath}`, model: 'voltages' };
	constructor(private http: HttpClient) {}

	/*
	PATCH: /voltages
	Patch an existing model instance or insert a new one into the data source.
	*/
	patchVoltage(voltage) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;
		return this.http.patch(url, voltage)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}


	/*
	GET: /voltages
	Find all instances of the model matched by filter from the data source.
	*/
	getVoltages(options?) : Observable<any> {
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
	PUT: /voltages
	Replace an existing model instance or insert a new one into the data source.
	*/
	putVoltage(voltage) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.put(url, voltage)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /voltages
	Create a new instance of the model and persist it into the data source.
	*/
	addVoltage(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PATCH: /voltages/{id}
	Patch attributes for a model instance and persist it into the data source
	*/
	patchVoltageById(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.patch(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	Get: /voltages/{id}
	Find a model instance by {{id}} from the data source.
	*/
	getVoltageById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /voltages/{id}
	Replace attributes for a model instance and persist it into the data source.
	*/
	updateVoltage(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.put(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /voltages/{id}
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
	GET: /voltages/{id}/exists
	Check whether a model instance exists in the data source.
	*/
	verifyVoltageById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}/exists`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /voltages/{id}/replace
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
	GET: /voltages/change-stream
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
	POST: /voltages/change-stream
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
	GET: /voltages/count
	Count instances of the model matched by where from the data source.
	*/
	countVoltages(options) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/count`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /voltages/findOne
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
	POST: /voltages/replaceOrCreate
	Replace an existing model instance or insert a new one into the data source.
	*/
	replaceOrCreateVoltage(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/replaceOrCreate`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /voltages/update
	Update instances of the model matched by {{where}} from the data source.
	*/
	whereUpdateVoltage(data, options?) : Observable<any> {
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
	POST: /voltages/upsertWithWhere
	Update an existing model instance or insert a new one into the data source based on the where criteria.
	*/
	upsertVoltageWithWhere(data, options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}/upsertWithWhere${filter}`;

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
