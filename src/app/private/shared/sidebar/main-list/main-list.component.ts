/**
 *  COMPONENT :
 *  DESCRIPTION :
 *
 *
 */






// --------------------------------------------------- //
// --  Imports Angular Resources  -------------------- //
// --------------------------------------------------- //
import { Component, OnInit, NgModule } from "@angular/core";
import { ChangeDetectorRef, Input, Output, OnChanges, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
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
// --------------------------------------------------- //

import { QSONotificationService } from "../../../qso/qso.service.notifications";
import { IComlinkNotification } from '../../../qso/lib/models/IComlinkNotification';
import { IAlarmsNotification } from '../../../alarms/lib/models/IAlarmNotification';


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
  selector: "app-main-list",
  templateUrl: "./main-list.component.html",
  styleUrls: ["./main-list.component.css"]
})
// --------------------------------------------------- //




// --------------------------------------------------- //
// -- Component Class -------------------------------- //
// --------------------------------------------------- //
export class MainListComponent implements OnInit {


  @Input()
  defaultLocationIndex: any;

  @Input()
  project: any;

  @Output()
  onApplyChanges: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onSelectDevices: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onSelectLocations: EventEmitter<any> = new EventEmitter<any>();


  public currentLocations = <any>[];
  public currentProjectId = '';
  public currentAlarms = <IAlarmsNotification[]>[];
  public currentComlinks = <IComlinkNotification[]>[];


  // RXJS Subscriptions
  public SUBS = {
    logo: <any>{},
    alarms: <any>{},
    comlinks: <any>{},
    locations: <any>{},
    location: <any>{},
    user: <any>{},
    project: <any>{}
  };


  // ----------------------------------------- //
  // Main List Component ---------------------- //
  // ----------------------------------------- //
  constructor(
    private sharedService: AppSharedService,
    private devicesService: DevicesService,
    private changeDetectorRef: ChangeDetectorRef,
    private alarmsService: AlarmsService,
    private qsoNotificationService: QSONotificationService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {

  }
  // ----------------------------------------- //







  // ----------------------------------------- //
  // -- ngOnInit() --------------------------- //
  // ----------------------------------------- //
  ngOnInit() {

    this.SUBS.locations = this.sharedService.currentLocationsObj.subscribe(locations => {
      this.currentLocations = Object.values(locations);
      this.changeDetectorRef.detectChanges();
    });

    try{
      this.currentProjectId = JSON.parse(localStorage.getItem('currentLocation'))['projectId'];
    }catch(e){

    }



    this.SUBS.alarms = this.alarmsService.sync().subscribe(alarms => {
      try{
        this.currentProjectId = JSON.parse(localStorage.getItem('currentLocation'))['projectId'];
      }catch(e){

      }
      this.currentAlarms = <IAlarmsNotification[]>alarms.filter(alarm => alarm.project === this.currentProjectId);
    })

    this.SUBS.comlinks = this.qsoNotificationService.syncQSONotifications().subscribe(comlinks => {
      let project = this.sharedService.projectObj.getValue();
      this.currentComlinks = <IComlinkNotification[]>comlinks
        .filter(comlink => comlink.project === project['id'] && comlink.type === 'COMSTATUS');
    });
  }



  // ----------------------------------------- //
  // -- ngOnDestroy()------------------------- //
  // ----------------------------------------- //
  ngOnDestroy(): void {
    try { this.SUBS.locations.unsubscribe(); } catch (e) { }
    try { this.SUBS.location.unsubscribe(); } catch (e) { }
    try { this.SUBS.alarms.unsubscribe(); } catch (e) { }
    try { this.SUBS.comlinks.unsubscribe(); } catch (e) { }
  }
  // ----------------------------------------- //

  /**
   * Helper getAlarmsByProjectId()
   * @param device
   * @return lenght of alarms in device
   */
  getAlarmsByDeviceUID(uid) {

    if (this.currentAlarms.length > 0) {
      return this.currentAlarms.filter(x => {
        return x.uid == uid
      });
    } else {
      return []
    }

  }
  /**
   * Helper getAlarmsByLocation()
   * @param location
   * @return lenght of alarms in location
   */
  getAlarmsByLocationId(item) {
    if (this.currentAlarms.length > 0) {
      return <any[]>this.currentAlarms.filter(x => {
        return (x.location.id == item["locationId"] || x.location.description == item["description"]) && (x.type !== 'COMSTATUS')
      });
    } else {
      return []
    };
  }

  getComlinksByLocationId(item) {
    if (this.currentComlinks.length > 0) {
      return this.currentComlinks.filter(x => {
        return (x.location.id == item["locationId"] || x.location.description == item["location"]) && (x.type === 'COMSTATUS')
      });
    } else {
      return []
    }
  }

  applyChanges() {
    this.onApplyChanges.emit();
  }


  selectDevice(item, index) {
    this.onSelectDevices.emit({
      item: item,
      index: index
    });
  }

  selectLocation(item, index) {
    this.onSelectLocations.emit({
      item: item,
      index: index
    });
    //alert("go to dashvoard");
    this.router.navigate(['../etd_dashboard'], { relativeTo: this.activeRoute });
  }

}
