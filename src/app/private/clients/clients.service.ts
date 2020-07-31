import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AppHTTPService } from './../../app.http-service';
import { environment } from '../../../environments/environment';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class ClientsService {
	private path = { base: `${environment.basepath}`, model: 'clients' };

	constructor(private http:  AppHTTPService ) {
	}

	/*
	GET: /clients
	Find all instances of the model matched by filter from the data source.
	*/
	getClients(options?) : Observable<any> {
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
	POST: /clients
	Create a new instance of the model and persist it into the data source.
	*/
	addClient(data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PATCH: /clients/{id}
	Patch attributes for a model instance and persist it into the data source
	*/
	updateClient(clientId, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}`;

		return this.http.patch(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	Get: /clients/{id}
	Find a model instance by {{id}} from the data source.
	*/
	getClientById(clientId, options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}/${clientId}${filter}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}
	getClientId(client): Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${client}`;
	return this.http.get(url)
	.map((data: any) => {
		return data;
	})
	}

	/*
	DELETE: /clients/{id}
	Delete a model instance by {{id}} from the data source.
	*/
	deleteClient(clientId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /clients/{id}/companies
	Queries companies of client.
	*/
	getCompaniesByClientId(clientId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/companies`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /clients/{id}/companies
	Creates a new instance in companies of this model.
	*/
	addCompaniesByClientId(clientId, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/companies`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /clients/{id}/companies
	Deletes all companies of this model.
	*/
	deleteCompaniesByClientId(clientId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/companies`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /clients/{id}/companies/{fk}
	Find a related item by id for companies.
	*/
	getClientByIdAndCompany(clientId, projectId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/companies/${projectId}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /clients/{id}/companies/{fk}
	Update a related item by id for companies.
	*/
	updateClientByIdAndCompany(clientId, company) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/companies/${company.id}`;

		return this.http.put(url, company)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /clients/{id}/companies/{fk}
	Update a related item by id for companies.
	*/
	deleteClientByIdAndCompany(clientId, projectId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/companies/${projectId}`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /clients/{id}/companies/count
	Counts companies of client.
	*/
	countCompaniesForClient(clientId, options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);

		let url = `${this.path.base}/${this.path.model}/${clientId}/companies/count${filter}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /clients/{id}/projects
	Queries projects of client.
	*/
	getProjectsByClient(clientId, options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);

		let url = `${this.path.base}/${this.path.model}/${clientId}/projects${filter}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	POST: /clients/{id}/projects
	Creates a new instance in projects of this model.
	*/
	addProjectByClient(clientId, data) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/projects`;

		return this.http.post(url, data)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /clients/{id}/projects
	Deletes all projects of this model.
	*/
	deleteProjectsByClient(clientId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/projects`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /clients/{id}/projects/{fk}
	Find a related item by id for projects.
	*/
	getClientProjectByProjectId(clientId, projectId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/projects/${projectId}`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	PUT: /clients/{id}/projects/{fk}
	Find a related item by id for projects.
	*/
	updateClientProjectByProjectId(clientId, project) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/projects/${project.id}`;

		return this.http.put(url, project)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	DELETE: /clients/{id}/projects/{fk}
	Find a related item by id for projects.
	*/
	deleteClientProjectByProjectId(clientId, projectId) : Observable<any> {
		let url = `${this.path.base}/${this.path.model}/${clientId}/projects/${projectId}`;

		return this.http.delete(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /clients/{id}/projects/count
	Counts projects of client
	*/
	countProjectsByClient(clientId, options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);

		let url = `${this.path.base}/${this.path.model}/${clientId}/projects/count${filter}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	/*
	GET: /clients/count
	Count instances of the model matched by where from the data source.
	*/
	countClients(options?) : Observable<any> {
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}/count${filter}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

  getClientCode(company)
  {
		const url = `${this.path.base}/${this.path.model}/code/${company}`;

		return this.http.get(url)
		  .map((data: any) => {

			return data;
		  })
		  .catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	getClientCodeByUserId() : Observable<any> {
		let options = { id: 'TEST' };
		let filter = '';
		if(options) filter = filterQuery(options);
		let url = `${this.path.base}/${this.path.model}${filter}`;

		return this.http.get(url)
			.map((data: any) => {
				return data;
			})
			.catch((e: any) => Observable.throw(this.errorHandler(e)));
	}

	getClientDashboards(client) {
		const url = `${this.path.base}/${this.path.model}/${client}`;
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
