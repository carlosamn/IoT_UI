/**
 *  COMPONENT : sidebar
 *  DESCRIPTION :
 *
 *
 */

// --------------------------------------------------- //
// --  Imports Angular Resources  -------------------- //
// --------------------------------------------------- //
import { Component, OnInit, NgModule, Input } from "@angular/core";
import { ChangeDetectorRef, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
// --------------------------------------------------- //

// --------------------------------------------------- //
// --  Imports Shared Resources  --------------------- //
// --------------------------------------------------- //
import { AuthenticationService } from "../../../public/authentication/authentication.service";
import { AppSharedService } from "../../../app.shared-service";
import { ScriptService } from "../../../common/services/script-injection.service";
import { DevicesService } from "../../../private/devices/devices.service";
import { UsersModule } from "../../users/users.module";
import { AlarmsService } from "../../alarms/alarms.service";
import { LocationsService } from "../../locations/locations.service";
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
  selector: "app-private-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
// --------------------------------------------------- //

// --------------------------------------------------- //
// -- Component Class -------------------------------- //
// --------------------------------------------------- //
export class SidebarComponent implements OnInit {
  // Parameters & Properties
  public logo;
  public devices;
  public locations;
  public selectedDevice;
  public selectedLocation;
  public defaultDeviceIndex;
  public defaultLocationIndex;
  public user = <any>{};
  public currentProject;
  public userId;
  public profile;
  public project;
  public alarms;
  public Description;
  public uid;



  // RXJS Subscriptions
  public SUBS = {
    logo: <any>{},
    alarms: <any>{},
    locations: <any>{},
    user: <any>{},
    project: <any>{}
  };

  // ----------------------------------------- //
  // Choose Project Constructor -------------- //
  // ----------------------------------------- //
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private scripts: ScriptService,
    private sharedService: AppSharedService,
    private devicesService: DevicesService,
    private alarmsService: AlarmsService,
    private locationsService: LocationsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.devices = [];
    this.defaultDeviceIndex = localStorage.getItem("defaultDeviceIndex") || 0;
    this.currentProject = localStorage.getItem("project");
    this.Description;
    this.uid;

  }
  // ----------------------------------------- //

  // ----------------------------------------- //
  // -- ngOnInit() --------------------------- //
  // ----------------------------------------- //
  async ngOnInit() {


    let locationsFromLocalStorage = [];
    let locationFromLocalStorage = {};
    let indexFromLocalStorage = 0;
    this.sharedService.currentDescription.subscribe(description => { this.Description = description });
    this.sharedService.currentUid.subscribe(uid => { this.uid = uid });

    try {
      locationsFromLocalStorage = JSON.parse(localStorage.getItem("currentLocations"))
    } catch (e) {

    }


    try {
      locationFromLocalStorage = JSON.parse(localStorage.getItem("currentLocation"))
    } catch (e) {

    }

    try {
      indexFromLocalStorage = parseInt(localStorage.getItem("currentLocationIndex"));
    } catch (e) {

    }

    this.defaultLocationIndex = indexFromLocalStorage;


    this.userId = sessionStorage.getItem("userId");

    this.SUBS.logo = this.sharedService.currentLogo.subscribe(logo => {
      this.logo = logo;

      this.SUBS.user = this.sharedService.currentUserObject.subscribe(user => {
        this.user = user;

        this.SUBS.locations = this.sharedService.currentLocationsObj.subscribe(locations => {
          this.locations = locations;

          this.SUBS.alarms = this.alarmsService.sync().subscribe(alarms => {
            let project = this.sharedService.projectObj.getValue();
            this.alarms = alarms;
          });

        });

      });

    });

  }

  // ----------------------------------------- //
  // -- ngOnDestroy()------------------------- //
  // ----------------------------------------- //
  ngOnDestroy(): void {
    try { this.SUBS.logo.unsubscribe() } catch (e) { }
    try { this.SUBS.user.unsubscribe() } catch (e) { }
    try { this.SUBS.alarms.unsubscribe(); } catch (e) { }
  }
  // ----------------------------------------- //

  /**
   * Helper getAlarmByProjectId()
   * @param project
   * @return lenght of alarms in project
   */
  getAlarmsByProjectId(project) {
    return this.alarms.filter(x => {
      return x.projectId.replace(" ", "_") == project.replace(" ", "_");
    }).length;
  }

  /**
   * Helper getAlarmsByProjectId()
   * @param device
   * @return lenght of alarms in device
   */

  getDevicesByLocationList() {
    let currentProject = this.project;
    let currentProjectLocationList = currentProject.locationList;

    let out = this.devices.filter(device => {
      return currentProjectLocationList.includes(device.location);
    });

    return out;
  }

  logout() {
    this.authService.logout().subscribe(
      res => {
        this.router.navigate(["/login"]);
      },
      err => {
        this.authService.removeToken();
        this.router.navigate(["/login"]);
      }
    );
  }

  getDevices() {
    this.sharedService.currentSelectedDevice.subscribe(device => {
      this.devicesService.getDevices({ projectId: this.currentProject }).subscribe(async (controllers: any[]) => {
        this.devices = controllers;
        if (!device["uid"] && this.devices.length) {
          //this.applyChanges(this.devices[parseInt(this.defaultDeviceIndex, 10)]);
        }
      });
    });
  }

  /*
  Desc: get the locations where the current project has logged
*/
  getLocations() {
    this.sharedService.currentSelectedLocation.subscribe(location => {
      this.devicesService.getLocations({ projectId: this.currentProject }).subscribe(async (locations: any[]) => {
        this.locations = locations;
        if (!location["id"] && this.locations.length) {
          //this.applyChanges(this.locations[parseInt(this.defaultDeviceIndex, 10)]);
        }
      });
    });
  }

  applyChanges(location?) {
    //console.log(" -> applyChanges ")

    if (location) {
      this.selectedLocation = location;
      this.sharedService.settingSelectedLocation(location);
      this.sharedService.settingShortCutPages(location.dashboardPages);
    }
    $("#selectController").modal("hide");
    $("#sidebar").removeClass("toggled");
  }

  ngApplyChanges(event) {
    this.applyChanges();
  }

  ngSelectDevices(event) {
    this.selectDevice(event.item, event.index);
  }

  ngSelectLocations(event) {
    localStorage.setItem("currentUid", event.item.uid);
    localStorage.setItem("description", event.item.description);
    this.selectLocation(event.item, event.index);
    //this.Description=event.item.description;
    //this.uid=event.item.uid;
    this.sharedService.setCurrentDescription(event.item.description);
    this.sharedService.setCurrentUid(event.item.uid);
    //this.sharedService.setCurrentLocation(event.item.locationId);

    let locationId = JSON.parse(localStorage.getItem("currentLocation")).locationId;
    localStorage.setItem("locationId", locationId);

  }

  selectLocation(item, index) {

    localStorage.setItem("currentLocation", JSON.stringify(item))
    localStorage.setItem("currentLocationIndex", index)

    this.sharedService.setCurrentLocation(item);

    //this.applyChanges(item);
    $("#selectController").modal("hide");
    $("#sidebar").removeClass("toggled");

  }

  selectDevice(item, index) {
    this.selectedDevice = item;
    this.defaultDeviceIndex = index;
    localStorage.setItem("defaultDeviceIndex", index);
  }

  checkAlarmsByDeviceUID(uid) {
    var _alarms = this.alarms.filter(function (obj) {
      var isAlarm = obj.uid == uid;
      return isAlarm;
    });
    return !_alarms.length;
  }
}
