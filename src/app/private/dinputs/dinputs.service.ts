import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AppHTTPService } from '../../app.http-service'
import { environment } from '../../../environments/environment';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class DinputsService {
	private path = { base: `${environment.basepath}`, model: 'dinputs' };
	 constructor(private http: AppHTTPService){}

	/*
	PATCH: /dinputs
	Patch an existing model instance or insert a new one into the data source.
	*/
	patchDinput(dinput) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;
		return this.http.patch(url, dinput)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}


	/*
	GET: /dinputs
	Find all instances of the model matched by filter from the data source.
	*/
	getDinputs(options?) : Observable<any> {
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
	PUT: /dinputs
	Replace an existing model instance or insert a new one into the data source.
	*/
	putDinput(dinput) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.put(url, dinput)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /dinputs
	Create a new instance of the model and persist it into the data source.
	*/
	addDinput(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PATCH: /dinputs/{id}
	Patch attributes for a model instance and persist it into the data source
	*/
	patchDinputById(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.patch(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	Get: /dinputs/{id}
	Find a model instance by {{id}} from the data source.
	*/
	getDinputById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /dinputs/{id}
	Replace attributes for a model instance and persist it into the data source.
	*/
	updateDinput(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.put(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /dinputs/{id}
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
	GET: /dinputs/{id}/exists
	Check whether a model instance exists in the data source.
	*/
	verifyDinputById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}/exists`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /dinputs/{id}/replace
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
	GET: /dinputs/change-stream
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
	POST: /dinputs/change-stream
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
	GET: /dinputs/count
	Count instances of the model matched by where from the data source.
	*/
	countDinputs(options) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/count`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /dinputs/findOne
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
	POST: /dinputs/replaceOrCreate
	Replace an existing model instance or insert a new one into the data source.
	*/
	replaceOrCreateDinput(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/replaceOrCreate`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /dinputs/update
	Update instances of the model matched by {{where}} from the data source.
	*/
	whereUpdateDinput(data, options?) : Observable<any> {
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
	POST: /dinputs/upsertWithWhere
	Update an existing model instance or insert a new one into the data source based on the where criteria.
	*/
	upsertDinputWithWhere(data, options?) : Observable<any> {
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
