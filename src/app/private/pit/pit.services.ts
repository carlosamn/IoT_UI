import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as EventSource from 'eventsource';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { streamingArrToObj, checkRecordStatus, updateSensorRecord, filterQueryUIDs } from '../qso/lib/scripts/QSO_SEE';
import { AppHTTPService } from '../../app.http-service'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import { AppSharedService } from '../../app.shared-service'




@Injectable()
export class PITService {


  public path = {
    base: `${environment.basepath}`,
    model: 'locations',
    streaming: `${environment.basepath}/stream/sensor?`,
    webEvents: `${environment.basepath}/webEvents/change-stream`,
    sensors: `http://35.182.172.115:2579/api/stream/sensor?uids=`
  };

  public STREAM = {
    eventSource: <any>{}
  }

  public STORE = {
    sensors: new BehaviorSubject<any[]>([])
  }



  public webStream = new BehaviorSubject<any>({
    data:{type:" ",class:" "}
  });

  public sensorHeader = new BehaviorSubject<any[]>([]);

  public AnalagInputs = new BehaviorSubject<any>({});


  constructor(public httpServices: AppHTTPService, public appSharedService: AppSharedService) {

  }

  currentWebStream = this.webStream.asObservable();
  currentSensorHeader = this.sensorHeader.asObservable();
  currentAnalagInputs = this.AnalagInputs.asObservable();


  public setCurrenWebStream(data) {
      let pitStream=JSON.parse(data);
      console.log("--------------------------------------------------------")
      console.log(pitStream)
      console.log("--------------------------------------------------------")
      this.webStream.next(pitStream)
    
    /*if(pitStream.data.class=="PIT"){
      console.log("------------------setCurrenWebStream pit settings--------------------")
      this.webStream.next(pitStream.data)
      console.log("--------------------------------------------------------")
    
   
    }else{
      console.log("------------------ALARMS / COMSTATUS--------------------")
      this.webStream.next({par:"alarm/comstatus"})
       console.log("------------------ALARMS / COMSTATUS--------------------")
    }*/
    
  }

  public setCurrentSensorHeader(dataSensors) {
  
    this.sensorHeader.next(dataSensors);
  }

  public setCurrentAnalagInputs(dataAinpunts) {
    this.AnalagInputs.next(dataAinpunts);
  }

  public dataRxjs(value) {
    let param;
    switch (value) {

      case 1:

        this.appSharedService.currentUid.subscribe(paramRxs => {
          param = paramRxs;
        })
        if (!param || param == "" || param == undefined) {
          param = localStorage.getItem("currentUid");
        }
        return param;

      case 2:

        this.appSharedService.currentDescription.subscribe(paramRxs => {
          param = paramRxs;
        })
        if (!param || param == "" || param == undefined) {
          param = localStorage.getItem("description");
        }
        return param;


    }

  }

