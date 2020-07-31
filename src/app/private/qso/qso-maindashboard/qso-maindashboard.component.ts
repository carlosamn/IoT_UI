import { dashboards } from './../../routing-dashboards';
/* --------------------------------------------------------------------

    Module    : QSO
    Component : QSO Main Dashboard
    Updated   : 2/10/2018
    -------

    Dependencies :
      + Library : ng2-dragula for Drag and Drop
      + Preprocessor CSS : LESS

    Description :
      QSO Main Dashboard to display in real time container with QSO controller info.

 ----------------------------------------------------------------------*/





// ------------------------------------------------------------------- //
// --- Imports Angular Resources                                       //
// ------------------------------------------------------------------- //
import { Component, OnInit, keyframes } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// ------------------------------------------------------------------- //


// ------------------------------------------------------------------- //
// --- Imports App's Resources                                         //
// ------------------------------------------------------------------- //
import { QSOService } from '../qso.service';
import { AppSharedService } from '../../../app.shared-service';

// ------------------------------------------------------------ //
// -- Imports :: Chart Options
// ------------------------------------------------------------ //
import { QSOStreamingService } from './../qso.service.streaming';
import { QSOSidebarMenuService } from './../qso.service.ui.sidebar.menu';
import { QSOStageService } from './../qso.service.ui.stages';
import { QSONotificationService } from './../qso.service.notifications';
import { QSOChartService } from './../qso.service.ui.charts';
// ------------------------------------------------------------ //


// ------------------------------------------------------------ //
// -- Imports :: Models and Interfaces
// ------------------------------------------------------------ //
import { IChannelSensorQSO } from './../lib/models/ISensorQSO';
import { IComlinkNotification } from './../lib/models/IComlinkNotification';
import { IHighChartOptions } from './../lib/models/IHighChartOptions';
import { colors } from '../../../common/utilities/colors';
// ------------------------------------------------------------ //
// ------------------------------------------------------------------- //


// ------------------------------------------------------------------- //
// --- Imports Vendors Resources                                       //
// ------------------------------------------------------------------- //
import { DragulaService } from 'ng2-dragula';
// ------------------------------------------------------------------- //



// ------------------------------------------------------------ //
// -- Imports :: Models and Interfaces
// ------------------------------------------------------------ //
import { ISensorQSO, toISensorQSO } from './../lib/models/ISensorQSO';
import { IControllerSensorQSO, toIControllerSensorQSO } from './../lib/models/ISensorQSO';
// ------------------------------------------------------------ //


import { getSensorPositionInContainer } from '../lib/scripts/QSO_SEE';
import { get_devices_with_qso_layout, get_devices_without_qso_layout } from '../lib/scripts/QSO_Layout';
import { getAvailablePostion } from '../lib/scripts/QSO_Layout';
import { getSensorLayout } from '../lib/scripts/QSO_Layout';



// ------------------------------------------------------------------- //
// --- Component Definition                                            //
// ------------------------------------------------------------------- //
@Component({
  selector: 'app-qso-maindashboard',
  templateUrl: './qso-maindashboard.component.html',
  styleUrls: ['./qso-maindashboard.component.less']
})
// ------------------------------------------------------------------- //




// ------------------------------------------------------------------- //
// --- Main Component Class                                            //
// ------------------------------------------------------------------- //
export class QsoMainDashboardComponent implements OnInit {

  public DATA = {
    sensors: <any[]>[]
  };

  // Properties :: SETTINGS
  public SETTINGS = {
    location: <any>{}
  };

  // Properties :: UI/UX
  public UI = {
    COLUMNS: 4,
    ROWS: 10,
    CONTAINERS: [
      {
        name: 'STAGE 1',
        items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      },
      {
        name: 'STAGE 2',
        items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      },
      {
        name: 'STAGE 3',
        items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      },
      {
        name: 'STAGE 4',
        items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      }
    ]
  };

  public UX = {
    LOADED: false,
    ENABLE: true,
    DRAGULA: {
      CONTROLLERS: 'DRAG_CONTROLLERS',
      CONTAINERS: 'DRAG_CONTAINERS'
    }
  };

  // Properties :: SUBSCRIPTIONS
  public SUBS = {
    sensors: new Subscription(),
    location: new Subscription(),
    dragula: new Subscription()
  };

  // Constructor
  constructor(private dragulaService: DragulaService,
    private qsoService: QSOService,
    private appSharedService: AppSharedService,
    private qsoStreamingService: QSOStreamingService,
    private qsoUISidebarMenuService: QSOSidebarMenuService,
    private qsoUIStageService: QSOStageService,
    private qsoUIChartService: QSOChartService,
    private qsoNotificationService: QSONotificationService,
    private http: HttpClient) {

  }

