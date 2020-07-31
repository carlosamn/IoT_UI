
import { Injectable } from '@angular/core';



@Injectable()



export class Helper {

  public currentMode(par) {
    let display;
    switch (par) {
      case 1:
        display = "ON"
        break;
      case 2:
        display = "OFF"
        break;
      case 3:
        display = "Afterflow"
        break;
      case 4:
        display = "Recovery"
        break;
      case 5:
        display = "Pause"
        break;
      case 6:
        display = "Menu 9"
        break;
      case 7:
        display = "Murphy Shutdown"
        break;
      case 8:
        display = "HardHit Shutdown"
        break;
      case 9:
        display = "High Tubing Shutdown"
        break;
      case 10:
        display = "Stabilized Pressure Time"
        break;
      case 11:
        display = "High Flow Line Shutdown"
        break;
      case 12:
        display = "AFT:High E3M3"
        break;
    }
    return display;
  }

  public update(time, clientCode, uid, dataapi,OrunTime) {
    let r;
    OrunTime='0'+OrunTime
    let OrunTimeReplace=OrunTime.replace(/[:]/g,'')

   let  stablePressureTime= this.transforTosecondStabilizedPresure(time.stablePressureTime)
   let  optimumruntime=this.transforTosecondOrunTime(OrunTimeReplace);

    let seconds = this.transformTosencods([time.onTime, time.stablePressureTime, time.recTime2,
    time.maxAfterFlow, time.minAfTime, time.maxOffTime, time.minOffTime,
    time.fastTimeAdjAft, time.slowTime, time.fastTime, time.earlyArrivalTime, time.recTime, time.afTime
      , time.offTime, time.fastTimeAdjOff, time.slowTimeAdjAft, time.slowTimeAdjOff]);


    let data = {
      clientCode: clientCode, packetType: 19, saveToDevice: true, uid: uid, onTime: seconds[0],
      stablePressureTime: stablePressureTime, recTime2: seconds[2], maxAfterFlow: seconds[3],
      minAfTime: seconds[4], maxOffTime: seconds[5], minOffTime: seconds[6], fastTimeAdjAft: seconds[7],
      slowTime: seconds[8], fastTime: seconds[9], earlyArrivalTime: seconds[10], recTime: seconds[11], afTime: seconds[12],
      offTime: seconds[13], fastTimeAdjOff: seconds[14]
      , slowTimeAdjAft: seconds[15], slowTimeAdjOff: seconds[16],
      earlyArrivalCounter: dataapi.earlyArrivalCounter, pressureUnit: dataapi.pressureUnit,
      noOfConsecutiveNoArrivals: dataapi.noOfConsecutiveNoArrivals, e3m3Point: dataapi.e3m3Point,
      tubingType: dataapi.tubingType, afTimeAdjRatio: dataapi.afTimeAdjRatio,
      enablePressureOnSettings: dataapi.enablePressureOnSettings, wellDepth: dataapi.wellDepth,
      posDiffPressure: dataapi.posDiffPressure, isSolenoid2On: dataapi.isSolenoid2On,
      isSolenoid2Af: dataapi.isSolenoid2Af, isSolenoid2Off: dataapi.isSolenoid2Off, enableOptimizationMode: dataapi.enableOptimizationMode,
      enableRecModeSettings: dataapi.enableRecModeSettings, enableAfTimeSettings: dataapi.enableAfTimeSettings, enableFlowOptMode: dataapi.enableFlowOptMode
      , enablestablePressMode: dataapi.enablestablePressMode, posMode: dataapi.posMode, optimumRunTime: optimumruntime
    }


    return data;
  }



