import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';
import { LoadingService } from '../../shared/loading.service';
import { md5 } from '../../../common/utilities/md5';
import { ISubscription } from "rxjs/Subscription";

import { FL3Service } from '../fl3.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { LocationsService } from '../../locations/locations.service';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-fl3-settings',
  templateUrl: './fl3-settings.component.html',
  styleUrls: ['./fl3-settings.component.css']
})
export class FL3SettingsComponent implements OnInit {
  @ViewChild('notifications') private notifications: SwalComponent;
  public fl3Settings;
  public notificationOptions;
  private subscription: ISubscription;
  private selectedDevice;
  private selectedLocation;
  private defaultModeValue;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private loading: LoadingService,
              private fl3Service: FL3Service,
              private locationsService : LocationsService,
              private appSharedService: AppSharedService) {
    this.notificationOptions = {};
    this.fl3Settings = {
      acousticVelocity: {},
      autoMode: {},
      baselineGraph: {},
      captureMode: {},
      collarAnalysis: {},
      listenMode: {},
      manualMode: {},
      miscSettings: {},
      wellData: {}
    };
  }

  async ngOnInit() {
    this.subscription = this.appSharedService.currentLocationObj.subscribe(selectedLocation => {
      if(selectedLocation['locationId']) {
        this.selectedLocation = selectedLocation;
        this.fl3Service.getFl3SettingsById(selectedLocation["locationId"])
          .subscribe(fl3settings => {
            this.fl3Settings = fl3settings;
            //  Assigning the default mode value
            console.log('Assigning the default mode value');
            this.defaultModeValue = JSON.stringify(this.fl3Settings.captureMode);
            this.fl3Settings.baselineGraph.zeroDetectionLevel = this.fl3Settings.baselineGraph.zeroDetectionLevel;
            //console.log(this.fl3Settings);
          }, err => {
            //console.error(err);
          });
        }
    });
  }

  updateSettings(type) {
    this.loading.show();
    let fl3Settings = {};
    this.fl3Settings.baselineGraph.filterOutputStart = 0.6;
    switch(type) {
      case 'wellData':
      //console.log(this.fl3Settings);
        this.fl3Settings.baselineGraph.zeroDetectionLevel = this.fl3Settings.baselineGraph.zeroDetectionLevel;
        fl3Settings = {
          measurementUnit: this.fl3Settings.measurementUnit,
          wellData: this.fl3Settings.wellData,
          collarAnalysis: this.fl3Settings.collarAnalysis,
          baselineGraph: this.fl3Settings.baselineGraph,
          acousticVelocity: this.fl3Settings.acousticVelocity
        };


      break;
      case 'mode':
        fl3Settings = {
          captureMode: this.fl3Settings.captureMode,
          autoMode: this.fl3Settings.autoMode,
          manualMode: this.fl3Settings.manualMode,
          listenMode: this.fl3Settings.listenMode,
          defaultGraphMode: this.fl3Settings.defaultGraphMode,
          defaultFiltersApplied: this.fl3Settings.defaultFiltersApplied,
          collarGraph: this.fl3Settings.collarGraph
        };
        console.log('ABC');
      break;
      case 'misc':
        fl3Settings = {
          miscSettings: this.fl3Settings.miscSettings
        };
      break;
      case 'raw':
        fl3Settings = {
          searchZeroWith: this.fl3Settings.searchZeroWith
        };
      break;
    }


    this.fl3Service.patchFl3Settings(this.fl3Settings.id, fl3Settings)
      .subscribe(fl3settings => {
        //  Aqui debemos preguntar si el tipo es "mode"
        //  Verificamos el defaultMode, si es diferente a 1 y fue cambiado a cerom entonces

        const previousDefaultMode = JSON.parse(this.defaultModeValue);
        console.log('After patch');
        console.log(`Previous value ${previousDefaultMode.modeValue}`);
        console.log(`Current value ${this.fl3Settings.captureMode.modeValue}`);
        if (type === 'mode') {
          if (previousDefaultMode.modeValue !== 1 && this.fl3Settings.captureMode.modeValue === 1) {
            console.log('Calling stop command for scheduled shots');
            this.defaultModeValue = JSON.stringify(this.fl3Settings.captureMode);
            this.stopCommand();
          }          
        }

        this.loading.hide();
        this.fl3Settings.baselineGraph.zeroDetectionLevel = this.fl3Settings.baselineGraph.zeroDetectionLevel;
        this.notificationOptions = { type: 'success', title: 'Succeded', text: 'your configuration has been saved successfully' };
        setTimeout(() => { this.notifications.show() }, 200);

      }, err => {
        this.loading.hide();
        //console.error(err);
      });
  }

  setOptionValue(type) {
    if(type === 'manual') {
      this.fl3Settings.acousticVelocity.manualMode = 1;
      this.fl3Settings.acousticVelocity.autoMode = 0;
    } else {
      this.fl3Settings.acousticVelocity.manualMode = 0;
      this.fl3Settings.acousticVelocity.autoMode = 1;
    }
  }

  ngOnDestroy() {
    try{this.subscription.unsubscribe();}catch(e){}

  }

  async load(type) {
    this.loading.show();
    let modes = [
        { command: 0, description: 'captureMode' },
        { command: 1, description: 'autoMode' },
        { command: 2, description: 'manualMode' },
        { command: 3, description: 'listenMode' }
    ];

    let mic = [{ command: 4, description: 'miscSettings' }];

    let mode = <any>{};
    let miscSettings = <any>{};
    let data, result;

    if(type === 'mode') {
      data = modes;
    } else {
      data = mic;
    }

    for(let i = 0 ; i < data.length; i++) {
      result = await this.loadModes(data[i].command);
      if(type === 'mode') mode[data[i].description] = result;
      else miscSettings = result;
    }

    if(type == 'mode') {
      this.fl3Settings.manualMode = mode.manualMode;
      this.fl3Settings.autoMode = mode.autoMode;
      this.fl3Settings.autoMode.shotInterval = mode.autoMode.shotInterval / 60;
      this.fl3Settings.captureMode = mode.captureMode;
      this.fl3Settings.listenMode = mode.listenMode;
    } else {
      this.fl3Settings.miscSettings = miscSettings;
    }
    this.loading.hide();
  }


  loadModes(type) {
    return new Promise<any>((resolve: Function, reject: Function) => {
    this.fl3Service.loadFl3SettingsFromControllers(this.selectedLocation['uid'], type)
      .subscribe(data => resolve(data.parsed));
    });

  }

  stopCommand() {
    console.log('Stop command called');
    this.fl3Service.capture(6, this.selectedLocation.uid)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );     
  }
}
