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


/*


// ------------------------------------------------------------------- //
// --- Imports Angular Resources                                       //
// ------------------------------------------------------------------- //
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
// ------------------------------------------------------------------- //


// ------------------------------------------------------------------- //
// --- Imports App's Resources                                         //
// ------------------------------------------------------------------- //
import { QSOService } from "../qso.service";
// ------------------------------------------------------------------- //


// ------------------------------------------------------------------- //
// --- Imports Vendors Resources                                       //
// ------------------------------------------------------------------- //
import { DragulaService } from "ng2-dragula";
// ------------------------------------------------------------------- //







// ------------------------------------------------------------------- //
// --- Component Definition                                            //
// ------------------------------------------------------------------- //
@Component({
  selector: "app-qso-maindashboard",
  templateUrl: "./qso-maindashboard.component.html",
  styleUrls: ["./qso-maindashboard.component.less"]
})
// ------------------------------------------------------------------- //




// ------------------------------------------------------------------- //
// --- Main Component Class                                            //
// ------------------------------------------------------------------- //
export class QsoMainDashboardComponent implements OnInit {


  // Properties :: Subscriptions
  public subDevice = new Subscription();
  public subDragula = new Subscription();


  // Properties :: UI/UX
  public UI = {
    COLUMNS: 4,
    ROWS: 10,
    CONTAINERS: [
      {
        name: "STAGE 1",
        items: [
          { uid: 910, device: {} }
        ]
      },
      {
        name: "STAGE 2",
        items: [
          { uid: 920, device: {} }
        ]
      },
      {
        name: "STAGE 3",
        items: [
          { uid: 930, device: {} }
        ]
      },
      {
        name: "STAGE 4",
        items: [
          { uid: 940, device: {} }
        ]
      }
    ]
  };
  public UX = {
    LOADED: true,
    TIMERS: {
      INTERVAL: {},
      TIME: 5000 // 5 seconds
    },
    SYNC: true
  };


  // Properties :: DRAGULA
  public DRAG_CONTROLLERS = "DRAG_CONTROLLERS";
  public DRAG_CONTAINERS = "DRAG_CONTAINERS";



  // Component Constructor
  constructor(public dragulaService: DragulaService,public qsoService: QSOService) {
    this.initDragula();
  }







  async ngOnInit() {

    let onInit,onGetDevices,onGetSettings,onGetData,onSetDevice,onUpdate,onDestroy;
    let vDevices, oDevices;
    let self = this;

    onInit = await this.qsoService.onDeviceInit();
    onGetDevices = await this.qsoService.onGetDevices(onInit);

    this.setContainers(onGetDevices);

    onGetSettings = await this.qsoService.onGetAnalogSettings(onGetDevices);
    vDevices = await this.qsoService.onSetData(onGetSettings);

    var uids = onGetSettings.map(x => "QSO" + x.uid);
    this.qsoService.openStreaming(uids, "sensor");

    this.subDevice = this.qsoService.getDevices().subscribe( devices => {
      this.devicesToContainers(devices);
      this.UX.LOADED = true;
    });

  }




  async ngOnDestroy() {
    try{this.dragulaService.destroy("DRAG_CONTAINERS");}catch(e){}
    try{this.qsoService.closeStreaming();}catch(e){}
    try{this.subDevice.unsubscribe();}catch(e){}
  }






  devicesToContainers(devices) {
    var uiContainers = this.UI.CONTAINERS;

    for (let k = 0; k < uiContainers.length; k++) {
      let kContainer = uiContainers[k].items;

      for (let j = 0; j < kContainer.length; j++) {
        let jItem = kContainer[j];
        var jUID = jItem.uid;

        var nDevice = devices.findIndex(function(device) {
          return device.uid == jUID;
        });

        uiContainers[k].items[j].device = devices[nDevice];
      }
    }

    this.UI.CONTAINERS = uiContainers;

    return true;
  }

  setContainers(devices){
    var N = devices.length;
    var NperContainer = Math.floor(N/4);

    var N1 = (N - 4*NperContainer) + NperContainer;
    var N2 = NperContainer;
    var N3 = NperContainer;
    var N4 = NperContainer;

    this.UI.CONTAINERS[0].items = devices.slice(0, N1).map( dev => {
      return {
        uid : dev.uid,
        device : dev,
      }
    });
    this.UI.CONTAINERS[1].items = devices.slice(N1 , N1 + N2).map( dev => {
      return {
        uid : dev.uid,
        device : dev,
      }
    });
    this.UI.CONTAINERS[2].items = devices.slice(N1 + N2  , N1 + N2 + N3).map( dev => {
      return {
        uid : dev.uid,
        device : dev,
      }
    });
    this.UI.CONTAINERS[3].items = devices.slice(N1 + N2 + N3 ,N1 + N2 + N3 + N4).map( dev => {
      return {
        uid : dev.uid,
        device : dev,
      }
    });


  }

  initDragula() {
    this.dragulaService.createGroup("DRAG_CONTAINERS", {
      direction: "horizontal",
      moves: (el, source, handle) => handle.classList.contains("fa-bars")
    });

    this.subDragula.add(
      this.dragulaService
        .drag("DRAG_CONTAINERS")
        .subscribe(({ name, el, source }) => {
          //this.UX.SYNC =false;
          //console.log("SYNC STOP");
        })
    );
    this.subDragula.add(
      this.dragulaService
        .drop("DRAG_CONTAINERS")
        .subscribe(({ name, el, target, source, sibling }) => {
          //this.UX.SYNC = true;
          //console.log("SYNC RESTARTED");
        })
    );
  }
}

*/
