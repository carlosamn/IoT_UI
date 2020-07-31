import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppHTTPService } from '../../app.http-service';
import { environment } from '../../../environments/environment';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class CompaniesService {
	private path = { base: `${environment.basepath}`, model: 'companies' };
	constructor(private http: AppHTTPService) {}

	/*
	GET: /companies
	Find all instances of the model matched by filter from the data source.
	*/
	getCompanies(options?) : Observable<any> {
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
	POST: /companies
	Create a new instance of the model and persist it into the data source.
	*/
	addCompany(company) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.post(url, company)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PATCH: /companies/{id}
	Patch attributes for a model instance and persist it into the data source.
	*/
	updateCompany(id, company) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.patch(url, company)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /companies/{id}
	Find a model instance by {{id}} from the data source.
	*/
	getCompanyById(id, company) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.get(url, company)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /companies/{id}
	Delete a model instance by {{id}} from the data source.
	*/
	deleteCompanyById(id, company) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${id}`;

		return this.http.delete(url, company)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /companies/count
	Count instances of the model matched by where from the data source.
	*/
	countCompanies(options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}/count${options}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	//  Basic error handler
	errorHandler(error: any): void {
		return error.error.error;
	}
}
