import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AppHTTPService } from '../../app.http-service';
import { environment } from '../../../environments/environment';

//  Filters
import { filterQuery }  from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class UsersService {
  public userRealm;
  public MasterUser: any;
  public updflag: String;
  private path = { base: `${environment.basepath}`, model: 'users' };
  constructor(private http: AppHTTPService) {
    this.MasterUser;
    this.updflag;
    this.userRealm;
  }

  /*
  GET: /users
  Find all instances of the model matched by filter from the data source.
  */
  getUsers(options?) : Observable<any> {
    let filter = '';
    if (options) { filter = filterQuery(options); }
    let url = `${this.path.base}/${this.path.model}${filter}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  POST: /users
  Create a new instance of the model and persist it into the data source.
  */
  addUser(user) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}`;
    console.warn(url);
    return this.http.post(url, user)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  PATCH: /users/{id}
  Patch attributes for a model instance and persist it into the data source.
  */
  updateUser(id, user) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}`;
    return this.http.patch(url, user)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /users/{id}
  Find a model instance by {{id}} from the data source.
  */
  getUserById(id) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  DELETE: /users/{id}
  Delete a model instance by {{id}} from the data source.
  */
  deleteUserById(id) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /users/{id}/accessTokens
  Queries accessTokens of EtdUser.
  */
  queryAccessTokensByUserId(id) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/accessTokens`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  POST: /users/{id}/accessTokens
  Creates a new instance in accessTokens of this model.
  */
  createUserAccessToken(id, model) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/accessTokens`;
    return this.http.post(url, model)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  DELETE: /users/{id}/accessTokens
  Deletes all accessTokens of this model.
  */
  deleteTokensByUser(id) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/accessTokens`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /users/{id}/accessTokens/{fk}
  Deletes all accessTokens of this model.
  */
  getTokenByIdAndUser(id, tokenid) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/accessTokens/${tokenid}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  PUT: /users/{id}/accessTokens/{fk}
  Deletes all accessTokens of this model.
  */
  updateTokenByIdAndUser(id, tokenid, data) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/accessTokens/${tokenid}`;
    return this.http.put(url, data)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  DELETE: /users/{id}/accessTokens/{fk}
  Delete a related item by id for accessTokens.
  */
  deleteTokenByIdAndUser(id, tokenid) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/accessTokens/${tokenid}`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /users/{id}/accessTokens/count
  Counts accessTokens of EtdUser.
  */
  countAccessTokensByUserId(id) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/accessTokens/count`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /users/{id}/projects
  Queries projects of EtdUser.
  */
  getProjectsByUserId(id, options?) : Observable<any> {
    let filter = '';
    if(options) filter = filterQuery(options);
    let url = `${this.path.base}/${this.path.model}/${id}/projects${filter}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  POST: /users/{id}/projects
  Creates a new instance in projects of this model.
  */
  addUserProject(id, project) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects`;
    return this.http.post(url, project)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }


  /*
  DELETE: /users/{id}/projects
  Deletes all projects of this model.
  */
  deleteUserProject(id) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /users/{id}/projects/{fk}
  Find a related item by id for projects.
  */
  getUserProjectById(id, projectId) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects/${projectId}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  PUT: /users/{id}/projects/{fk}
  Update a related item by id for projects.
  */
  updateUserProjectById(id, project) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects/${project.id}`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  DELETE: /users/{id}/projects/{fk}
  Delete a related item by id for projects.
  */
  deleteUserProjectById(id, projectId) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects/${projectId}`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /users/{id}/projects/count
  Counts projects of EtdUser.
  */
  countProjectsByUser(id) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects/count`;
    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  PUT: /users/{id}/projects/rel/{fk}
  Add a related item by id for projects.
  */
  updateRelatedProjectById(id, project) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects/rel/${project.id}`;
    return this.http.put(url, {})
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  DELETE: /users/{id}/projects/rel/{fk}
  Remove the projects relation to an item by id.
  */
  deleteProjectsById(id, projectId) : Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}/projects/rel/${projectId}`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  getInvitedUsers(){
    let url = `${this.path.base}/users?filter={"where":{"or":[{"userType":"operator"},{"userType":"readonly"},{"userType":"admin"},{"userType":"technician"}]}}`;
    return this.http.get(url)
    .map(res => res);
  }

  errorHandler(error: any): void {
    return error.error.error;
  }

  sendEmail(user, data) {
    return this.http.post(`${this.path.base}/users/invite/${user}`, data);
  }
}
