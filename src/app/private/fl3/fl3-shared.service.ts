
//  Observables
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Enviroment
import { environment } from "../../../environments/environment";

// Event Streaming
import * as EventSource from "eventsource";

import { streamingArrToObj } from "./fl3-graphs/lib/FL3_SEE";

//  Filters

@Injectable()
export class FL3SharedService {

  private fl3ClickedButtons = new BehaviorSubject<string>('');
  private fl3Event = new BehaviorSubject<string>('');
  private fl3Settings = new BehaviorSubject<object>({});
  private fl3OptionsVisibility = new BehaviorSubject<boolean>(false);
  private fl3StreamSensors = new BehaviorSubject<object[]>([]);

  private fl3CollarAnalysisEnable = new BehaviorSubject<boolean>(false);

  public sensorEventSource;

  // -- Paths & URL -- //
  public path = {
    base: `${environment.basepath}`,
    model: "devices",
    streaming :`${environment.basepath}/stream/`
  };


  getFl3Events = this.fl3Event.asObservable();
  getFl3Settings = this.fl3Settings.asObservable();
  getFl3ClickedButton = this.fl3ClickedButtons.asObservable();
  getFl3OptionsVisibility = this.fl3OptionsVisibility.asObservable();
  getFl3StreamSensor = this.fl3StreamSensors.asObservable();


  getFl3CollarAnalysisEnable = this.fl3CollarAnalysisEnable.asObservable();



  setFl3ClickedButton(type: string) {
    this.fl3ClickedButtons.next(type);
  }

  fireFl3Event(fl3Event: any) {
    this.fl3Event.next(fl3Event);
  }

  setFl3Settings(fl3settings: any) {
  	this.fl3Settings.next(fl3settings);
  }

  setVisibility(fl3OptionsVisibility: boolean) {
  	this.fl3OptionsVisibility.next(fl3OptionsVisibility);
  };

  setFl3StreamSensor(fl3sensor: any) {
  	this.fl3StreamSensors.next(fl3sensor);
  }



  setFl3CollarAnalysisEnable(fl3CollarAnalysisEnable: boolean) {
  	this.fl3CollarAnalysisEnable.next(fl3CollarAnalysisEnable);
  };





  streamingBegin(devices_location,model_name){

    const uri_base = this.path.streaming;
    const uri_model = model_name + "?";
    const uri_devices = "uids=" + devices_location["clientCode"] + devices_location["uid"];
    //const uri = uri_base + uri_model  + uri_devices;
    //const uri_devices = "uids=QSO901";
    const uri = uri_base + uri_model  + uri_devices;

    const uri_2579 = uri.replace("3000","2579");


    if(this.sensorEventSource ){
      this.sensorEventSource.close();
      setTimeout( x => {
        this.sensorEventSource = new EventSource(uri_2579);
      },1000)

    }else{
      this.sensorEventSource = new EventSource(uri_2579);
    }



    this.sensorEventSource.onopen = function(){
      //console.warn("Opening Streaming Channel for UIR :: " + uri_2579)
    };
    this.sensorEventSource.onerror = function(){
      //console.error("Error on Streaming Channel for UIR :: " + uri_2579)
    };
    this.sensorEventSource.addEventListener('sensor', x => {

      ////console.log("Getting on Streaming Channel for UIR :: " + uri_2579);
      let sensorObj = streamingArrToObj(JSON.parse(x.data).packet);
      let sensorArr = this.fl3StreamSensors.getValue();
      let sensorArrWithSameUID = sensorArr.filter(function(y){return sensorObj.uid == y["uid"]});
      let sensorIsNew  = sensorArrWithSameUID.length == 0;

      if(sensorIsNew){
        sensorArr.push(sensorObj)
        //console.log("sensor Added");
      }else{
        let  kIndex = sensorArr.findIndex(function(y){return sensorObj.uid == y["uid"]});
        sensorArr[kIndex] = sensorObj;
        //console.log("sensor Updated");
      }

      this.setFl3StreamSensor(sensorArr);
     // //console.log(this.fl3StreamSensors.getValue())
    });

  }

  streamingClose() {
    if (this.sensorEventSource) {
      try {
          this.sensorEventSource.close();
      } catch(e) {
        console.log(e)
      }      
    }

  }
}
