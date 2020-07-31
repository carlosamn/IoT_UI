import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DevicesService } from '../devices.service';
import { timeToSeconds } from '../../../common/filters/time-filter';
import { secondsToTime, intervalToTime } from '../../../common/filters/time-filter-2';
import { returnChangedObjects } from '../../../common/helpers/helpers';
import { PITService } from '../../pit/pit.services';
import { AinputsService } from '../../ainputs/ainputs.service';

import { AppSharedService } from '../../../app.shared-service';
import { Subject } from 'rxjs';

import { LocationsService } from '../../locations/locations.service';
import { LoadingService } from '../../shared/loading.service';
import { DeviceDetectorService } from 'ngx-device-detector';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-device-setup',
  templateUrl: './device-setup.component.html',
  styleUrls: ['./device-setup.component.less']
})

export class DeviceSetupComponent implements OnInit {

  public controller: any;

  public project: any;
  public activeIndex: number = -1;
  public currentUpdatedAinput: number = 0;

  public currentPage = 1;
  public info;
  public ip = '';
  public filter;
  public ainputs;
  public dinputs;
  public doutputs;
  public device;
  public voltages;
  public projects;
  public controllers;
  public pagination = 10;
  public controllerSelected = [];
  public loginterval;
  public currentProject;
  public logIntervalExists;
  public currentController;
  public allControllers: boolean;
  public sendingStopCommand = false;
  public sendingStartCommand = false;
  public sendingDataToController = false;
  public sendingDinToController = false;
  public sendingDoutToController = false;
  public sendingVoltageToController = false;
  public controllerSelectedList = false;
  public selectAllControllers = false;

  public oldDinputs;
  public oldDoutputs;
  public oldVoltages;

  public ftp: any = {
    uid: '',
    serverip: '',
    username: '',
    password: '',
    directory: '',
    filename: '',
    firmwareupd: ''
  };

  public deviceInfo;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  constructor(
    private readonly loading: LoadingService,
    private readonly locationService: LocationsService,
    private readonly ainputService: AinputsService,
    private appService: AppSharedService,
    private devicesService: DevicesService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private PITService: PITService) {

    appService.currentDtOptions.subscribe(options => this.dtOptions = options);

    this.currentProject = localStorage.getItem('project');

    this.info = [];

    this.info.push({
      ip: '',
      version: ''
    });

    this.loginterval = [];

    this.loginterval.push({
      uid: '',
      interval: null,
      packetType: null,
      start: ''
    });

    this.controllers = [];

    this.controllers.push({
      uid: '',
      version: '',
      ip: '',
      active: '',
      location: '',
      loginterval: '',
      appliedlog: '',
      status: '',
      startlogging: ''
    });


    this.ainputs = [];
    this.dinputs = [];
    this.doutputs = [];
    this.voltages = [];

    this.oldDinputs = [];
    this.oldDoutputs = [];
    this.oldVoltages = [];

  }


  ngOnInit() {
    this.getDevicesByProjectId(this.currentProject);
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log('isMobile');  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
  }

  getAllControllers() {
    this.getProjects();
    this.getLogInterval();
    this.devicesService.getAllControllers().subscribe(async (controllers: any[]) => {
      await this.fillLogInterval(controllers);
      this.dtTrigger.next();
      this.controllers = controllers;
    });


  }

  getDevicesByProjectId(project) {

    //  Calling to new projects
    this.getProjects();

    //  Getting log interval
    this.getLogInterval();
    this.devicesService.getDevices({ projectId: project })
      .subscribe(async (controllers: any[]) => {
        await this.fillLogInterval(controllers);
        this.controllers = controllers;
      });
  }

  fillLogInterval(controllers) {
    if (this.loginterval.length) {
      for (let c = 0; c < controllers.length; c++) {
        for (let l = 0; l < this.loginterval.length; l++) {
          if (controllers[c].uid === this.loginterval[l].uid) {
            controllers[c].loginterval = this.loginterval[l].interval;
            controllers[c].startlogging = this.loginterval[l].start;
            if (this.loginterval[l].ack) {
              controllers[c].appliedLog = this.loginterval[l].ack.receivedAt;
            }
          }
        }
      }
    }
  }