  public getPitSettings(dataApi, enableOptimizationMode, enableRecModeSettings, enableAfTimeSettings,
    enableFlowOptMode, enablePressureOnSettings, enablestablePressMode) {

    let data={};

    data["isSolenoid2On"] = dataApi.isSolenoid2On;
    data["isSolenoid2Af"] = dataApi.isSolenoid2Af;
    data["isSolenoid2Off"] = dataApi.isSolenoid2Off;
    data["enablePressureOnSettings"] = dataApi.enablePressureOnSettings;
    data["tubingType"] = dataApi.tubingType;
    data["afTimeAdjRatio"] = dataApi.afTimeAdjRatio;
    data["enableOptimizationMode"] = dataApi.enableOptimizationMode;
    data["enableRecModeSettings"] = dataApi.enableRecModeSettings;
    data["enableAfTimeSettings"] = dataApi.enableAfTimeSettings;
    data["enableFlowOptMode"] = dataApi.enableFlowOptMode;
    data["enablestablePressMode"] = dataApi.enablestablePressMode;
    data["posDiffPressure"] = dataApi.posDiffPressure;
    data["enablePressureOnSettings"] = dataApi.enablePressureOnSettings;
    data["enablestablePressMode"] = dataApi.enablestablePressMode;
    data["wellDepth"] = dataApi.wellDepth;
    data["earlyArrivalCounter"] = dataApi.earlyArrivalCounter;
    data["pressureUnit"] = dataApi.pressureUnit;
    data["noOfConsecutiveNoArrivals"] = dataApi.noOfConsecutiveNoArrivals;
    data["e3m3Point"] = dataApi.e3m3Point;
    data["posMode"] = dataApi.posMode;

    this.welldepth(data["wellDepth"]);

    if (data["enableOptimizationMode"] == false) { enableOptimizationMode.active = "Disabled"; enableOptimizationMode.disable = true; enableOptimizationMode.value = false } else { enableOptimizationMode.active = "Enabled"; enableOptimizationMode.disable = false; enableOptimizationMode.value = true }
    enableOptimizationMode.bool = dataApi.enableOptimizationMode;


    if (data["enableRecModeSettings"] == false) { enableRecModeSettings.active = "Disabled"; enableRecModeSettings.value = false; enableRecModeSettings.disable = true; } else { enableRecModeSettings.active = "Enabled"; enableRecModeSettings.value = true; enableRecModeSettings.disable = false; }
    enableRecModeSettings.bool = dataApi.enableRecModeSettings;

    if (data["enableAfTimeSettings"] == false) { enableAfTimeSettings.active = "Disabled"; enableAfTimeSettings.value = false; enableAfTimeSettings.disable = true } else { enableAfTimeSettings.active = "Enabled"; enableAfTimeSettings.value = true; enableAfTimeSettings.disable = false; }
    enableAfTimeSettings.bool = dataApi.enableAfTimeSettings;

    //crear en el modelo backend una variable para este parametro
    //this.FlowLine={active:"Enabled", value:false, bool:data.stablePressureMode.toString()};
    //if(data.stablePressureMode.toString()=="0"){this.FlowLine.active="Disable"}else{this.FlowLine.active="Disable"}

    if (data["enableFlowOptMode"] == false) { enableFlowOptMode.active = "Disabled"; enableFlowOptMode.value = false; enableFlowOptMode.disable = true } else { ; enableFlowOptMode.value = true; enableFlowOptMode.active = "Enabled"; enableFlowOptMode.disable = false; }
    enableFlowOptMode.bool = dataApi.enableFlowOptMode;

    if (data["enablePressureOnSettings"] == false) { enablePressureOnSettings.active = "Disabled"; enablePressureOnSettings.value = false; enablePressureOnSettings.disable = true } else { enablePressureOnSettings.active = "Enabled"; enablePressureOnSettings.value = true; enablePressureOnSettings.disable = false; }
    enablePressureOnSettings.bool = dataApi.enablePressureOnSettings;

    if (data["enablestablePressMode"] == false) { enablestablePressMode.active = "Disabled"; enablestablePressMode.value = false; enablestablePressMode.disable = true } else { enablestablePressMode.active = "Enabled"; enablestablePressMode.value = true; enablestablePressMode.disable = false; }
    enablestablePressMode.bool = dataApi.isPOSEnable;


    console.group();
    console.error(' DEBUGGER : PIT / HELPERT.TS getPitSettings()');
    console.error('data');
    console.error(data);
    console.error('dataApi');
    console.error(dataApi);
    console.groupEnd();

    return data;
  }

