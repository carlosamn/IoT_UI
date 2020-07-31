import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppHTTPService } from '../../app.http-service'
import { AppSharedService } from '../../app.shared-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class EtdService {

  // to be refactored
  public companyId;
  private path = { base: `${environment.basepath}`, model: 'devices' };

  constructor(private http:   HttpClient, private sharedService: AppSharedService) {
    if (environment.production) {
      this.sharedService.currentCompanyId.subscribe(companyId => this.companyId = companyId);
    } else {
      this.companyId = '';
    }
  }

  /*
  GET: /devices
  Find all instances of the model matched by filter from the data source.
  */

  errorHandler(error: any): void {
  return error.error.error;
}

  getToken() {
    return localStorage.getItem('id');
  }

  getAllControllers() {
    return this.http.get(`${this.path.base}/devices`)
      .map(res => res);
  }
  getController(uid) {

    return this.http.get(
      `${this.path.base}/devices/${uid}`
    ).map(res => res).toPromise();
  }

  getControllers(client) {
    return this.http.get(
      `${this.path.base}/devices?filter={"where":{"or":[{"companyId":"${client}"}]}}`
    )
      .map(res => res);
  }

  getAnalogInputs(controller) {
    return this.http.get(`${this.path.base}/ainputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res)
      .catch((e:any)=>{return Observable.throw(e.status)})
  }

  AnalogInputsHeader(controller)
      {
        return this.http.get(`${this.path.base}/ainputs?filter[where][and][0][uid]=${controller}&filter[where][and][1][enable]=true`)
        .map(res=>res);

      }
  getSensorValues(controller) {
    return this.http.get(
      `${this.path.base}/devices/getsensordata?uid=${controller}&packetType=8`
    )
      .map(res => res);
  }

}