  async ngOnInit() {

    // Init Dragula (Vendor Drag & Drop Lib's)
    this.initDragula();

    // Init QSO Sensor Store
    // Enable SidebarMenu
    this.qsoUISidebarMenuService.setQSOSidebarMenuEnable(true);

    // Enable Notifications
    this.qsoNotificationService.setQSONotificationEnable(true);

    // Init Sensor Store
    const isSensorStoreReady = await this.qsoStreamingService.initSensorStore();
    const sensorsStore = this.qsoStreamingService.getSensorStore();

    // Get UIDS
    const qso_uids = sensorsStore.map(sensor => sensor.uid);

    // Init Sensor Streaming Service
    const isSensorStreamingReady = await this.qsoStreamingService.initSensorStreaming(qso_uids);
    const isStagesReady = await this.qsoUIStageService.initStagesByProjectID('QSO');

    // Set Init Stage
    this.qsoUIStageService.setStage(0);

    // Init Data.sensor
    this.DATA.sensors = Object.assign(JSON.parse(JSON.stringify(Object.assign(sensorsStore)) + ""));



    // Set Containers/Dashboard Layouts Using Sensor Store
    const qso_containers = await this.doSetupLayout(sensorsStore);
    this.UI.CONTAINERS = <any[]>qso_containers;

    if (window['debug-qso-main']) {
      console.warn('sensorsStore');
      console.warn(sensorsStore);

      console.warn('qso_uids');
      console.warn(qso_uids);

      console.warn('this.UI.CONTAINERS');
      console.warn(this.UI.CONTAINERS)
    }

    // Disable Spinner (Loader)
    this.UX.LOADED = true;

    // Subs to find container with locationId and then update data.
    this.SUBS.sensors = this.qsoStreamingService.syncSensorStream().subscribe(sensor => {



      if (sensor['location']) {

        const locationId_layout = sensor['location'].id;
        const containers_layout = this.UI.CONTAINERS;

        const sensor_layout = getSensorLayout(containers_layout, locationId_layout);
        const sensor_layout_container = sensor_layout.container;
        const sensor_layout_item = sensor_layout.item;


        this.UI.CONTAINERS[sensor_layout_container].items[sensor_layout_item]['location'] = sensor['location'].id;
        this.UI.CONTAINERS[sensor_layout_container].items[sensor_layout_item]['device'] = sensor;

        if (window['debug-qso-main']) {
          console.warn('-----------------------');
          console.warn('sensor')
          console.warn(sensor)
          console.warn('sensor_layout')
          console.warn(sensor_layout)
          console.warn('this.UI.CONTAINERS')
          console.warn(this.UI.CONTAINERS)
          console.warn('-----------------------');
        }
      }
    });
  }

  ngOnDestroy() {
    try { this.SUBS.dragula.unsubscribe(); } catch (e) { }
    try { this.dragulaService.destroy('DRAG_CONTAINERS'); } catch (e) { }
  }


  initDragula() {

    this.dragulaService.createGroup('DRAG_CONTAINERS', {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.classList.contains('fa-bars') && this.UX.ENABLE
    });

    this.SUBS.dragula.add(this.dragulaService.drag('DRAG_CONTROLLERS')
      .subscribe(value => {
        this.onDragController(value);
      })
    );

    this.SUBS.dragula.add(this.dragulaService.drop('DRAG_CONTROLLERS')
      .subscribe(value => {
        this.onDropController(value);
      })
    );

  }


  async doSetupLayout(sensorsStore) {

    return new Promise(async (resolve, reject) => {

      const uiProjectId = JSON.parse(localStorage.getItem('currentLocation')).projectId;
      const uiContainers = this.UI.CONTAINERS;
      const uiStages = await this.qsoService.getDashboardStages(uiProjectId);
      const devices = sensorsStore;

      for (let k = 0; k < uiContainers.length; k++) {
        uiContainers[k].name = uiStages[k];
      }

      const devices_without_qso_layout = get_devices_without_qso_layout(devices);
      const devices_with_qso_layout_repeated_no_repeated = get_devices_with_qso_layout(devices);
      const devices_with_qso_layout_no_repeat = devices_with_qso_layout_repeated_no_repeated.no_repeated;
      const devices_with_qso_layout_repeated = devices_with_qso_layout_repeated_no_repeated.repeated;

      devices_with_qso_layout_no_repeat.map((device, index) => {
        uiContainers[device.layout.containerIndex].items[device.layout.itemIndex] = {
          location: device.location.id,
          device: device
        };
      });

      devices_with_qso_layout_repeated.map((device, index) => {
        const _position = getAvailablePostion(this.UI, device, index);
        uiContainers[_position.column].items[_position.row] = {
          location: device.location.id,
          device: device
        };
      });

      devices_without_qso_layout.map((device, index) => {
        const _position = getAvailablePostion(this.UI, device, index);
        uiContainers[_position.column].items[_position.row] = {
          location: device.location.id,
          device: device
        };
      });

      resolve(uiContainers);

    });
  }


  onDragController(value) {
    this.qsoService.STREAM.pause = true;
  }

  onDropController(value) {

    setTimeout(() => {
      const id = value.target.querySelector('.kLocationId').textContent;
      const data_sensors = this.DATA.sensors;
      const data_sensor = data_sensors.filter(sensor => sensor.location.id === id)[0];
      const uiContainers = this.UI.CONTAINERS;
      const kLocationsIds = Array.from(document.querySelectorAll('.kLocationId'));
      const kParentsIds = <any>[];
      kLocationsIds.forEach(kLocationId => {

        const kParentId = kLocationId.parentElement;
        const _kLocationId = kParentId.querySelector('.kLocationId').textContent;
        const _kContainer = kParentId.querySelector('.kContainer').textContent;
        const _kItem = kParentId.querySelector('.kItem').textContent;

        kParentsIds.push({
          locationId: _kLocationId,
          container: _kContainer,
          item: _kItem
        });
      });

      kParentsIds.forEach(async layout_item => {

        const locationId = layout_item.locationId;
        const containerIndex = layout_item.container;
        const itemIndex = layout_item.item;
        await this.qsoService.patchLocationLayout(locationId, containerIndex, itemIndex);

      });

      this.qsoService.STREAM.pause = false;

    }, 500);
  }

  onFocusStageInput() {

  }

  onBlurStageInput() {
    const news_stages = this.UI.CONTAINERS.map(container => container.name);
    this.qsoService.patchContainerName(news_stages).then(() => { });
  }



}

