/**
 *  Component : choose-project
 *
 *
 *
 */




// --------------------------------------------------- //
// --  Imports Angular Resources  -------------------- //
// --------------------------------------------------- //
import { Component, OnInit } from "@angular/core";
import {ChangeDetectorRef, Input, OnChanges} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
// --------------------------------------------------- //




// --------------------------------------------------- //
// --  Imports Shared Resources  --------------------- //
// --------------------------------------------------- //
import { AuthenticationService } from "../../../public/authentication/authentication.service";
import { AppSharedService } from "../../../app.shared-service";
import { ProjectsService } from "../projects.service";
import { ClientsService } from "../../clients/clients.service";
import { DevicesService } from "../../devices/devices.service";
import { LocationsService } from "../../locations/locations.service";
import { AlarmsService } from "../../alarms/alarms.service";
// --------------------------------------------------- //




// --------------------------------------------------- //
// -- Lib's Scripts  --------------------------------- //
// --------------------------------------------------- //
import { getAlarmsByProject } from "../lib/scripts/HelpersAlarms";
import { appendAlarmsToProject } from "../lib/scripts/HelpersAlarms";
// --------------------------------------------------- //




// --------------------------------------------------- //
// -- Component :: Choose-Project
// --------------------------------------------------- //
@Component({
  selector: "app-choose-project",
  templateUrl: "./choose-project.component.html",
  styleUrls: ["./choose-project.component.css"]
})
// --------------------------------------------------- //





// --------------------------------------------------- //
// -- Component Class -------------------------------- //
// --------------------------------------------------- //
export class ChooseProjectComponent implements OnInit {


  // Parameters & Properties
  public logo;
  public user = <any>{};
  public role;
  public path;
  public projects = [];
  public clientOfUser;
  public map;
  public data;
  public ohd;
  public video;
  public pictures;
  public custom;
  public sensor1;
  public sensors;
  public dashb;
  public test;
  public userId;
  public alarms;
  public locations;


 // RXJS Subscriptions
  public SUBS = {
    logo: <any>{},
    alarms: <any>{},
    auth: <any>{},
    locations: <any>{},
    projects : <any>{}
  };








  // ----------------------------------------- //
  // Choose Project Constructor -------------- //
  // ----------------------------------------- //
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private sharedService: AppSharedService,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private devicesService: DevicesService,
    private locationService: LocationsService,
    private alarmsService: AlarmsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  // ----------------------------------------- //
















  // ----------------------------------------- //
  // -- ngOnInit() --------------------------- //
  // ----------------------------------------- //
  async ngOnInit() {
  

    localStorage.setItem("defaultDeviceIndex", "0");
    localStorage.setItem("defaultLocationIndex", "0");
    localStorage.removeItem("currentLocation");
    localStorage.removeItem("currentLocations");
    localStorage.removeItem("currentLocationIndex");
    localStorage.removeItem("currentUid");
    localStorage.removeItem("locationId");
    localStorage.removeItem("description");


        this.SUBS.logo = this.sharedService.currentLogo.subscribe(logo => {
        this.logo = logo;

        this.SUBS.auth = this.authService.me().subscribe(user => {
          console.error(user)
        this.user = user;
        this.role = user.userType;
        this.sharedService.settingUserObject(user);

          this.SUBS.projects = this.projectsService.getProjectsByUserType(this.user.userType).subscribe(async projects => {
            this.projects = projects;
           
              this.SUBS.alarms = this.sharedService.currentAlarmsObj.subscribe(alarms => {
                  this.projects.map( project => {
                    let _project = project;
                    _project["alarms"] = getAlarmsByProject(alarms,project);
                    return _project;
                  });
                  this.changeDetectorRef.detectChanges();
              });
            });

        });

      })


  }
  // ----------------------------------------- //

  // ----------------------------------------- //
  // -- ngOnDestroy() ------------------------ //
  // ----------------------------------------- //
  async ngOnDestroy() {
    try{this.SUBS.logo.unsubscribe();}catch(e){}
      try{this.SUBS.auth.unsubscribe();}catch(e){}
        try{this.SUBS.projects.unsubscribe();}catch(e){}
          try{this.SUBS.alarms.unsubscribe();}catch(e){}
            this.alarmsService.closeAlarmsService()
  }
  // ----------------------------------------- //

























































/**
 * Helper getAlarmByProjectId()
 * @param project
 * @return lenght of alarms in project
 */
  getAlarmByProjectId(project){
    return this.alarms.filter( alarm => {
      return project.id == alarm.projectId
      ;
    }).length;
  }

  public setDefaultSelectedLocation(item) {

    let _id = item.id.replace("_"," ");

    localStorage.setItem("currentProject",JSON.stringify(item))
    localStorage.setItem("currentLocationIndex","0")
    localStorage.setItem("project",item.id)

    this.router.navigate(["/", item.id.replace(" ","_"), "etd_dashboard"]);
  }
/*
  public setDefaultSelectedLocation(item) {

    let _id = item.id.replace("_"," ");
    let _locations = this.locations.filter( location => { return location.projectId == _id } );
    if(_locations.length>0){
      let _location = _locations[0];
      this.sharedService.settingSelectedLocation(_location);
      this.sharedService.settingShortCutPages(_location.dashboardPages);
    }
    this.router.navigate(["/", item.id, "etd_dashboard"]);
  }
*/


  logout() {
    this.authService.logout().subscribe(res => {
      this.router.navigate(["/login"]);
    });
  }




  getAlarmsByProject(projectId) {
    this.alarmsService.getAlarmsByProject(projectId).subscribe(alarms => {
      // //console.log(alarms);
      return alarms;
    });
  }

  getNotificationByDevice(projectId) {
    let notificationsByDevice = 0;

    this.devicesService.getDevices(projectId).subscribe(async (controllers: any[]) => {
      for (let c = 0; c < controllers.length; c++) {
        controllers[c].notifications = 0;

        this.devicesService.getAnalogInputs(controllers[c]).subscribe((ainput: any[]) => {
          for (let i = 0; i < ainput.length; i++) {
            if (ainput[i] && !ainput[i].ack) {
              controllers[c].notifications += 1;
            }
          }
        });

        this.devicesService.getDigitalInputs(controllers[c]).subscribe((dinput: any[]) => {
          for (let i = 0; i < dinput.length; i++) {
            if (dinput[i] && !dinput[i].ack) {
              controllers[c].notifications += 1;
            }
          }
        });

        this.devicesService.getDigitalOutputs(controllers[c]).subscribe(doutput => {
          if (doutput[0] && !doutput[0].channels1Ack) {
            controllers[c].notifications += 1;
          }
        });

        this.devicesService.getVoltages(controllers[c]).subscribe((voltage: any[]) => {
          if (voltage[0] && !voltage[0].ack) {
            controllers[c].notifications += 1;
          }
        });

        notificationsByDevice += controllers[c].notifications;
      }
    });

    return notificationsByDevice;
  }














}
// --------------------------------------------------- //
