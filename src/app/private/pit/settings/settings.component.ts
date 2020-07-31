import { Component, OnInit } from '@angular/core';
import { Helper } from '../helper/helper';
import { PITService } from '../pit.services'
import { DevicesService } from '../../devices/devices.service'
import * as  EventSource from 'eventsource';
import { AppSharedService } from '../../../app.shared-service'
import { AinputsService } from '../../ainputs/ainputs.service';
import { Observable } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public enableOptimizationMode = { active: "Enabled", value: false, bool: "", disable: true };
  public enableRecModeSettings = { active: "Enabled", value: false, bool: "", disable: true };
  public enableAfTimeSettings = { active: "Enabled", value: false, bool: "", disable: true };
  public FlowLine = { active: "Enabled", value: false, bool: "", disable: true };
  public enableFlowOptMode = { active: "Enabled", value: false, bool: "", disable: true };
  public enablePressureOnSettings = { active: "Enabled", value: false, bool: "", disable: true };
  public enablestablePressMode = { active: "Enabled", value: false, bool: "", disable: true };

  public uid;
  public wellDepth: number = 0;
  public optimunRunTime;
  public data;
  public dummyData = 2;
  public isUpdate = true;
  public clientCode;
  public AnalogInputs;
  public time;
  public displaymodal = "none"
  public OptimumRunTimeSeconds;
  public RxjsStreamPitSettings;

  public IO = [this.enableOptimizationMode, this.enableRecModeSettings, this.enableAfTimeSettings,
  this.enableFlowOptMode, this.enablePressureOnSettings, this.enablestablePressMode]

  public STREAM = {

    eventSource: <any>{}

  }



  constructor(public helper: Helper, public pitservice: PITService, public DevicesService: DevicesService, private appSharedService: AppSharedService, private AinputsService: AinputsService) {

    this.data = {
      isSolenoid2On: 1, isSolenoid2Af: 1, isSolenoid2Off: 1, tubingType: 2, afTimeAdjRatio: 1,
      earlyArrivalCounter: 0, pressureUnit: 0, noOfConsecutiveNoArrivals: 0, e3m3Point: 0, wellDepth: 0
    };

    this.time = {
      onTime: "0000000", stablePressureTime: "0000000", recTime2: "0000000", maxAfterFlow: "0000000", minAfTime: "0000000"
      , maxOffTime: "0000000", minOffTime: "0000000", fastTimeAdjAft: "0000000", slowTime: "0000000", fastTime: "0000000",
      earlyArrivalTime: "0000000", recTime: "0000000", afTime: "0000000", offTime: "0000000", fastTimeAdjOff: "0000000", slowTimeAdjAft: "0000000", slowTimeAdjOff: "0000000"
    }
  }

  

  async  ngOnInit() {

    let uid;
    let currentLocation;

    uid = this.pitservice.dataRxjs(1);
    this.uid = uid;
    console.log("uidReactive")
    console.log(uid)

    currentLocation = localStorage.getItem("currentLocation");
    let uidJson = JSON.parse(currentLocation);
    this.clientCode = uidJson.clientCode

    if (uid == undefined) {
      uid = uidJson.uid;
      this.uid = uid;
      console.log("uidLocalStorage")
      console.log(uid)
    }

    await this.pitSettings(uid);


    let ainputEnabled = await this.analogInputs(uid);
    let dataJson;
    let flag=true;
    this.RxjsStreamPitSettings=this.pitservice.currentWebStream.subscribe(data => {
      
      console.log("PIT SETTINGS WEB STREAM");
      
      if(data.data.class=="PIT" && data.data.type=="SETTINGS"){
        
        console.log("live stream on setings")
        console.log(data.data.eventData)

        let datSetting = data.data.eventData;
        console.log("currentWebStream subscribed on pitsettings")
        console.log("live stream on settings")
        console.log(datSetting)

        let test = this.helper.getPitSettings(
          datSetting,
          this.enableOptimizationMode,
          this.enableRecModeSettings,
          this.enableAfTimeSettings,
          this.enableFlowOptMode,
          this.enablePressureOnSettings,
          this.enablestablePressMode);

        this.data = test;
        let testTimers = this.helper.getPitSettingsTime(datSetting, this.time)
        this.welldepth(datSetting.wellDepth);
        this.time = testTimers;
        
      
        }

    });
  }

  PressureUnit(value){
    if(value> 2 ){
      this.data.pressureUnit=2;
    }else if(value == 0){
      this.data.pressureUnit=1;
    }else
      this.data.pressureUnit=value;
  }

  noOfConsecutiveNoArrivals(value){
    if(value > 250 ){
      this.data.noOfConsecutiveNoArrivals=250;
    }
    else if(value == 0){
      this.data.noOfConsecutiveNoArrivals=1;
    }
    else
    this.data.noOfConsecutiveNoArrivals=value;
  }


  ngOnDestroy() {
    //this.pitservice.closeSensorStreaming();
    //this.STREAM.eventSource.close();
    this.RxjsStreamPitSettings.unsubscribe();

  }


  public analogInputs(uid) {
    this.DevicesService.getAnalogInputs(uid)
      .subscribe(data => {
        this.AnalogInputs = data;
      })
  }

  public async  pitSettings(uid) {

    await this.pitservice.getpitSettings(uid)
      .subscribe(data => {
        console.log("data")
        console.log(data)

        let test = this.helper.getPitSettings(
          data, 
          this.enableOptimizationMode,
          this.enableRecModeSettings, 
          this.enableAfTimeSettings, 
          this.enableFlowOptMode, 
          this.enablePressureOnSettings, 
          this.enablestablePressMode)

        this.data = test;

        let testTimers = this.helper.getPitSettingsTime(data, this.time)
        this.time = testTimers;

        this.welldepth(data.wellDepth);
      }

        ,
        error => {
          console.log("error");
          console.log(error);


          if (error == 404) {
            this.isUpdate = false;
          }
        }

      )

  }

  public welldepth(value) {

    let optimization = this.helper.welldepth(value);
    this.optimunRunTime = optimization;
  }



  public disable(value, name) {
    let active;
    let bool;
    let disable;
    if (value == false) {
      value = true;
      active = "Enabled";
      bool = "1";
      disable = false;

    }
    else {
      active = "Disabled"; value = false; bool = "0"; disable = true;
    }

    if (name == "enableOptimizationMode") {
      this.enableOptimizationMode = { active: active, value: value, bool: bool, disable: disable }
      this.data.enableOptimizationMode = bool;
    }
    else if (name == "enableRecModeSettings") {
      this.enableRecModeSettings = { active: active, value: value, bool: bool, disable: disable }
      this.data.enableRecModeSettings = bool;
    }
    else if (name == "FlowLine") {
      this.FlowLine = { active: active, value: value, bool: bool, disable: disable }
    }
    else if (name == "enableFlowOptMode") {
      this.enableFlowOptMode = { active: active, value: value, bool: bool, disable: disable }
      this.data.enableFlowOptMode = bool;
    }
    else if (name == "enablePressureOnSettings") {
      this.enablePressureOnSettings = { active: active, value: value, bool: bool, disable: disable }
      this.data.enablePressureOnSettings = bool;
    }
    else if (name == "enableAfTimeSettings") {
      this.enableAfTimeSettings = { active: active, value: value, bool: bool, disable: disable }
      this.data.enableAfTimeSettings = bool;
    }
    else {
      this.enablestablePressMode = { active: active, value: value, bool: bool, disable: disable }
      this.data.enablestablePressMode = bool;
    }
  }








  /**
   * -----------------------------------
   * -- SAVE SETTINGS INPUT METHOD
   * -----------------------------------
   */
  public update() {
    let data = this.helper.update(this.time, this.clientCode, this.uid, this.data,this.optimunRunTime)
    if (this.isUpdate) {

      $('#sendSetup').modal('show');
      
      this.pitservice.updatePitSettings(this.uid, data)
        .subscribe(data => {
          if (data.ack.uid == undefined) {
            $('#deviceBusy').modal('show');
            setTimeout(() => { $('#deviceBusy').modal('hide'); }, 30000)
          }
          $('#sendSetup').modal('hide')
        }, error => {
          if (error.status == 0) {
            console.log("error here");
            console.log(error);
            $('#sendSetup').modal('hide');
            $('#FailedCom').modal('show');
            setTimeout(() => { $('#FailedCom').modal('hide'); }, 30000)
          }
        });

    } else {
      $('#sendSetup').modal('show');
      this.pitservice.postPitSettings(data)
        .subscribe(data => {
          $('#sendSetup').modal('hide')
        }, error => {
          console.log("error here");
          console.log(error);
          this.displaymodal = "block";
          $('#sendSetup').modal('hide')
        });
    }
  }


  public closeModal() {
    this.displaymodal = "none";
  }
  public saveAlarm() {
   
    $('#sendSetup').modal('show');
    this.AinputsService.ainputsBulkUpdate(this.uid, this.AnalogInputs)
      .subscribe(
        data => $('#sendSetup').modal('hide'),
        err => {
          $('#sendSetup').modal('hide');
          $('#deviceBusy').modal('show');
          setTimeout(() => {
            $('#deviceBusy').modal('hide');
          }, 30000);
          console.error('HTTP Error' + JSON.stringify(err))
        },
        () => console.log('HTTP request completed.')
      );
  }

  public showStPresureTime(value){
    if (value.length == 0) {
      value = "0"
    }
    let lastValue;
    let newvalue = value.split("");

    for (let i = 0; i < newvalue.length; i++) {
      if (newvalue.length < 5) {
        newvalue.push('0');
      }
    }

    for (let i = 0; i < newvalue.length; i++) {
      let index = parseInt(newvalue[i], 10);
      if ((i == 2 || i == 0) && index > 5) {

        newvalue.splice(i, 1, "5");
      }
      lastValue = newvalue;

      this.time.stablePressureTime=lastValue;
    }
  }

  public show(event, name) {
    if (event.length == 0) {
      event = "0"
    }
    let lastValue;
    let newvalue = event.split("");
    for (let i = 0; i < newvalue.length; i++) {
      if (newvalue.length < 7) {
        newvalue.push('0');
      }
      
    }
    for (let i = 0; i < newvalue.length; i++) {
      let index = parseInt(newvalue[i], 10);
      if ((i == 3 || i == 5) && index > 5) {

        newvalue.splice(i, 1, "5");
      }
      lastValue = newvalue;
      if (name == "onTime") {
        this.time.onTime = lastValue;
      }
      else if (name == "stablePressureTime") {
        this.time.stablePressureTime = lastValue;
      }
      else if (name == "recTime2") {
        this.time.recTime2 = lastValue;
      }
      else if (name == "maxAfterFlow") {
        this.time.maxAfterFlow = lastValue;
      }
      else if (name == "minAfTime") {
        this.time.minAfTime = lastValue;
      }
      else if (name == "maxOffTime") {
        this.time.maxOffTime = lastValue;
      }
      else if (name == "fastTimeAdjAft") {
        this.time.fastTimeAdjAft = lastValue;
      }
      else if (name == "slowTime") {
        this.time.slowTime = lastValue;
      }
      else if (name == "fastTime") {
        this.time.fastTime = lastValue;
      }
      else if (name == "earlyArrivalTime") {
        this.time.earlyArrivalTime = lastValue;
      }
      else if (name == "recTime") {
        this.time.recTime = lastValue;
      }
      else if (name == "afTime") {
        this.time.afTime = lastValue;
      }
      else if (name == "offTime") {
        this.time.offTime = lastValue;
      }
      else if (name == "fastTimeAdjOff") {
        this.time.fastTimeAdjOff = lastValue;
      }
      else if (name == "slowTimeAdjAft") {
        this.time.slowTimeAdjAft = lastValue;
      }
      else if (name == "minOffTime") {
        this.time.minOffTime = lastValue;
      }
      else {
        this.time.slowTimeAdjOff = lastValue;
      }
    }
  }
}
