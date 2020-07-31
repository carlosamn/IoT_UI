/*
  ------------------------------------------------

    QSO SERVICE :

    Share controllers/devices data between components
    and pull http request from Loopback API

    -
    -
    -

    +
    +
    +

  ------------------------------------------------
*/









// --------------------------------------------------------- //
// -- Import Angular Resources                             - //
// --------------------------------------------------------- //

  import { Router } from "@angular/router";
  import { Injectable } from "@angular/core";
  import { HttpClient } from "@angular/common/http";
  import { Observable } from "rxjs/Rx";

  import { environment } from "../../../environments/environment";

  import { Subject } from "rxjs/Subject";

  import * as EventSource from 'eventsource';

  import "rxjs/add/operator/map";
  import "rxjs/add/operator/catch";
  import "rxjs/add/observable/throw";
  import "rxjs/add/observable/of";
  import "rxjs/add/observable/interval";
  import "rxjs/add/observable/fromEvent";

// --------------------------------------------------------- //








// --------------------------------------------------------- //
// -- Import App Shared Services                           - //
// --------------------------------------------------------- //

  import { AppSharedService } from "../../app.shared-service";

// --------------------------------------------------------- //








// --------------------------------------------------------- //
// -- Import  Models & Classes                             - //
// --------------------------------------------------------- //
  import { Device } from "./lib/models/Device.class";
  import { streamingArrToObj } from "./lib/scripts/QSO_SEE";
// --------------------------------------------------------- //






// --------------------------------------------------------- //
// -- QSO Service                                          - //
// --------------------------------------------------------- //
@Injectable()
export class QSOService {

    // PATH's for HTTP Request and Streaming Services
      public path = {
        base: `${environment.basepath}`,
        model: "devices",
        streaming :`${environment.basepath}/stream/`
      };

      public devices;

    //Streaming Objects
      public deviceSensorEventSource;

    // Observables and Subjects
      public devicesSubject = new Subject<any>();

    // QSO Constructor
    constructor(
      public http: HttpClient,
      public sharedService: AppSharedService
    ) {


    }





  //--------------------------------------
  //    Observables Methods
  // --------------------------------------

     /**
     *
     * Method : setDevices(data)
     *
     * "Update Angular RXJS Subject."
     *
     * @param   data: Device[]
     * @throws
     * @return  void
     *
     */
    setDevices(data: any) {
        this.devicesSubject.next(data);
        this.devices = data;
    }

    /**
    *
    * Method : getDevices(data)
    *
    * "Return Observable Attached to devicesSubject so you can subscribe it"
    *
    * @param   void
    * @throws
    * @return  deviceSubject as Observable
    *
    */
    getDevices(): Observable<any> {
      return this.devicesSubject.asObservable();
    }




  //--------------------------------------
  //    SEE & Streaming Methods
  // --------------------------------------