  public checkNotes(packetTimestamp) {
    let url = `${this.path.base}/pitnotes?filter={"where": {"and": [{"packetTimestamp":"${packetTimestamp}"}]}}`
    return this.httpServices.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { return Observable.throw(e.status) })
  }

  public getSensorHeader(uid) {
    let url = `${this.path.base}/devices/sensordata/uid/${uid}`
    return this.httpServices.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { return Observable.throw(e.status) })
  }

  public testGetSensorData8(uid): Observable<any> {
    let url = `${this.path.base}/devices/getsensordata?uid=${uid}&packetType=8`
    return this.httpServices.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { return Observable.throw(e.status) })
  }

  public testGetSensorData9(uid): Observable<any> {
    let url = `${this.path.base}/devices/getsensordata?uid=${uid}&packetType=9`
    return this.httpServices.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { return Observable.throw(e.status) })
  }

  public mainPIT(uid): Observable<any> {
    let url = `${this.path.base}/pitmains/${uid}`
    return this.httpServices.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { if (e.status == 404) { console.log("model does not exist"); return Observable.throw(e.status) } })
  }


  public getPitEFM(locationId) {
    let url = `${this.path.base}/pitefms/${locationId}`
    return this.httpServices.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { return Observable.throw(e.status) })
  }

  public getPitNotes(projectId, locationId): Observable<any> {
    let url = `${this.path.base}/pitnotes?filter={"where": {"and": [{"projectId":"${projectId}"},{"locationId":{"like":"${locationId}"}}]}}`;
    return this.httpServices.get(url)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { e.json; return Observable.throw(e.status) })
  }

  public getPitLegacyPacket9(uid): Observable<any> {
    let packetType = "9"
    let uri = `${this.path.base}/devices/pitlegacy/${uid}/packet/${packetType}`;
    return this.httpServices.get(uri)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { e.json; return Observable.throw(e.status) })
  }

  public getPitLegacyPacket8(uid): Observable<any> {
    let packetType = "8"
    let uri = `${this.path.base}/devices/pitlegacy/${uid}/packet/${packetType}`;
    return this.httpServices.get(uri)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => { e.json; return Observable.throw(e.status) })
  }

  public getpitSettings(uid): Observable<any> {
    let uri = `${this.path.base}/pitsettings/${uid}`;

    return this.httpServices.get(uri)
      .map((data: Response) => {
        return data
      })

      .catch((e: any) => { e.json; return Observable.throw(e.status) })

  }

  public getpitStatus(uid): Observable<any> {
    let uri = `${this.path.base}/pitstatuses/${uid}`;

    return this.httpServices.get(uri)
      .map((data: Response) => {
        return data
      })

      .catch((e: any) => { e.json; return Observable.throw(e.status) })

  }



  public update(uid, command) {
    let uri = `${this.path.base}/pitsettings/poll/uid/${uid}/page/${command}`;
    return this.httpServices.get(uri)
      .map((data: Response) => {
        console.log("command response");
        console.log(data);
        return data;
      })

      .catch((e: any) => Observable.throw(e))
  }

  public updatePitSettings(uid, data): Observable<any> {
    let url = `${this.path.base}/pitsettings/${uid}`;

    return this.httpServices.patch(url, data)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw((e)));
  }

  public Savetodevice(uid, data) {

    let url = `${this.path.base}/ainputs/savetodevice/${uid}`;
    return new Promise<any>((resolve, reject) => {
      this.httpServices.post(url, data)
        .subscribe(data => {
          resolve(data)
        })
    }
    )
  };

  public postPitSettings(data: any): Observable<any> {
    let url = `${this.path.base}/pitsettings`;

    return this.httpServices.post(url, data)
      .map((data: any) => {
        return data;
      })
      .catch((e: any) => Observable.throw((e)));
  }

  public postPitnotes(data: any): Observable<any> {
    let url = `${this.path.base}/pitnotes`

    return this.httpServices.post(url, data)
      .map((data: any) => {
        return data
      })
      .catch((e: any) => Observable.throw((e)))
  }

  public getAnalogInputs(controller) {
    return this.httpServices.get(`${this.path.base}/ainputs?filter={"where":{"or":[{"uid":"${controller}"}]}}`)
      .map((res: any) => {
        return res;
      })
      .catch((e: any) => Observable.throw(e));
  }



  public streamMain() {
    let DATA
    this.STREAM.eventSource = new EventSource(this.path.webEvents);
    this.STREAM.eventSource.onopen = event => {
    };
    this.STREAM.eventSource.onerror = event => {
    };
    this.STREAM.eventSource.addEventListener("data", event => {
      console.log("STREAMING/WEB EVENTS DATA INCOMING");
      let dataJson = JSON.parse(event.data);
      console.log(dataJson);
      DATA = dataJson.eventData;
    });

  }

  public initSensorStreaming() {
    //let Uri=`http://35.182.172.115:3000/api/webEvents/change-stream`
    let dataJson;
    this.STREAM.eventSource = new EventSource(this.path.webEvents);
    this.STREAM.eventSource.onopen = event => {
    };
    this.STREAM.eventSource.onerror = event => {
    };
    this.STREAM.eventSource.addEventListener("data", event => {

      dataJson = event.data;

      this.setCurrenWebStream(dataJson)

    });


  }

  closeSensorStreaming() {
    this.STREAM.eventSource.close();
  }

  getSensorStore() { return this.STORE.sensors.getValue(); }
  getSensorSync() { return this.STORE.sensors.asObservable(); }

}
