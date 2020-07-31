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
export class FtpsService {
	private path = { base: `${environment.basepath}`, model: 'ftps' };
	constructor(private http: HttpClient) {}

	/*
	PATCH: /ftps
	Patch an existing model instance or insert a new one into the data source.
	*/
	patchFtp(ftp) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;
		return this.http.patch(url, ftp)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}


	/*
	GET: /ftps
	Find all instances of the model matched by filter from the data source.
	*/
	getFtps(options?) : Observable<any> {
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
	PUT: /ftps
	Replace an existing model instance or insert a new one into the data source.
	*/
	putFtp(ftp) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.put(url, ftp)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /ftps
	Create a new instance of the model and persist it into the data source.
	*/
	addFtp(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PATCH: /ftps/{id}
	Patch attributes for a model instance and persist it into the data source
	*/
	patchFtpById(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.patch(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	Get: /ftps/{id}
	Find a model instance by {{id}} from the data source.
	*/
	getFtpById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /ftps/{id}
	Replace attributes for a model instance and persist it into the data source.
	*/
	updateFtp(id, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.put(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /ftps/{id}
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
	GET: /ftps/{id}/exists
	Check whether a model instance exists in the data source.
	*/
	verifyFtpById(id) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}/exists`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /ftps/{id}/replace
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
	GET: /ftps/change-stream
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
	POST: /ftps/change-stream
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
	GET: /ftps/count
	Count instances of the model matched by where from the data source.
	*/
	countFtps(options) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/count`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /ftps/findOne
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
	POST: /ftps/replaceOrCreate
	Replace an existing model instance or insert a new one into the data source.
	*/
	replaceOrCreateFtp(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/replaceOrCreate`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /ftps/update
	Update instances of the model matched by {{where}} from the data source.
	*/
	whereUpdateFtp(data, options?) : Observable<any> {
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
	POST: /ftps/upsertWithWhere
	Update an existing model instance or insert a new one into the data source based on the where criteria.
	*/
	upsertFtpWithWhere(data, options?) : Observable<any> {
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
