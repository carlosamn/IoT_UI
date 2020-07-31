/**
 *  COMPONENT : sidebar
 *  DESCRIPTION :
 *
 *
 */






// --------------------------------------------------- //
// --  Imports Angular Resources  -------------------- //
// --------------------------------------------------- //
import { Component, OnInit, NgModule } from "@angular/core";
import {ChangeDetectorRef, Input, OnChanges} from "@angular/core";
import { Router } from "@angular/router";
// --------------------------------------------------- //



// --------------------------------------------------- //
// --  Imports Shared Resources  --------------------- //
// --------------------------------------------------- //
import { AuthenticationService } from "../../../../public/authentication/authentication.service";
import { AppSharedService } from "../../../../app.shared-service";
import { ScriptService } from "../../../../common/services/script-injection.service";
import { DevicesService } from "../../../../private/devices/devices.service";
import { UsersModule } from "../../../users/users.module";
import { AlarmsService } from "../../../alarms/alarms.service";
import { streamingArrToObj } from "../../../fl3/fl3-graphs/lib/FL3_SEE";
// --------------------------------------------------- //





// --------------------------------------------------- //
// -- Lib's Scripts  --------------------------------- //
// --------------------------------------------------- //
declare var jquery: any;
declare var $: any;
// --------------------------------------------------- //





// --------------------------------------------------- //
// -- Component :: Sidebar --------------------------  //
// --------------------------------------------------- //
@Component({
  selector: "app-popup-alarm-info",
  templateUrl: "./popup-alarm-info.component.html",
  styleUrls: ["./popup-alarm-info.component.css"]
})
// --------------------------------------------------- //




// --------------------------------------------------- //
// -- Component Class -------------------------------- //
// --------------------------------------------------- //
export class PopUpAlarmInfoComponent implements OnInit {


  @Input()
  popUpAlarms: any = "";

  @Input()
  hover: boolean = false;

  // Parameters & Properties

  // ----------------------------------------- //
  // Choose Project Constructor -------------- //
  // ----------------------------------------- //
  constructor(

  ) {

  }
    // ----------------------------------------- //







  // ----------------------------------------- //
  // -- ngOnInit() --------------------------- //
  // ----------------------------------------- //
  async ngOnInit() {



  }

  // ----------------------------------------- //
  // -- ngOnDestroy()------------------------- //
  // ----------------------------------------- //
  ngOnDestroy(): void {

  }
  // ----------------------------------------- //


  /**
 * Helper getAlarmsByProjectId()
 * @param device
 * @return lenght of alarms in device
 */
getAlarmInfo(){
  var alarmInfo = this.popUpAlarms.map( x => {
    var obj = {
      keys :  Object.keys(x.sensor),
      values :  Object.values(x.sensor)
    }
    return obj
  });
  return alarmInfo;
}

formatTimeStamp(value){
let strtemp = value.replace("T"," ").replace("Z"," ").split(".");
return strtemp[0];

}

checkAlamarInfoKeyValue(keyname){
  return keyname == "uid" || keyname == "sensorName" || keyname == "alarmMessage" ;
}

pipeAlarmInfoKey(key){
  var out = key;
  switch(key) {
    case "uid": {
       out  = "Device UID "
       break;
    }
    case "sensorName": {
       out = "Sensor Name"
       break;
    }
    case "alarmMessage": {
      out = "Message "
      break;
   }
   case "sensorType": {
    out = "Sensor Type "
    break;
 }
   case "channelId": {
    out = "Channel "
    break;
 }case "packetTime": {
  out = "Time  "
  break;
}
    default: {
       out = key;
       break;
    }
  }
return out;
}

pipeAlarmInfoValue(value){
  var out = value;

  switch(value) {
    case "ainput": {
       out  = "Analog Input "
       break;
    }
    default: {
       out = value;
       break;
    }
  }

return out;
}

}