    /**
     *
     * Method : openDevicesStreaming()
     *
     * "Open Streaming Channel For Devices"
     *
     * @param   devices_uid List of UID as ['QSO901','QSO902',...]
     * @throws
     * @return  Boolean Status
     *
     */
    openStreaming(devices_uid,model_name){

      const uri_base = this.path.streaming;
      const uri_model = model_name + "?";
      const uri_devices = "uids="  + devices_uid.join();
      //const uri_devices = "uids=QSO15";
      const uri = uri_base + uri_model  + uri_devices;
      const uri_2579 = uri.replace("3000","2579")

      var that = this;

      try{

        this.deviceSensorEventSource = new EventSource(uri_2579);

        var seeOnOpen = (x) => {
          //console.log("QSO SEE Successfully Opened")
        }
        var seeOnError = (x) => {
          //console.log("QSO SEE Error Opened")
        }
        var seeOnSensor = function(x) {

          var objSensor = streamingArrToObj(JSON.parse(x.data).packet);



          if(objSensor.retransmitBit == 0){
            var objDeviceK = that.devices.findIndex(function(element){return "QSO" + element.uid == objSensor.uid});

            that.devices[objDeviceK]["timestamp"] = objSensor.timestamp;

            that.devices[objDeviceK]["sensors"][0]["value"] = objSensor.analogInput1;
            that.devices[objDeviceK]["sensors"][1]["value"] = objSensor.analogInput2;
            that.devices[objDeviceK]["sensors"][2]["value"] = objSensor.analogInput3;
try{
  that.devices[objDeviceK]["sensors"][0]["trend"] = JSON.parse(x.data).trend["1"];
  that.devices[objDeviceK]["sensors"][1]["trend"] = JSON.parse(x.data).trend["2"];
  //that.devices[objDeviceK]["sensors"][2]["trend"] = JSON.parse(x.data).trend["3"];
}catch(e){
}
            that.setDevices(that.devices);
          }
        }

        this.setStreamingOnOpen(seeOnOpen);
        this.setStreamingOnError(seeOnError);
        this.setStreamingOnSensor(seeOnSensor);

       return true;
      }
      catch(e){
        //console.error(e);
        return false;
      }

    }
    /**
     *
     * Method : closeDevicesStreaming()
     *
     * "Close Streaming Channel For Devices"
     *
     * @param   void
     * @throws
     * @author  <jl.mayorga236@gmail.com>
     * @return  Boolean Status
     *
     */
    closeStreaming(){
      try{
        this.deviceSensorEventSource.close();
        return true;
      }
      catch(e){
        //console.log("Error Closing")
        return false;
      }

    }
    /**
     *
     * Method : setStreamingOnOpen
     *
     * "Set On Open Function"
     *
     * @param   deviceSensorEventSource Streaming Object
     * @param   onOpen custom function
     * @throws
     * @author  <jl.mayorga236@gmail.com>
     * @return  void
     *
     */
    setStreamingOnOpen(onOpen){
      this.deviceSensorEventSource.onopen = onOpen;
    }
    /**
     *
     * Method : setStreamingOnError
     *
     * "Set On Error Function"
     *
     * @param   deviceSensorEventSource Streaming Object
     * @param   onError custom function
     * @throws
     * @author  <jl.mayorga236@gmail.com>
     * @return  void
     *
     */
    setStreamingOnError(onError){
      this.deviceSensorEventSource.onError = onError;
    }
    /**
     *
     * Method : setStreamingOnSensor
     *
     * "Set On Open Function"
     *
     * @param   deviceSensorEventSource Streaming Object
     * @param   onSensor custom function for event name 'sensor'
     * @throws
     * @author  <jl.mayorga236@gmail.com>
     * @return  void
     *
     */
    setStreamingOnSensor(onSensor){
      this.deviceSensorEventSource.addEventListener('sensor',onSensor);
      //console.log("setStreamingOnSensor .... ")
    }















  /*
    Life Cycle of Devices Service : Get,Update,Timer,Destroy, etx
  */
  async onDeviceInit(){
    return  new Promise(function(resolve, reject) {

      resolve("Device Inited Suscesfully");

    });
  }






  async onGetDevices(dev){

    var self = this;
    const base = `${this.path.base}/${this.path.model}`;
    const filter = `?filter={}`;

    return  new Promise(async function(resolve, reject) {

      let thisProjectId = localStorage.getItem("project");
      let response =  await self.http.get(base + filter).map((devices: any[]) => {return devices }).toPromise();
      let devicesOnThisProject = response.filter( x => {
        return x.projectId == thisProjectId;
      });
      let devicesOnThisDashboardPage = devicesOnThisProject.filter( x => {
        return x.dashboardPages.includes("qso");
      });
      resolve(devicesOnThisDashboardPage);
    });

  }







