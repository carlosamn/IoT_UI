/**
 *  -----------------------------------------------------
 * |                                                     |
 * |  DEVICES SERVICE:                                   |
 * |                                                     |
 * | Share controllers/devices data between components   |
 * | and pull http request from Loopback API             |
 * |                                                     |
 * ------------------------------------------------------
 *
 */


// --------------------------------------------------------- //
// -- Import Angular Resources                             - //
// --------------------------------------------------------- //
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppHTTPService } from '../../app.http-service'
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { map } from 'rxjs/operator/map';
// --------------------------------------------------------- //




// --------------------------------------------------------- //
// -- Import App Shared Services                           - //
// --------------------------------------------------------- //
import { AppSharedService } from '../../app.shared-service';
import { ClientsService } from '../clients/clients.service';
// --------------------------------------------------------- //



// --------------------------------------------------------- //
// -- Import Enviorenments                                 - //
// --------------------------------------------------------- //
import { environment } from '../../../environments/environment';
// --------------------------------------------------------- //



// --------------------------------------------------------- //
// -- Import Streaming Resources                           - //
// --------------------------------------------------------- //
import * as EventSource from 'eventsource';
// --------------------------------------------------------- //



// --------------------------------------------------------- //
// -- Import  Filters                                      - //
// --------------------------------------------------------- //
import { filterQuery } from '../../common/filters/query.filter';
// --------------------------------------------------------- //



// --------------------------------------------------------- //
// -- Import Misc Helpers                                  - //
// --------------------------------------------------------- //
import { parse } from 'url';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
// --------------------------------------------------------- //





// --------------------------------------------------------- //
// -- Device Service                                       - //
// --------------------------------------------------------- //
@Injectable()
export class DevicesService {


  // Path's variables //
  private path = { base: `${environment.basepath}`, model: 'devices', ainput:'ainputs' };


  // Services variables //
  private uid;
  private project;
  public pages;
  public clientOfUser;
  public device;
  public currentCompany;
  someStrings: string[] = [];
  subscription;




  constructor(
    private http: AppHTTPService,
    private clientsService: ClientsService,
    private zone: NgZone,
    private sharedService: AppSharedService) {

    this.sharedService.currentCompany.subscribe(company => this.currentCompany = company);

    this.uid = sessionStorage.getItem('userId');
    //  this.runObs();
  }

  runObs() {
    const observable = Observable.create(observer => {
      const eventSource = new EventSource(this.path.base + '/api/devices/logreport/TEL999?startDate=20180601&endDate=20180603&interval=1');
      eventSource.onmessage = x => observer.next(x.data);
      eventSource.onerror = x => observer.error(x);
      eventSource.addEventListener('data', e => {
        //  //console.log(e['data']);
      });
      return () => {
        eventSource.close();
      };
    });

    this.subscription = observable.subscribe({
      next: guid => {
        this.zone.run(() => this.someStrings.push(guid));
      },
      error: err => { }//console.error('something wrong occurred: ' + err)
    });
  }

  getDashboardPages() {
    return new Promise<any>((resolve, reject) => {
      //  Aqui creo un array vacÃ­o
      const dashboardPages = [];
      this.clientsService.getClientDashboards(this.currentCompany)
        .subscribe(client => {
          //  Client es el cliente (telus, ams)
          const clientPages = client.dashboards;
          //console.warn("const clientPages = client.dashboards;")
          //console.warn(client.dashboards)
          //  Aqui traigo todos los dashboards en duro
          for (var option in clientPages) {
            //  Aca verifico cada pagina si es true, clientPages[option] es lo mismo que decir clientPages[option] == true
            //  Si es true pusheo, entonces obtengo todas las paginas en true
            if (clientPages[option]) { dashboardPages.push({ page: option, active: false }); }
          }
          //  Aqui ahora dashboardPages tiene todas las paginas en true
          resolve(dashboardPages);
        }, err => {
          reject(err);
        });
    });
  }

