import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EtdService } from '../etd.service';
import { AppSharedService } from '../../../app.shared-service';
import { DevicesService } from '../../devices/devices.service';
import { ProjectsService } from '../../projects/projects.service';
import { ClientsService } from '../../clients/clients.service';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { httpFactory } from '@angular/http/src/http_module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './etd-dashboard.component.html',
  styleUrls: ['./etd-dashboard.component.css']
})

export class EtdDashboardComponent implements OnInit, OnDestroy {
  public controllers;
  public sensors;
  public auxSensors;
  public pollServer;
  public client;
  public currentController;
  public lastUpdate;
  public datamessage;
  public selectedDevice;
  public selectedLocation;
  public clientCode;
  public SubsLocation;
  public SubControllers;
  public SubAllControllers;

  public devices;

  constructor(
    private router: Router,
    private appService: AppSharedService,
    private etdService: EtdService,
    private deviceService: DevicesService,
    private projectService: ProjectsService,
    private clientsServices: ClientsService
  ) {


  }

  ngOnInit() {

    try {

      this.lastUpdate = new Date(),
        this.sensors = [],
        this.controllers = [],
        this.datamessage = 'Loading data...';

      let currentProjectId = JSON.parse(localStorage.getItem("currentProject")).id;


      this.appService.setProject(currentProjectId);

      this.SubsLocation = this.appService.currentLocationObj.debounceTime(1200).subscribe(async selectedLocation => {

        this.selectedLocation = selectedLocation;

        try {
          this.selectedDevice = await this.getDeviceByLocation(selectedLocation);
          this.currentController = this.selectedDevice
        } catch (e) {
          console.error("Error getting Device uid @etd_dashboard: " + selectedLocation["uid"])
        }

        this.getSensors(this.selectedDevice)

        try {
          if (this.selectedDevice["uid"]) {
            this.selectController();
          }
        } catch (e) {
          console.error("this.selectedDevice[uid] no uid @ etd_dashboard")
        }

      });

    } catch (e) {
      console.error("Error @etd-dashboard.component.ts TryCatch Block")
      console.error(e)
    }
  }

  ngOnDestroy() {
    try { clearInterval(this.pollServer); } catch (e) { }
    try { this.SubsLocation.unsubscribe(); } catch (e) { }
    try { this.SubControllers.unsubscribe(); } catch (e) { }
    try { this.SubAllControllers.unsubscribe(); } catch (e) { }
  }

  getDeviceByLocation(location) {
    return new Promise(async (resolve, reject) => {
      let uid = location.uid;
      this.etdService.getController(uid).then(x => { resolve(x) }).catch(error => { reject(error) })
    })
  }

  getControllers() {
    this.SubControllers = this.etdService.getControllers(this.client).subscribe(controllers => {
      this.controllers = controllers;
    });
  }

  getAllControllers() {
    this.SubAllControllers = this.etdService.getAllControllers().subscribe(controllers => {
      //  Getting all controllers
      this.controllers = controllers;
      //  Getting the first item in controllers array
      this.currentController = this.controllers[0];
      this.selectController();
    });
  }

  async getttingDisponibility() {
    let data;

    for (let i = 0; i < this.controllers.length; i++) {
      data = await this.getSensorValues(this.controllers[i].uid);

      //  Verifying true or false
      if (!data.sensordata.error) {
        this.controllers[i].available = true;
      } else {
        this.controllers[i].available = false;
      }
    }
  }

  async selectController() {
    //  Get sensors of current controller
    await this.getSensors(this.currentController);
    const interval = await this.getLogIntervalByController(this.currentController.uid);
    ////console.log('interval is ' + interval);
    if (this.pollServer) {
      clearInterval(this.pollServer);
    }
    this.pollServer = setInterval(async () => {
      await this.getSensors(this.currentController);
      this.lastUpdate = new Date();
    }, interval);
  }

  getSensors(device) {
    let uid, controller;
    if (device && device.uid) {
      uid = device.uid;
      controller = device.clientCode + device.uid;
    }

    return new Promise<any>((resolve, reject) => {
      if (uid) {
        this.etdService.getAnalogInputs(uid).subscribe(async (sensor: any[]) => {
          const data = [];
          this.auxSensors = await this.getSensorValues(controller);
          if (!this.auxSensors.sensordata.error) {
            for (let s = 0; s < sensor.length; s++) {
              sensor[s].timestamp = this.auxSensors.sensordata.timeStamp;
              switch (s) {
                case 0:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput1;
                  break;
                case 1:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput2;
                  break;
                case 2:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput3;
                  break;
                case 3:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput4;
                  break;
                case 4:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput5;
                  break;
                case 5:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput6;
                  break;
                case 6:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput7;
                  break;
                case 7:
                  sensor[s].value = this.auxSensors.sensordata.packetData.analogInput8;
                  break;
              }
            }
          } else {
            this.datamessage = 'No data available';
          }

          this.sensors = sensor;

          if (!this.sensors.length) {
            this.datamessage = 'No data available';
          }

          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  getLogIntervalByController(controller) {
    const filter = {
      uid: controller
    };
    let logInterval;
    return new Promise<any>((resolve, reject) => {
      this.deviceService.getLogIntervalByController(filter).subscribe((interval: any[]) => {
        if (interval.length > 0) {
          logInterval = interval[0].interval * 1000;
        } else {
          logInterval = 10000;
        }
        resolve(logInterval);
      });
    });
  }

  getSensorValues(controller): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.etdService.getSensorValues(controller).subscribe(values => {
        resolve(values);
      });
    });
  }

  updateSensor() {
    ////console.log(this.sensors);
  }

  controllerSelected(controller) {
    this.currentController = controller;
    this.selectController();
  }

}