  async onGetAnalogSettings(devices){

    //PULL DEVICES IS  DONE
    var self = this;
    const base = `${this.path.base}/ainputs`;
    const filter = ``;

    return new Promise(async function(resolve, reject){
      let response =  await self.http.get(base + filter).map((analogs: any[]) => {
        var out = devices;
        for (var k = 0; k < devices.length; k++) {
          var kAnalogs = [];
          for(var j = 0; j < analogs.length; j++){

           if(analogs[j].uid == devices[k].uid){
             kAnalogs.push(analogs[j])
           }
          }
          out[k]["sensors"] = kAnalogs;
        }
        return out;
      }).toPromise();

      resolve(response)

    });
  }
  async onSetData(data){
    var self = this;
    return new Promise(async function(resolve, reject){
      self.setDevices(data);
      resolve(data);
    });
  }
  async onUpdateData(data){
    var self = this;
    var n = data.length;
    return  new Promise(async function(resolve, reject) {
      let obj = data;
      for(let k = 0; k<n;k++){
        let _data = await self.onUpdateDevice(data[k].uid,data[k].clientCode);

        if(!_data["sensordata"].error){
          ((obj[k].sensors)[0])["value"] = _data["sensordata"]["packetData"]["analogInput1"];
          ((obj[k].sensors)[1])["value"] = _data["sensordata"]["packetData"]["analogInput2"];
          ((obj[k].sensors)[2])["value"] = _data["sensordata"]["packetData"]["analogInput3"];
          ((obj[k])["timestamp"]) = _data["sensordata"]["timeStamp"];
        }

      }
      resolve(obj)
    });
  }
   //
  async onDeviceTimer(Time){
    //WAIT TO TIMER IS DONE
    return  new Promise(function(resolve, reject) {
      setTimeout(() => resolve("Device Timered Done"),Time);
    });
  }
  //
  async onUpdateDevice(uid,code){
    code = "QSO";
    const base =  `http://35.182.172.115:3000/api/devices/sensordata/${code}${uid}/packet/8`;
    const filter = ``;
    const response = await this.http
      .get(base + filter)
      .map(x => x)
      .catch((err) => {return "Error On UpdateDevice :)"})
      .toPromise();
    return response;
  }
  //
  async onUpdateDevices(){
    //PULL DATA IS DONE
    var self = this;
    let n = self.devices.length;
    return  new Promise(async function(resolve, reject) {
      let obj = self.devices;
      for(let k = 0; k<n;k++){
        let _sensordata = await self.onUpdateDevice(self.devices[k].uid,self.devices[k].clientCode);
        obj[k]['sensordata'] = _sensordata;
      }
      resolve(obj)
    });
  }
   //
  async onDeviceDestroy(){
    // DESTROY DATA IS DONE
    return  new Promise(function(resolve, reject) {
      setTimeout(() => resolve("Device Detroyed Done"), 0);
    });
  }








}






/*

  errorHandler(error: any): void {
    return error.error.error;
  }
  getToken() {
    return sessionStorage.getItem("token");
  }
  getDevicesByDashboardPage(dashboard): Observable<any> {
    var _this = this;
    const base = `${this.path.base}/${this.path.model}`;
    const filter = `?filter={}`;
    return this.http.get(base + filter).map((devices: any[]) => {
      let out = [];
      for (let k = 0; k < devices.length; k++) {
        if (devices[k].dashboardPages.includes("qso")) {
          out.push(devices[k]);
        }
      }
      _this._devices = out;

      return out;
    });
  }
  async getDeviceByUID(uid,code?): Promise<object> {
    if(!code){code = "QSO";}
    const base = `http://35.182.172.115:3000/api/devices/sensordata/${code}${uid}/packet/8`;
    //const base = `http://35.182.172.115:3000/api/devices/`;
    const filter = ``;
    const response = await this.http
      .get(base + filter)
      .map(x => x)
      .toPromise();
    return response;
  }
  async getDevices(): Promise<any> {
    let _dev = [];
    try{

   let  n = 0;
    if(this._devices){
     n = this._devices.length;
    }
    for(let k = 0; k < this._devices.length ; k++)
    {
      _dev.push( await this.getDeviceByUID(this._devices[k].uid,this._devices[k].clientCode));
    }
  }catch(e){
    //console.log("error")
  }
    return await _dev;


  }







*/
