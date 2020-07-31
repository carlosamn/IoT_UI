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
import { ChangeDetectorRef, Input, OnChanges } from "@angular/core";
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
import { IAlarmsNotification } from '../../../alarms/lib/models/IAlarmNotification';
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
  selector: "app-notification-icon",
  templateUrl: "./notification-icon.component.html",
  styleUrls: ["./notification-icon.component.css"]
})
// --------------------------------------------------- //




// --------------------------------------------------- //
// -- Component Class -------------------------------- //
// --------------------------------------------------- //
export class NotificationIconComponent implements OnInit {


  @Input()
  notificationAlarms: IAlarmsNotification[];

  // Parameters & Properties
  public UX = {
    HOVER: false
  }

  // ----------------------------------------- //
  // Notification Icon Constructor -------------- //
  // ----------------------------------------- //
  constructor(

  ) {

  }
  // ----------------------------------------- //







  // ----------------------------------------- //
  // -- ngOnInit() --------------------------- //
  // ----------------------------------------- //
  ngOnInit() {


  }

  // ----------------------------------------- //
  // -- ngOnDestroy()------------------------- //
  // ----------------------------------------- //
  ngOnDestroy(): void {

  }
  // ----------------------------------------- //




}
