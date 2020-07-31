import { Component, OnInit, NgZone } from '@angular/core';
import { PITService } from '../pit.services';
import { LoadingService } from '../../shared/loading.service';
import { async } from 'q';
import * as EventSource from 'eventsource';
import { Timestamp, Observable } from 'rxjs';
import { Helper } from '../helper/helper'
import { AppSharedService } from '../../../app.shared-service'

declare var $:any


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css', './main.component.scss']
})
export class MainComponent implements OnInit {
  public SUBS = {
    sensors: <any>{},
    location: <any>{},
    dragula: <any>{}
  };

  public STREAM = {
    eventSource: <any>{}
  }


  public zone: NgZone;
  public messages = new Array<string>();
  public status: number;
  public timeStamp;
  public mainPIT;
  public uid;
  public displaymodal = "none";
  public DATA;
  public displayMode;
  public RxjsStreamPitMain;

  constructor(public pitService: PITService, private LoadingService: LoadingService, private helper: Helper, private appSharedService: AppSharedService) {

    this.mainPIT = { pitlegacy: {} };
    this.DATA = {
    }

  }


  async ngOnInit() {

    let currentmode;
    let display;
    let uid;
    var dataJson: any;
    let currentLocation = localStorage.getItem("currentLocation");
    let uidJson = JSON.parse(currentLocation);
    uid = this.pitService.dataRxjs(1);
    this.uid = uid;
    console.log("uidReactive")
    console.log(uid)

    if (uid == undefined) {

      uid = uidJson.uid;
      this.uid = uid;
      console.log("uidLocalStorage")
      console.log(uid)
    }

    this.pitService.mainPIT(uid)
      .subscribe(data => {
        console.log("error")

        this.DATA = data;

        if (data.currentMode != undefined && data.currentModeTime != undefined) {
          this.displayMode = this.helper.currentMode(data.currentMode)
        }
      });

    this.RxjsStreamPitMain=this.pitService.currentWebStream.subscribe(data => {


      console.log("live stream on main")

      if(data.data.class=="PIT" && data.data.type=="MAIN"){

          dataJson = data.data.eventData;
          console.log(dataJson)
          currentmode = dataJson.currentMode;
          display = this.helper.currentMode(currentmode);

          if (display != undefined && dataJson.currentModeTime != undefined) {
            this.displayMode = display;
          }

          this.DATA = dataJson;
          this.DATA.packetTimestamp2.replace(/-/g, '/')
      }
    })


  }
  /*convertUTCDateTOLocal(date){
    let localDate= new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return localDate;
  }*/

  public update(command) {
    this.LoadingService.show();
    this.pitService.update(this.uid, command)
      .subscribe(data => {
        if (data.poll.status == "success") {
          this.LoadingService.hide();
        }

      }, error => {
        if (error.status == "500" || error.status == "523" || error.status == '404' || error.status == '400') {
          this.LoadingService.hide();
          $('#deviceBusy').modal('show');
          setTimeout(()=>{$('#deviceBusy').modal('hide');},30000)
          //this.displaymodal = "block";
        }
      })
  }

  public closeModal() {
    this.displaymodal = "none";
  }
  ngOnDestroy() {
    //this.pitService.closeSensorStreaming();
    this.RxjsStreamPitMain.unsubscribe();
  }

}
