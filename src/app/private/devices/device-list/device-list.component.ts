import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSharedService } from '../../../app.shared-service';

import { DevicesService } from '../devices.service';
import { Subject } from 'rxjs';

import { FL3Service } from '../../fl3/fl3.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})

export class DeviceListComponent implements OnInit {

  public devices;
  public device;
  public updflag;
  public currentProject;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor (
    private sharedService: AppSharedService,
    private devicesService: DevicesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fl3Service: FL3Service
  ) {
    this.currentProject = localStorage.getItem('project');
    this.devices = [];
    this.device = {};
  }

  async ngOnInit() {
    //this.sharedService.currentDtOptions.subscribe(options => this.dtOptions = options);
    this.getDevicesByProject();

  }

  private getDevicesByProject() {
    this.devicesService.getDevices({ projectId: this.currentProject })
      .subscribe(devices => {
        this.devices = devices;
        this.dtTrigger.next();
      }, err => {
        //console.error(err);
      });
  }

  public deleteDevice(deviceId, index) {
    if (confirm("Do you want to permanently delete  this Controller?")) {
    this.devicesService.deleteDeviceById(deviceId)
      .subscribe(device => {
        this.devices.splice(index, 1);
        this.deleteFl3Configuration(deviceId);
      }, err => {
        //console.log('Something is wrong');
      });
    } else {
      return false;
    }
  }

  private deleteFl3Configuration(id) {
    this.fl3Service.deleteFl3Settings(id)
      .subscribe(response =>{}
        //console.log(response)
      );
  }
}
