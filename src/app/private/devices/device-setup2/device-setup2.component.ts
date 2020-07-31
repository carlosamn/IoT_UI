import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DevicesService } from '../devices.service';
import { timeToSeconds } from '../../../common/filters/time-filter';
import { secondsToTime, intervalToTime } from '../../../common/filters/time-filter-2';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-device-setup2',
  templateUrl: './device-setup2.component.html',
  styleUrls: ['./device-setup2.component.css']
})

export class DeviceSetup2Component implements OnInit {

  public controller: any;

  public project: any;

  public currentPage = 1;
  public info;
  public filter;
  public ainputs;
  public dinputs;
  public doutputs;
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

  public oldAinputs;
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

  constructor (private devicesService: DevicesService, private router: Router) {

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
      name: '',
      loginterval: '',
      appliedlog: '',
      status: '',
      startlogging: ''
    });

    this.ainputs = [];
    this.dinputs = [];
    this.doutputs = [];
    this.voltages = [];

    this.oldAinputs = [];
    this.oldDinputs = [];
    this.oldDoutputs = [];
    this.oldVoltages = [];

  }


  ngOnInit() {
    this.getDevicesByProjectId(this.currentProject);
  }

  getAllControllers() {
    this.getProjects();
    this.getLogInterval();
    this.devicesService.getAllControllers().subscribe(async (controllers: any[]) => {
      await this.fillLogInterval(controllers);
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
        //console.log('devices by project id');
        //console.log(controllers);
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
            if ( this.loginterval[l].ack) {
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
      //console.log('Proyectos');
      //console.log(projects);
      this.projects = projects;
    });
  }

  getInfo() {
    this.devicesService.getDeviceInfo(this.controller).subscribe(info => {
      this.info = info;
    });
  }

  getLogInterval() {
    this.devicesService.getLogInterval().subscribe((loginterval: any[]) => {
      /* 
        Verificamos si hay una lista de logintervals, si hay, ésta lista la 
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
    this.devicesService.getAnalogInputs(controller).subscribe((ainput: any[]) => {
      for (let i = 0; i < ainput.length; i++) {
        if (!ainput[i].ack) {
          ainput[i].ack = {
            'uid': '',
            'relatedModelType': 'ainput',
            'relatedChannelId': null,
            'ackForPacket': 19,
            'receivedAt': ''
          };
        }
      }
      this.oldAinputs = ainput;
      this.ainputs = ainput;
    });
  }

  getDigitalInput(controller) {
    this.devicesService.getDigitalInputs(controller).subscribe((dinput: any[]) => {
      for (let i = 0; i < dinput.length; i++) {
        if (!dinput[i].ack) {
          dinput[i].ack = {
            'uid': '',
            'relatedModelType': 'dinput',
            'relatedChannelId': null,
            'ackForPacket': 20,
            'receivedAt': ''
          };
        }
      }
      this.oldDinputs = dinput;
      this.dinputs = dinput;
    });
  }

  getDigitalOutput(controller) {
    this.devicesService.getDigitalOutputs(controller).subscribe(doutput => {
      if (!doutput[0].channels1Ack) {
        doutput[0].channels1Ack = {
          'uid': '',
          'relatedModelType': 'doutput',
          'ackForPacket': 21,
          'receivedAt': ''
        };
      }
      this.oldDoutputs = doutput[0];
      this.doutputs = doutput[0];
    });
  }

  getVoltage(controller) {
    this.devicesService.getVoltages(controller).subscribe((voltage: any[]) => {
      if (!voltage[0].ack) {
        voltage[0].ack = {
          'uid': '',
          'relatedModelType': 'voltage',
          'ackForPacket': 24,
          'receivedAt': ''
        };
      }
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
    this.getAnalogInput(this.controller);
    this.getDigitalInput(this.controller);
    this.getDigitalOutput(this.controller);
    this.getVoltage(this.controller);
  }

  setLogInterval() {

    $('#sendSetup').modal('show');

    if (this.controllerSelected.length) {

      this.controllerSelectedList = false;
      const data = [];

      for (let l = 0; l < this.controllerSelected.length; l ++) {
        data.push({
          'uid': this.controllerSelected[l].uid,
          'interval': timeToSeconds(this.loginterval[0].interval) / 1000,
          'packetType': 12,
          'start': this.loginterval[0].start
        });
      }

      if (this.logIntervalExists) {
        this.devicesService.updateLogInterval(data).then(logInterval => {
          //console.log('Log Interval Update!');
          $('#sendSetup').modal('hide');
        });
      } else {
        this.devicesService.setLogInterval(data).then(logInterval => {
          //console.log('Log Interval Set!');
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
    const data = {'projectId' : project};
    this.devicesService.updateControllerProject(uid, data);
  }

  async setupAnalogInput() {
    $('#sendSetup').modal('show');
    this.sendingDataToController = true;
    this.ainputs.map(ainput =>  ainput.uid = this.controller);
    await this.devicesService.updateAnalogInput(this.oldAinputs, this.ainputs).then(ainput => {
      this.sendingDataToController = false;
      $('#sendSetup').modal('hide');
      this.ainputs = ainput;
    });
  }

  async setupDigitalInput() {
    $('#sendSetup').modal('show');
    this.sendingDinToController = true;
    this.dinputs.map(dinput =>  dinput.uid = this.controller);
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
      this.controllerSelected.push({'uid': uid});
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
          this.controllerSelected.push({'uid': this.controllers[c].uid});
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

      for (let c = 0; c < this.controllerSelected.length; c ++) {
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

      for (let c = 0; c < this.controllerSelected.length; c ++) {
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
}
