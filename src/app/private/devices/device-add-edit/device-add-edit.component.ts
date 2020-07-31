import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//  Services
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { CompaniesService } from '../../companies/companies.service';
import { ProjectsService } from '../../projects/projects.service';
import { DevicesService } from '../devices.service';
import { ClientsService } from '../../clients/clients.service';
import { UsersService } from '../../users/users.service';
import { LocationsService } from '../../locations/locations.service';
import { FL3Service } from '../../fl3/fl3.service';
import { md5 } from '../../../common/utilities/md5';

import { AppSharedService } from '../../../app.shared-service';
import { dashboards } from '../../routing-dashboards';

@Component({
  selector: 'app-device-add-edit',
  templateUrl: './device-add-edit.component.html',
  styleUrls: ['./device-add-edit.component.css']
})
export class DeviceAddOrEditComponent implements OnInit {

  private companyId;
  private selectedDevice;
  public device;
  public userData;
  public companies;
  public projects;
  public dashboardPages = [];
  public clientCode;
  public companyName;
  public companyCode;
  public dashboardPagesAll = [];
  public ainputs;
  public dinputs;
  public doutputs;
  public voltages;
  public controller;
  public currentProject;

  public isEdit: boolean = false;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private appShared: AppSharedService,
    private companyService: CompaniesService,
    private projectsService: ProjectsService,
    private authService: AuthenticationService,
    private devicesService: DevicesService,
    private userServices: UsersService,
    private clientService: ClientsService,
    private locationService: LocationsService,
    private fl3Service: FL3Service) {
      this.device = { dashboardPages: {} };
      this.companies = [];
      this.projects = [];
      this.ainputs = [];
      this.dinputs = [];
      this.doutputs = [];
      this.voltages = {};
      this.companyName;
      this.companyCode = {};
      this.dashboardPagesAll;
      this.dashboardPages;
      this.currentProject;
    }

  async ngOnInit() {

    this.appShared.currentSelectedDevice.subscribe(selectedDevice => this.selectedDevice = selectedDevice);

    this.appShared.currentCompany.subscribe(companyId => {
      this.companyId = companyId;
      this.clientService.getClientCode(companyId).subscribe(res => {
        this.controller = `${res.clientCode}`;
        this.getCompanies();
        this.getProjects();
      });
    });

    this.dashboardPages = await this.devicesService.getDashboardPages();
      //  Capturo la ruta, si es una ruta editable solicitamos el dispositivo por id y lo traemos para llenar los inputs
      this.activeRoute.params.subscribe(params => {
        let currentSettedPages;
        if (params['deviceId']) {
          this.isEdit = true;
          this.devicesService.getDeviceById(params['deviceId']).subscribe(device => {
            //  Le damos el valor del request del paramter device a this.device
            this.device = device;
            //  Iteramos dashboardPages para mostrarlo en la web
            this.device.dashboardPages.map(page => {
              currentSettedPages = this.dashboardPages.find(dashboard => dashboard.page === page);
              if(currentSettedPages) currentSettedPages.active = true;
            });

          });
        }
      });

    this.userData = await this.authService.getUserData();
  }

  private getCompanies() {
    let options = { clientId: this.companyId };
    this.companyService.getCompanies(options).subscribe(companies => {
      this.companies = companies;
    });
  }

  private getProjects() {
    let options = { clientId: this.companyId };
    this.projectsService.getProjects(options).subscribe(projects => {
      this.projects = projects;
    });
  }

  //  Creating the object dashboard pages
  private parseDashboardPages() {
    let pages = [];

    let dashboardPages = this.dashboardPages;
    dashboardPages.map(dashboard => {
      if(dashboard.active) pages.push(dashboard.page);
    });

    return pages;
  }

  public createOrUpdate() {
    if (this.isEdit) this.updateDevice();
    else this.addDevice();
  }

  public addDevice() {
    let pages = this.parseDashboardPages();
    this.device.dashboardPages = pages;
    this.device.clientCode = this.controller;
    this.devicesService.addDevice(this.device)
      .subscribe(async device => {
        this.addModelsToDevice();
        await this.setFl3Configuration(device);
        this.locationService.updateLocationsFromServer();
        this.router.navigate(['../list'], { relativeTo: this.activeRoute });
    }, err => {
      //console.log('err');
    });
  }

  public updateDevice() {
    let pages = this.parseDashboardPages();
    this.device.dashboardPages = pages;
    this.devicesService.updateDeviceById(this.device.uid, this.device)
      .subscribe(async device => {
        await this.setFl3Configuration(device);
        if(device.uid === this.selectedDevice.uid) {
          //  Do something if is the current selected device
        }
        this.router.navigate(['../../list'], { relativeTo: this.activeRoute });
      }, err => {
        alert('error');
      });
  }

  public resetDeviceData() {

  }

  addModelsToDevice() {
    this.addDefaultAinputs();
    this.devicesService.setAnalogInput(this.ainputs);
    this.addDefaultDinputs();
    this.devicesService.setDigitalInput(this.dinputs);
    this.addDefaultDoutputs();
    this.devicesService.setDigitalOutput(this.doutputs);
    this.addDefaultVoltages();
    this.devicesService.setVoltage(this.voltages).then(voltages => { //console.log(voltages);
    });
  }

  private addDefaultAinputs() {
    for (let i = 1; i < 9; i++) {
      this.ainputs.push({
        uid: this.device.uid,
        channelId: i,
        packetType: 19,
        name: `Sensor ${i}`,
        clientCode: this.controller,
        ack: {
          'uid': '',
          'relatedModelType': 'ainput',
          'relatedChannelId': null,
          'ackForPacket': 19,
          'receivedAt': ''
        },
        showinmap: false,
        enable: false,
        unit: 'kpa',
        analog_h: 5,
        analog_l: 0,
        physical_h: 65535.00,
        physical_l: 0,
        alarm_h: 65535.00,
        alarm_l: 0,
        enable_alarm_h: false,
        enable_alarm_l: false,
        text_h: 'High Alarm Warning',
        text_l: 'Low Alarm Warning'
      });
    }
  }

  private addDefaultDinputs() {
    for (let i = 1; i < 9; i++) {
      this.dinputs.push({
        uid: this.device.uid,
        channelId: i,
        packetType: 20,
        name: `IN ${i}`,
        clientCode: this.controller,
        ack: {
          'uid': '',
          'relatedModelType': 'ainput',
          'relatedChannelId': null,
          'ackForPacket': 20,
          'receivedAt': ''
        },
        showinmap: false,
        enable: false,
        means0: 0,
        means1: 1,
        enable_alarm0: false,
        enable_alarm1: false,
        text0: 'Digital Input Alarm',
        text1: 'Digital Input Alarm'
      });
    }
  }

  private addDefaultDoutputs() {

    const chann1 = [];
    const chann2 = [];

    for (let i = 1; i < 5; i++) {
      chann1.push({
        name: `OUT ${i}`,
        channelId: i,
        mean0: 0,
        mean1: 1
      });
    }

    for (let i = 5; i < 9; i++) {
      chann2.push({
        name: `OUT ${i}`,
        channelId: i,
        mean0: 0,
        mean1: 1
      });
    }

    this.doutputs.push({
      uid: this.device.uid,
      clientCode: this.controller,
      channels1: chann1,
      channels2: chann2
    });

  }

  private addDefaultVoltages() {
    this.voltages = {
      uid: this.device.uid,
      packetType: 24,
      low_battery_alarm_enable: true,
      low_battery_alarm: 11,
      clientCode: this.controller,
      ack: {
        'uid': '',
        'relatedModelType': 'voltage',
        'ackForPacket': 24,
        'receivedAt': ''
      },
      low_solar_alarm_enable: false,
      low_solar_alarm: 12
    };
  }

  setFl3Configuration(device) {
    let fl3Exists;
    return new Promise((resolve, reject) => {
      this.dashboardPages.map(dashboards => {
        if(dashboards.page === 'fl3' && dashboards.active) fl3Exists = true;
      });

      if (fl3Exists) {
        let fl3Config = {
          id: md5([device.projectId, device.location].join("_")),
          uid: device.uid,
          projectId: device.projectId,
          location: device.location,
          measurementUnit: 0,
          wellData: {
            pumpDepth: 0,
            wellDepth: 0,
            distBetweenCollars: 0
          },
          collarAnalysis: {
            collarStartDetection: 2,
            filterFreq: 1,
            collarCycles: 3,
            minDetectablePeriod: 0.025,
            maxDetectablePeriod: 0.050
          },
          acousticVelocity: {
            manualMode: 0,
            autoMode: 0,
            manualVelocity: 398,
            autoVelocity: 398
          },
          baselineGraph: {
            zeroTimeDetection: 0.5,
            peakDetectionLevel: 16000,
            KickDetection: 3
          },
          captureMode: {
            modeValue: 0,
            insync: true
          },
          autoMode: {
            numOfShots: 3,
            shotInterval: 1,
            shotDuration: 5000,
            captureTime: true,
            insync: true
          },
          manualMode: {
            shotDuration: 5000,
            captureTime: true,
            insync: true
          },
          listenMode: {
            shotDuration: 5000,
            insync: true
          },
          defaultGraphMode: 0,
          defaultFiltersApplied: 0,
          miscSettings: {
            inputScale: 0,
            samplingRate: 0,
            resolution: 0,
            insync: true
          },
          searchZeroWith: 0,
          collarGraph: false
        }
        this.fl3Service.addFl3Settings(fl3Config)
          .subscribe(fl3settings => {
            resolve();
        }, err => {
            if (err.code === 11000) resolve();
            else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