  public getPitSettingsTime(dataApi, time) {

    for (var property in time) {
      if(property=="stablePressureTime"){

      dataApi[property] = this.transformStabilizedPresure(dataApi[property]);

      }
      else{
      dataApi[property] = this.transform(dataApi[property]);
      }
    }

    return dataApi;



  }
/*
  public dataSettings(data, dataSettings) {
    this.welldepth(data.wellDepth);

    dataSettings.isSolenoid2On = data.isSolenoid2On.toString();
    dataSettings.isSolenoid2Af = data.isSolenoid2Af.toString();
    dataSettings.isSolenoid2Off = data.isSolenoid2Off.toString();
    dataSettings.enablePressureOnSettings = data.enablePressureOnSettings.toString();
    dataSettings.tubingType = data.tubingType.toString();
    // this.dataSettings.valveType=data.valveType.toString();
    dataSettings.afTimeAdjRatio = data.afTimeAdjRatio.toString();
    dataSettings.wellDepth = data.wellDepth;
    dataSettings.earlyArrivalCounter = data.earlyArrivalCounter;
    dataSettings.pressureUnit = data.pressureUnit;
    dataSettings.noOfConsecutiveNoArrivals = data.noOfConsecutiveNoArrivals;
    dataSettings.setPointE3M3 = data.setPointE3M3;
    dataSettings.onTime = this.transform(data.onTime);
    dataSettings.offTime = this.transform(data.offTime);
    dataSettings.afTime = this.transform(data.afTime);
    dataSettings.recTime = this.transform(data.recTime);
    dataSettings.earlyArrivalTime = this.transform(data.earlyArrivalTime);
    dataSettings.fastTime = this.transform(data.fastTime);
    dataSettings.slowTime = this.transform(data.slowTime);
    dataSettings.fastTimeAdjAft = this.transform(data.fastTimeAdjAft);
    dataSettings.slowTimeAdjAft = this.transform(data.slowTimeAdjAft);
    dataSettings.fastTimeAdjOff = this.transform(data.fastTimeAdjOff);
    dataSettings.slowTimeAdjOff = this.transform(data.slowTimeAdjOff);
    dataSettings.minOffTime = this.transform(data.minOffTime);
    dataSettings.maxOffTime = this.transform(data.maxOffTime);
    dataSettings.maxAfterFlow = this.transform(data.maxAfterFlow);
    dataSettings.minAfTime = this.transform(data.minAfTime);
    dataSettings.recTime2 = this.transform(data.recTime2);
    dataSettings.stablePressureTime = this.transform(data.stablePressureTime);
    //fake values for those 2 parm, just for test controller
    dataSettings.optimumRunTime = this.transform(data.stablePressureTime);
    dataSettings.posMode = 1;


  }
*/
  public dataStatus(data, dataStatus) {
    this.welldepth(data.wellDepth);


    dataStatus.plungerCycles = data.plungerCycles;
    dataStatus.plungerCounts = data.plungerCounts;
    dataStatus.noArrivalCntr = data.noArrivalCntr;
    dataStatus.dailyProduction = data.dailyProduction;
    dataStatus.batteryVoltage = data.batteryVoltage;
    dataStatus.signalStrength = data.signalStrength;
    dataStatus.isSolenoid2On = data.isSolenoid2On;
    dataStatus.isSolenoid2InAF = data.isSolenoid2InAF;
    dataStatus.isSolenoid2InOff = data.isSolenoid2InOff;
    dataStatus.isPOSEnable = data.isPOSEnable;
    dataStatus.tubingType = data.tubingType;
    dataStatus.valveType = data.valveType;
    dataStatus.afTimeAdjRatio = data.afTimeAdjRatio;
    dataStatus.posMode = data.posMode;
    dataStatus.posDiffPt = data.posDiffPt;
    dataStatus.wellDepth = data.wellDepth;
    dataStatus.earlyArrivalCntr = data.earlyArrivalCntr;
    dataStatus.numOfConsecutiveNoArrivals = data.numOfConsecutiveNoArrivals;
    dataStatus.setPointE3M3 = data.setPointE3M3;
    dataStatus.runTimeArray = data.runTimeArray;
    dataStatus.fastTime = this.transform(data.fastTime);
    dataStatus.slowTime = this.transform(data.slowTime);
    dataStatus.fastTimeAdjAddAFT = this.transform(data.fastTimeAdjAddAFT);
    dataStatus.fastTimeAdjMinusOFF = this.transform(data.fastTimeAdjMinusOFF);
    dataStatus.slowTimeAdjMinusAFT = this.transform(data.slowTimeAdjMinusAFT);
    dataStatus.slowTimeAdjAddOFF = this.transform(data.slowTimeAdjAddOFF);
    dataStatus.minimumOffTime = this.transform(data.minimumOffTime);
    dataStatus.maximumOffTime = this.transform(data.maximumOffTime);
    dataStatus.maximumAfterflow = this.transform(data.maximumAfterflow);
    dataStatus.minimumAfterflow = this.transform(data.minimumAfterflow);
    dataStatus.recTimeNum2 = this.transform(data.recTimeNum2);
    dataStatus.stablizedPressureTime = this.transformStabilizedPresure(data.stablizedPressureTime);
    //this.dataSettings=data;
  }


  public welldepth(value) {
    let result = value / 5;
    let seconds = Math.round(result);
    let secondS;
    let sencodStr: any;
    let minutesS;
    let minutesStr: any;
    let hoursS;
    let hoursStr: any;
    let hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
    let minutes = Math.floor(seconds / (60));
    seconds -= minutes * (60);
    if (seconds < 10) {
      secondS = seconds.toString();
      sencodStr = "0" + secondS;
    } else sencodStr = seconds
    if (minutes < 10) {
      minutesS = minutes.toString();
      minutesStr = "0" + minutesS;
    } else minutesStr = minutes;
    if (hours < 10) {
      hoursS = hours.toString();
      hoursStr = "0" + hoursS;
    } else hoursStr = hours;
    let optimunRunTime = hoursStr + ":" + minutesStr + ":" + sencodStr;
    return optimunRunTime;
  }