  /*
  GET: /devices
  Find all instances of the model matched by filter from the data source.
  */
  getDevices(options?): Observable<any> {
    let filter = '';
    if (options) {
      filter = filterQuery(options);
    }
    const url = `${this.path.base}/${this.path.model}${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /locations
  */
  getLocations(options?): Observable<any> {
    let filter = '';
    if (options) {
      filter = filterQuery(options);
    }
    const url = `${this.path.base}/locations/${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }


  //for can retrieve all devices of specific project and companies

  getDevicesListByName(project?, array?): Observable<any> {
    let filtering = ['?filter[where][and][0][projectId]=' + project];
    for (var each = 0; each < array.length; each++) {

      filtering.push('&filter[where][or][' + each + '][companyId]=' + array[each]);

    }
    let filterString = filtering.toString()
    let withoutComma = filterString.replace(/,/g, '');

    const url = `${this.path.base}/${this.path.model}${withoutComma}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }



  /*
  POST: /devices
  Create a new instance of the model and persist it into the data source.
  */
  addDevice(model): Observable<any> {
    const url = `${this.path.base}/${this.path.model}`;

    return this.http.post(url, model)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  PATCH: /devices/{id}
  Find a model instance by {{id}} from the data source.
  */
  updateDeviceById(id, data): Observable<any> {
    const url = `${this.path.base}/${this.path.model}/${id}`;

    return this.http.put(url, data)
      .map((info: any) => {
        return info;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  GET: /devices/{id}
  Find a model instance by {{id}} from the data source.
  */
  getDeviceById(id): Observable<any> {
    const url = `${this.path.base}/${this.path.model}/${id}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  DELETE: /devices/{id}
  Delete a model instance by {{id}} from the data source.
  */
  deleteDeviceById(id): Observable<any> {
    const url = `${this.path.base}/${this.path.model}/${id}`;

    return this.http.delete(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  Get: /devices/count
  Count instances of the model matched by where from the data source.
  */
  getDeviceCount(options?): Observable<any> {
    let filter = '';
    if (options) { filter = filterQuery(options); }
    const url = `${this.path.base}/${this.path.model}/count${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  Get: /devices/getsensordata
  No information yet
  */
  getSensorData(options?): Observable<any> {
    let filter = '';
    if (options) { filter = filterQuery(options); }
    const url = `${this.path.base}/${this.path.model}/getsensordata${filter}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  Get: /devices/metadata/{uid}/packet/packetType
  No information yet
  */
  getMetadataByPacket(packetType, options?): Observable<any> {
    const uid = sessionStorage.getItem('userId');
    const url = `${this.path.base}/${this.path.model}/metadata/${this.uid}/packet/${packetType}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  /*
  Get: /devices/sensordata/{uid}/packet/packetType
  No information yet
  */
  getSensorDataByPacket(packetType, options?): Observable<any> {
    const uid = sessionStorage.getItem('userId');
    const url = `${this.path.base}/${this.path.model}/sensordata/${this.uid}/packet/${packetType}`;

    return this.http.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw(this.errorHandler(e)));
  }


  //  Error Handlers
  errorHandler(error: any): void {
    return error.error.error;
  }


  //  To be refactored

  getToken() {
    return sessionStorage.getItem('token');
  }

  getDeviceObj(controller) {
    return this.http.get(`${this.path.base}/devices/${controller}`)
      .map(res => res);
  }

  getDeviceInfo(controller) {
    return this.http.get(`${this.path.base}/devices/${controller}/packet/2`)
      .map(res => res);
  }

  getAllControllers() {
    return this.http.get(`${this.path.base}/devices`)
      .map(res => res);
  }

  getControllers(client) {
    return this.http.get(
      `${this.path.base}/devices?filter={"where":{"or":[{"companyId":"${client}"}]}}`
    )
      .map(res => res);
  }

  getControllersByProject(project) {
    return this.http.get(
      `${this.path.base}/devices?filter={"where":{"or":[{"projectId":"${project}"}]}}`
    )
      .map(res => res);
  }

  getCompanyById(companyId: any) {
    return this.http.get(
      `${this.path.base}/projects?filter={"where":{"or":[{"companyId":"${companyId}"}]}}`
    )
      .map(res => res);
  }

  getProjects() {
    return this.http.get(`${this.path.base}/projects`)
      .map(res => res);
  }

  getLogInterval() {
    return this.http.get(`${this.path.base}/logintervals`)
      .map(res => {
        if (res) {
          return res;
        } else {
          return '';
        }
      });
  }

  getLogIntervalByController(controller) {
    let filter = '';
    if (controller) { filter = filterQuery(controller); }
    return this.http.get(`${this.path.base}/logintervals${filter}`)
      .map(res => {
        if (res) {
          return res;
        } else {
          return '';
        }
      });
  }

  getFtp() {
    return this.http.get(`${this.path.base}/ftps`)
      .map(res => Array.of(res));
  }

  getAnalogInputs(controller) {
    return this.http.get(`${this.path.base}/ainputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  getSensorValues(controller) {
    return this.http.get(`http://35.182.172.115:8090/api/sensordata/device/${controller}/packet/8`)
      .map(res => res);
  }

  getDigitalInputs(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/dinputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  getDigitalOutputs(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/doutputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  getVoltages(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/voltages?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  checkIfLogForControllerExists(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/logintervals/${controller}`)
      .map(res => res);
  }

  checkAnalogInputs(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/ainputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  checkDigitalInputs(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/dinputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  checkDigitalOutputs(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/doutputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  checkVoltages(controller) {
    const token = this.getToken();
    return this.http.get(`${this.path.base}/voltages?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map(res => res);
  }

  getSetupVoltage() {
    return this.http.get(`${this.path.base}/voltages`)
      .map(res => res);
  }

  async setLogInterval(parameters) {
    for (let c = 0; c < parameters.length; c++) {
      await this.sendLogInterval(parameters[c]);
    }
  }

  sendLogInterval(parameters) {
    return this.http.post(`${this.path.base}/logintervals`, parameters)
      .subscribe(res => res);
  }

  async updateLogInterval(parameters) {
    for (let c = 0; c < parameters.length; c++) {
      await this.sendUpdateLogInterval(parameters[c]);
    }
  }

  sendUpdateLogInterval(parameters) {
    return new Promise((resolve, reject) => {
      const uid = parameters.uid;
      return this.http.patch(`${this.path.base}/logintervals/${uid}`, parameters)
        .subscribe(res => {
          resolve();
        });
      });
  }

  setFtp(parameters: any[]) {
    return this.http.post(`${this.path.base}/ftps`, parameters)
      .map(res => res);
  }

  updateAlarmFromSettings(id, data) {
    return this.http.patch(`${this.path.base}/ainputs/${id}`, data)
      .subscribe(res => { });

    /*  let url = `${this.path.base}/ainputs/${id}`

      return this.http.patch(url, data)
        .map((data: any) => {
          return data;
        })*/
    //.catch((e: any) => Observable.throw(this.errorHandler(e)));
  }

  updateControllerProject(uid, project) {
    return this.http.patch(`${this.path.base}/devices/${uid}`, project)
      .subscribe(res => res);
  }

  setAnalogInput(data) {
    return this.http.post(`${this.path.base}/ainputs`, data)
      .subscribe(res => res);
  }

  updateAnalogInput(oldParams, newParams) {
    return new Promise<any>(async (resolve, reject) => {
      const ainputs = [];
      let ainput;
      for (let i = 0; i < newParams.length; i++) {

        if ((oldParams[i].enable && !newParams[i].enable) || newParams[i].enable) {
          //if (oldParams[i].enable || newParams[i].enable) {
          //ainput = await this.sendAinputUpdate(newParams[i]);
          ainputs.push(ainput);
        }
      }
      resolve(ainputs);
    });
  }

  updateDeviceEdit(device) {
    return new Promise<any>(async (resolve, reject) => {
      let uid = device.uid;
      this.http.put(`${this.path.base}/devices/${uid}`, device).toPromise().then(x => {
        resolve(x);
      });

    });
  }

  savetodevice(data, uid){//:Observable<any>{
    console.log(data)

		let url = `${this.path.base}/${this.path.ainput}/savetodevice/${uid}`;
    console.log("post data to this url.."+url)
		this.http.post(url, data)
			.subscribe(data=>{
				//return data;
			})
			//.catch((e:any)=>Observable.throw(this.errorHandler(e)));
	}

  sendAinputUpdate(data): Promise<any> {
    const controller = data.uid;
    const channel = data.channelId;
    const id = data.id;
    return new Promise<any>((resolve, reject) => {
      return this.http.patch(`${this.path.base}/ainputs/${id}`, data)
        .subscribe(res => {

          resolve(res);
        }, err => {

          reject(err);
        });
    });
  }

  setDigitalInput(data) {
    return this.http.post(`${this.path.base}/dinputs`, data)
      .subscribe(res => res);
  }

  updateDigitalInput(oldParams, newParams) {
    return new Promise<any>(async (resolve, reject) => {
      const dinputs = [];
      let dinput;
      for (let i = 0; i < newParams.length; i++) {
        if (newParams[i].enable || oldParams[i].enable) {
          dinput = await this.sendDinputUpdate(newParams[i]);
          dinputs.push(dinput);
        }
      }
      resolve(dinputs);
    })

  }

  sendDinputUpdate(data): Promise<any> {
    const controller = data.uid;
    const channel = data.channelId;
    const id = data.id;
    return new Promise<any>((resolve, reject) => {
      return this.http.patch(`${this.path.base}/dinputs/${id}`, data)
        .subscribe(res => {
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  setDigitalOutput(data) {
    return this.http.post(`${this.path.base}/doutputs`, data)
      .subscribe(res => res);
  }

  updateDigitalOutput(data) {
    return new Promise<any>((resolve, reject) => {
      return this.http.patch(`${this.path.base}/doutputs/${data.uid}`, data)
        .subscribe(res => {
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  sendDoutputUpdate(data): Promise<any> {
    const controller = data.uid;
    const channel = data.channelId;
    const id = data.id;
    return new Promise<any>((resolve, reject) => {
      return this.http.patch(`${this.path.base}/doutputs/${id}`, data)
        .subscribe(res => {
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  setVoltage(data) {
    return new Promise<any>((resolve, reject) => {
      return this.http.post(`${this.path.base}/voltages`, data)
        .subscribe(res => {
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  updateVoltage(data) {
    return new Promise<any>((resolve, reject) => {
      return this.http.patch(`${this.path.base}/voltages/${data.uid}`, data)
        .subscribe(res => {
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  getLogReports(uid, query?) {
    let stringFilter = query ? `?startDate=${query.startDate}&endDate=${query.endDate}&interval=${query.interval}` : '';
    let url = `${this.path.base}/devices/logreport/${uid}${stringFilter}`;
    return new Promise((resolve: Function, reject: Function) => {
      return this.http.get(url).subscribe(
        logresports => resolve(logresports),
        error => reject(error))
    });
  }

  initializeChangeStream(data) {
    let response = [];
    const url = `${this.path.base}/devices/logreport/${data.uid}?startDate=${data.startDate}&endDate=${data.endDate}&interval=${data.interval}`;
    return new Promise((resolve: Function, reject: Function) => {
      let result = '';
      const eventSource = new EventSource(url);

      eventSource.addEventListener('data', msg => {
        console.log(msg);
        result = msg.data;
        if (result === '"Done"') {
          eventSource.close();
          resolve(response);
        }
        else response.push(result)
      });

    });
  }

  reportsBulkApi(params) {
    return new Promise((resolve: Function, reject: Function) => {
      const url = `${this.path.base}/${this.path.model}/logreport/bulk?projectId=${params.projectId}&locationId=${params.locationId}&startDate=${params.startDate}&endDate=${params.endDate}`;
      //  const url = 'http://35.182.172.115:3000/api/devices/logreport/bulk?projectId=LabTest&locationId=5c003cdf76b07a18dbabf1e2&startDate=20181215&endDate=20181216';
      this.http.get(url)
        .subscribe(response => {
          resolve(response);
        });
    });
  }

  getLogData(data) {
    console.log('initialized');
    const url = this.path.base + '/devices/logreport/';
    const uid = data.uid;
    const startDate = data.startDate;
    const endDate = data.endDate;
    const dataStream = [];

    return new Promise(resolve => {

      const observable = Observable.create(observer => {
        console.log('initializing');
        const eventSource = new EventSource(
          url + uid + '?startDate=' + startDate + '&endDate=' + endDate + '&interval=' + data.interval
        );
        console.log('event');
        console.log(eventSource);
        eventSource.onmessage = x => observer.next(x.data);
        eventSource.onerror = x => observer.error(x);
        eventSource.addEventListener('data', e => {
          console.log('resultado');
          console.log(e);
          if (e['data'] !== '"Done"') {
            dataStream.push(e['data']);
            //console.log(e['data']);
          } else {
            //console.log('Done!');
            resolve(dataStream);
          }
        });
        return () => {
          eventSource.close();
        };
      });

      this.subscription = observable.subscribe({
        next: guid => {
          this.zone.run(() => this.someStrings.push(guid));
        },
        error: err => { }//console.error('something wrong occurred: ' + err)
      });

    });
  }

  async startLogging(data) {
    for (let i = 0; i < data.length; i++) {
      await this.setStartLogging(data[i]);
    }
  }

  setStartLogging(data) {
    const url = this.path.base;
    return this.http.post(`${url}/logintervals/logevent/start/uid/${data.uid}?startTime=${data.start}`, data.start)
      .subscribe(res => res);
  }

  async stopLogging(data) {
    for (let i = 0; i < data.length; i++) {
      await this.setStopLogging(data[i]);
    }
  }

  setStopLogging(data) {
    const url = this.path.base;
    return this.http.post(`${url}/logintervals/logevent/stop/uid/${data.uid}?startTime=${data.start}`, data.start)
      .subscribe(res => res);
  }
}