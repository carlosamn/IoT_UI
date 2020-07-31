import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppHTTPService } from "../../app.http-service";
// Filters
import { filterQuery } from '../../common/filters/query.filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class ProjectsService {
  private path = { base: `${environment.basepath}`, model: 'projects' };
  public client;
  public dinamicDashboard=[];
  constructor(private http: AppHTTPService) {
    this.client;
    this.dinamicDashboard;
  }

  /*
  GET: /projects
  Find all instances of the model matched by filter from the data source.
  */
  getProjects(options?): Observable<any> {
    let filter = '';
    if(options) filter = filterQuery(options);
    let url = `${this.path.base}/${this.path.model}${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  getProjectsAms(options?): Observable<any> {
    let filter = '';
    if(options) filter = filterQuery(options);
    let url = `${this.path.base}/${this.path.model}${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }


  getProjectsForInviteUser(array?): Observable<any> {
    let filtering=[];
    //let array=['asdas','test29','999'];
    for(var each=0; each<array.length; each ++){
      if(each===0){
        filtering.push('?filter[where][or][0][id]='+array[each]);
      }else if (each>=0){
        filtering.push('&filter[where][or]['+each+'][id]='+array[each]);
      }
    }
    let filterString=filtering.toString()
    let withoutComma= filterString.replace(/,/g,'');
    //console.log("projects query");
    //console.log(withoutComma);
    //let filter = `?filter[where][or][0][name]=asdas&filter[where][or][1][name]=test29&filter[where][or][2][name]=newone`;
    //if (options) { filter = filterQuery(options); }
    const url = `${this.path.base}/${this.path.model}${withoutComma}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }




  getProjectsByUserType(userType): Observable<any> {
    if (userType === "admin") {
      //return this.getProjectsForInviteUser(userType);
      return this.getProjects();
    } else {
      return this.getProjects();
    }
  }






  /*
  POST: /projects
  Create a new instance of the model and persist it into the data source.
  */
  addProject(project): Observable<any> {

    let url = `${this.path.base}/${this.path.model}`;
    return this.http.post(url, project)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  PATCH: /projects/{id}
  Patch attributes for a model instance and persist it into the data source.
  */
  updateProject(id, project): Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}`;

    return this.http.patch(url, project)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /projects/{id}
  Find a model instance by {{id}} from the data source.
  */
  getProjectById(id): Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  DELETE: /projects/{id}
  Delete a model instance by {{id}} from the data source.
  */
  deleteProjectById(id): Observable<any> {
    let url = `${this.path.base}/${this.path.model}/${id}`;
    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /projects/count
  Count instances of the model matched by where from the data source.
  */
  countProjects(options?): Observable<any> {
    let filter = '';
    if(options) filter = filterQuery(options);
    let url = `${this.path.base}/${this.path.model}/count${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  //  Handle errors
  errorHandler(error: any): void {
    return error.error.error;
  }

}