  times = [
    3600,
    60,
    1
  ]

  times2 = [
    
    60,
    1
  ]

  transformTosencods([ontime, stabilizedPressureTime, recoveryTime2, maximumOverflow, minimumOverflow
    , maximumOffTime, minumumOffTime, fastTimeAdjust, slowTime, fastTime,
    earlytime, recoverytime, afterflowtime, offtime, off, aft, off2]) {

    let array = [ontime, stabilizedPressureTime, recoveryTime2, maximumOverflow, minimumOverflow
      , maximumOffTime, minumumOffTime, fastTimeAdjust, slowTime, fastTime,
      earlytime, recoverytime, afterflowtime, offtime, off, aft, off2]
    let TotalSencodss = []

    for (let i in array) {
      let horasToseconds = array[i].substring(0, 3);
      let minutesToSeconds = array[i].substring(3, 5);
      let seconds = array[i].substring(5, 7);
      let TotalhorasToseconds = parseInt(horasToseconds) * 3600;
      let TotalminutesToSeconds = parseInt(minutesToSeconds) * 60;
      let TotalSencods = TotalhorasToseconds + TotalminutesToSeconds + parseInt(seconds);
      TotalSencodss.push(TotalSencods);


    }


    return TotalSencodss;
  }

  transforTosecondStabilizedPresure(value){
      let minutesToSeconds = value.substring(0, 2);
      let seconds = value.substring(2, 4);
      let TotalminutesToSeconds = parseInt(minutesToSeconds) * 60;
      let TotalSencods = TotalminutesToSeconds + parseInt(seconds);
      return  TotalSencods;
  }

  transforTosecondOrunTime(value){
      let horasToseconds = value.substring(0, 3);
      let minutesToSeconds = value.substring(3, 5);
      let seconds = value.substring(5, 7);
      let TotalhorasToseconds = parseInt(horasToseconds) * 3600;
      let TotalminutesToSeconds = parseInt(minutesToSeconds) * 60;
      let TotalSencods = TotalhorasToseconds + TotalminutesToSeconds + parseInt(seconds);

      return TotalSencods
}


  transform(seconds) {
    let time_string: string = '';
    let flag = false;

    for (var key in this.times) {
      //let intValue=parseInt(key);
      if ((Math.floor(seconds / this.times[key])) > 0) {


        if (this.times[key] == 1 || this.times[key] == 60) {
          let value: any;
          value = Math.floor(seconds / this.times[key])
          if (value < 10) {
            value = '0' + Math.floor(seconds / this.times[key]).toString()
          } else {
            value = Math.floor(seconds / this.times[key]).toString()
          }
          time_string += value;


        }
        else {

          let value;
          value = Math.floor(seconds / this.times[key])

          if (value < 10) {

            value = '00' + Math.floor(seconds / this.times[key]).toString()
          }

          else if (value > 9 && value < 100) {
            value = '0' + Math.floor(seconds / this.times[key]).toString()
          }

          else {
            value = Math.floor(seconds / this.times[key]).toString()
          }

          time_string += value;
        }

        seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);
      }
      else {
        let value;
        if (this.times[key] == 3600) {
          value = '000';
        } else {
          value = '00';
        }

        time_string += value;

      }

    }
    return time_string;
  }


  transformStabilizedPresure(seconds) {
    let time_string: string = '';
    let flag = false;

    for (var key in this.times2) {
      //let intValue=parseInt(key);
      if ((Math.floor(seconds / this.times2[key])) > 0) {


        
          let value: any;
          value = Math.floor(seconds / this.times2[key])
          if (value < 10) {
            value = '0' + Math.floor(seconds / this.times2[key]).toString()
          } else {
            value = Math.floor(seconds / this.times2[key]).toString()
          }
          time_string += value;


        

        seconds = seconds - this.times2[key] * Math.floor(seconds / this.times2[key]);
      }
      else {
        
         let value = '00';
        

        time_string += value;

      }

    }
    return time_string;
  }


  public getTime() {

    let currentTime = new Date();
    let CurrentMonth = currentTime.getMonth() + 1;
    let CurrentDay = currentTime.getDay() + 1;
    let CurrentHour = currentTime.getHours();
    let CurrentMinuntes = currentTime.getMinutes();
    let CurrentSeconds = currentTime.getSeconds();

    let LocaleTime = new Date().toLocaleString()

    let timeStamp = `${LocaleTime}`

    return timeStamp;
  }


}

