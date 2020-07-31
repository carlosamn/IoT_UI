import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef, Input, OnChanges } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../../public/authentication/authentication.service";
import { AppSharedService } from "../../../app.shared-service";
import { AlarmsService } from "../../alarms/alarms.service";
import { WebEventsService } from "../../webEvents/webEvents.service";
import { FL3Service } from "../fl3.service";
import { FL3SharedService } from "../fl3-shared.service";
import { DoutputsService } from "../../doutputs/doutputs.service";

@Component({
  selector: "app-fl3-options",
  templateUrl: "./fl3-options.component.html",
  styleUrls: ["./fl3-options.component.css", "./fl3-options.component.scss"]
})
export class FL3OptionsComponent implements OnInit {

  public fl3Options;
  public isVisible;
  public fl3Settings;
  public alarms;
  public selectedLocation;
  public valveStatus;
  public valveIcon;
  public vfdStatus;
  public vfdIcon;
  public isCollarAnalysis;
  public digitalIO = [];

  public SUBS = {
    visible: <any>{},
    fl3Settings: <any>{},
    alarms: <any>{},
    digitalIO: <any>{},
    collar: <any>{},
    location: <any>{}
  };

  constructor(
    private fl3Shared: FL3SharedService,
    private appShared: AppSharedService,
    private alarmsService: AlarmsService,
    private changeDetectorRef: ChangeDetectorRef,
    private webEventsService: WebEventsService,
    private doutputsService: DoutputsService
  ) {
    this.fl3Options = {};
    this.fl3Settings = {};
    this.valveStatus = "NA";
    this.valveIcon = "../../assets/img/warning.png";
    this.vfdStatus = "NA";
    this.vfdIcon = "../../assets/img/warning.png";
  }

  ngOnInit() {

    this.SUBS.collar = this.fl3Shared.getFl3CollarAnalysisEnable.subscribe(collar => {
      this.isCollarAnalysis = collar;
    });

    this.SUBS.visible = this.fl3Shared.getFl3OptionsVisibility.subscribe(isvisible => { this.isVisible = isvisible; });

    this.SUBS.location = this.appShared.currentLocationObj.subscribe(async selectedLocation => {

      if (selectedLocation) {
        this.selectedLocation = selectedLocation;
        this.webEventsService.UID = this.selectedLocation['uid'];
        if (this.webEventsService.UID) {
          this.webEventsService.getDigitalIO();
        }

        this.SUBS.fl3Settings = this.fl3Shared.getFl3Settings.subscribe(fl3Settings => {

          this.fl3Settings = fl3Settings;
          this.setCollarAnalysisShowState(this.fl3Settings.collarGraph);

          this.SUBS.alarms = this.appShared.currentAlarmsObj.subscribe(alarms => {
            if (localStorage.getItem("currentProject")) {
              let thisProject = JSON.parse(localStorage.getItem("currentProject"))["id"];
              this.alarms = Object.values(alarms).filter(x => {
                return (
                  x.project.replace(" ", "_").toUpperCase() == thisProject.replace(" ", "_").toUpperCase()
                );
              });
              try { this.changeDetectorRef.detectChanges(); } catch (e) { console.error("Error changeDetectorRef @ fl3-options components") }
            }
          });

        });
      }
    });

    this.SUBS.digitalIO = this.webEventsService.digitalController.asObservable().subscribe(din => {

      this.digitalIO = din;

      if (this.digitalIO[6] == 1) {
        this.valveIcon = "../../assets/img/checked.png";
        this.valveStatus = "ON";
      }
      if (this.digitalIO[6] == 0) {
        this.valveIcon = "../../assets/img/error.png";
        this.valveStatus = "OFF";
      }


      if (this.digitalIO[5] == 1) {
        this.vfdIcon = "../../assets/img/checked.png";
        this.vfdStatus = "ON";
      }
      if (this.digitalIO[5] == 0) {
        this.vfdIcon = "../../assets/img/error.png";
        this.vfdStatus = "OFF";
      }

    });

  }

  ngOnDestroy(): void {
    this.SUBS.visible.unsubscribe();
    this.SUBS.fl3Settings.unsubscribe();
    this.SUBS.alarms.unsubscribe();
    this.SUBS.location.unsubscribe();
    this.SUBS.digitalIO.unsubscribe();
  }

  getAlarmsForAlarmDepth() {
    if (this.alarms.length > 0) {
      return this.alarms.filter(alarm => {
        return alarm.type == "FL3" && alarm.sensor.alarmLevel == "WARNING";
      });
    } else {
      return []
    }
  }
  getAlarmsForESDAlarmDepth() {
    if (this.alarms.length > 0) {
      return this.alarms.filter(alarm => {
        return alarm.type == "FL3" && alarm.sensor.alarmLevel == "CRITICAL";
      });
    } else {
      return []
    }
  }

  setFilterType(type) {
    this.fl3Shared.fireFl3Event(type);
  }

  redraw(type) {
    this.fl3Shared.setFl3ClickedButton(type);
  }

  /*
  description: update the digital outputs
  type: type of digital output to update
        1: Valve ON (Output=3, value=1)
        2: Valve OFF (Output=4, value=1)
        3: VFD ON (Output=2, value=1)
        4: VFD OFF (Output=2, value=0)
  */
  sendOutput(type) {
    //console.log(`Inside sendOutput:: type=${type}`);
    let payload = {
      uid: this.selectedLocation.uid,
      output: 0,
      value: 0
    };
    switch (type) {
      case 1: {
        payload.output = 3;
        payload.value = 1;
        break;
      }
      case 2: {
        payload.output = 4;
        payload.value = 1;
        break;
      }
      case 3: {
        payload.output = 2;
        payload.value = 1;
        break;
      }
      case 4: {
        payload.output = 2;
        payload.value = 0;
        break;
      }
      default: {
        //console.log(`sendOutput:: Invalid type ${type}`);
        payload = null;
      }
    }
    if (!payload) {
      return;
    }
    //console.log(`Inside sendOutput:: payload=${JSON.stringify(payload)}`);
    this.doutputsService.saveDigitalOutputs(payload).subscribe(
      res => {
        //console.log(`Response from saveDigitalOutputs:: ${JSON.stringify(res)}`);
        // $('#loadWav').modal('hide');
        // this.loading.hide();
        // this.getAllFl3Records();
      },
      err => {
        //this.loading.hide();
        //console.log(err);
      }
    );
  }


  setCollarAnalysisShowState(BooleanState) {

    this.fl3Shared.setFl3CollarAnalysisEnable(BooleanState);

  }
}