  getCompanyById(controller, companyId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.devicesService.getCompanyById(companyId).subscribe(project => {
        resolve(project);
      });
    });
  }

  getProjects() {
    this.devicesService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  getInfo() {

  }

  getLogInterval() {
    this.devicesService.getLogInterval().subscribe((loginterval: any[]) => {
      /*
        Verificamos si hay una lista de logintervals, si hay, Ã©sta lista la
        transformamos (transformamos el tiempo en minutos a horas al formato: 01:00:00)
      */
      if (loginterval.length) this.loginterval = intervalToTime(loginterval);
    });
  }

  getFtp() {
    this.devicesService.getFtp().subscribe(ftp => {
      this.ftp = ftp;
    });
  }

  getAnalogInput(controller) {
    this.devicesService.getAnalogInputs(controller).subscribe((ainputs: any[]) => {
      this.ainputs = ainputs;
    });
  }

  getDigitalInput(controller) {
    this.devicesService.getDigitalInputs(controller).subscribe((dinput: any[]) => {
      // for (let i = 0; i < dinput.length; i++) {
      //   if (!dinput[i].ack) {
      //     dinput[i].ack = {
      //       'uid': '',
      //       'relatedModelType': 'dinput',
      //       'relatedChannelId': null,
      //       'ackForPacket': 20,
      //       'receivedAt': ''
      //     };
      //   }
      // }
      this.oldDinputs = dinput;
      this.dinputs = dinput;
    });
  }

  getDigitalOutput(controller) {
    this.devicesService.getDigitalOutputs(controller).subscribe(doutput => {
      // if (!doutput[0].channels1Ack) {
      //   doutput[0].channels1Ack = {
      //     'uid': '',
      //     'relatedModelType': 'doutput',
      //     'ackForPacket': 21,
      //     'receivedAt': ''
      //   };
      // }
      this.oldDoutputs = doutput[0];
      this.doutputs = doutput[0];
    });
  }

  getVoltage(controller) {
    this.devicesService.getVoltages(controller).subscribe((voltage: any[]) => {
      // if (!voltage[0].ack) {
      //   voltage[0].ack = {
      //     'uid': '',
      //     'relatedModelType': 'voltage',
      //     'ackForPacket': 24,
      //     'receivedAt': ''
      //   };
      // }
      this.oldVoltages = voltage;
      this.voltages = voltage;
    });
  }

  checkIfLogForControllerExists(controllerId) {
    this.devicesService.checkIfLogForControllerExists(controllerId).subscribe((controller: any[]) => {
      if (controller) {
        this.logIntervalExists = true;
      }
    });
  }

  controllerChanged() {
    this.getDeviceInfo(this.controller);
    this.getAnalogInput(this.controller);
    this.getDigitalInput(this.controller);
    this.getDigitalOutput(this.controller);
    this.getVoltage(this.controller);
  }

  getDeviceInfo(controller) {
    this.devicesService.getDeviceObj(controller).subscribe(device => {
      this.ip = device["ip"];
      this.device = device;
    })
  }



  setLogInterval() {

    $('#sendSetup').modal('show');

    if (this.controllerSelected.length) {

      this.controllerSelectedList = false;
      const data = [];

      for (let l = 0; l < this.controllerSelected.length; l++) {
        data.push({
          'uid': this.controllerSelected[l].uid,
          'interval': timeToSeconds(this.loginterval[0].interval) / 1000,
          'packetType': 12,
          'start': this.loginterval[0].start
        });
      }

      if (this.logIntervalExists) {
        this.devicesService.updateLogInterval(data).then(logInterval => {
          console.log('Log Interval Update!');
          $('#sendSetup').modal('hide');
        });
      } else {
        this.devicesService.setLogInterval(data).then(logInterval => {
          console.log('Log Interval Set!');
          $('#sendSetup').modal('hide');
        });
      }




    } else {
      this.controllerSelectedList = true;
    }


  }

  invertControllerSelection() {
    this.controllerSelectedList = false;
  }

  setFtp() {
    this.devicesService.setFtp(this.ftp);
  }

  updateControllerProject(uid, project) {
    const data = { 'projectId': project };
    this.devicesService.updateControllerProject(uid, data);
  }

  setupAnalogInput() {
    this.sendEntireArray(this.ainputs);
  }

  async sendOneByOne(ainputs) {
    $('#sendSetup').modal('show');
    for (var i = 0; i < ainputs.length; i++) {
      this.currentUpdatedAinput = i;
      await this.patchAinputById(ainputs[i]);
    }
    $('#sendSetup').modal('hide');
  }

  sendEntireArray(ainputs) {
    $('#sendSetup').modal('show');
    this.currentUpdatedAinput = null;
    this.ainputService.ainputsBulkUpdate(this.device.uid, ainputs)
      .subscribe(
        data => $('#sendSetup').modal('hide'),
        err => {
          $('#sendSetup').modal('hide');
          $('#sendSetupError').modal('show');
          setTimeout(() => {
            $('#sendSetupError').modal('hide');
          }, 3000);
          console.error('HTTP Error' + JSON.stringify(err))
        },
        () => console.log('HTTP request completed.')
      );
  }

  patchAinputById(ainput) {
    return new Promise((resolve, reject) => {
      this.ainputService.patchAinputById(ainput.id, ainput)
        .subscribe(ainput => {
          resolve(ainput);
        }, error => {
          resolve(error);
        });
    });
  }

  async setupDeviceEdit() {
    this.device["ip"] = this.ip;
    this.devicesService.updateDeviceEdit(this.device).then(x => {
      console.log(x)
    })
  }



  async setupDigitalInput() {
    $('#sendSetup').modal('show');
    this.sendingDinToController = true;
    this.dinputs.map(dinput => dinput.uid = this.controller);
    await this.devicesService.updateDigitalInput(this.oldDinputs, this.dinputs).then(dinput => {
      this.sendingDinToController = false;
      $('#sendSetup').modal('hide');
      this.dinputs = dinput;
    });
  }

  async setupDigitalOutput() {
    $('#sendSetup').modal('show');
    this.sendingDoutToController = true;
    await this.devicesService.updateDigitalOutput(this.doutputs).then(doutput => {
      this.sendingDoutToController = false;
      $('#sendSetup').modal('hide');
      this.doutputs = doutput;
    });
  }

  async setupVoltage() {
    $('#sendSetup').modal('show');
    this.sendingVoltageToController = true;
    await this.devicesService.updateVoltage(this.voltages[0]).then(voltage => {
      $('#sendSetup').modal('hide');
      this.voltages = voltage;
    });
  }

  showAllControllers() {
    this.allControllers = true;
    this.getAllControllers();
  }

  showControllersCurrentProject() {
    this.allControllers = false;
    this.getDevicesByProjectId(this.currentProject);
  }

  getControllerSelected(e, uid) {
    if (e.target.checked) {
      this.controllerSelected.push({ 'uid': uid });
      this.checkIfLogForControllerExists(uid);
    } else {
      const index = this.controllerSelected.indexOf(uid);
      this.controllerSelected.splice(index, 1);
    }
  }

  selectAllControllersByCheckbox(e) {
    if (e.target.checked) {
      if (!this.selectAllControllers) {
        for (let c = 0; c < this.controllers.length; c++) {
          this.controllerSelected.push({ 'uid': this.controllers[c].uid });
        }
        this.selectAllControllers = true;
      }
    } else {
      this.controllerSelected = [];
      this.selectAllControllers = false;
    }
  }

  startLogging() {
    if (this.controllerSelected.length) {

      const start = [];
      this.sendingStartCommand = true;

      for (let c = 0; c < this.controllerSelected.length; c++) {
        start.push({
          'uid': this.controllerSelected[c].uid,
          'start': this.loginterval[0].start
        });
      }

      this.devicesService.startLogging(start).then(data => {
        this.sendingStartCommand = false;
      });

    }
  }

  stopLogging() {
    if (this.controllerSelected.length) {

      const stop = [];
      this.sendingStopCommand = true;

      for (let c = 0; c < this.controllerSelected.length; c++) {
        stop.push({
          'uid': this.controllerSelected[c].uid,
          'start': this.loginterval[0].start
        });
      }

      this.devicesService.stopLogging(stop).then(data => {
        this.sendingStopCommand = false;
      });

    }
  }

  async updateLocation(location) {
    this.loading.show();
    try {
      let result = await this.locationService.editLocationById(location.locationId, location);
      this.activeIndex = -1;
    } catch (ex) {
      console.log('Error');
    }
    this.loading.hide();

  }


  doSaveLocationChanges($event) {

    this.loading.show();

    const uid = $event.uid;
    const location = $event.location;
    const locations = JSON.parse(localStorage.getItem('currentLocations') + '');
    const locationObj = locations.filter(_location => _location.locationId === location.id)[0];

    if (locationObj) {

      locationObj['description'] = location.description;
      locationObj['uid'] = uid;

      this.locationService.editLocationById(locationObj.locationId, locationObj)
        .then(response => {
          this.loading.hide();
        })
        .catch(error => {
          this.loading.hide();
          console.error('device-setup.component.ts / doSaveChanges() :: error');
          console.error(error);
          console.error('Params');
          console.error({
            id: locationObj.locationId,
            location: locationObj
          });
        });

    }
  }
}
