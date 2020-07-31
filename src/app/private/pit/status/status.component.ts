import { Component, OnInit, Pipe } from '@angular/core';
import {PITService} from '../pit.services'
import {Helper} from '../helper/helper';
import {DevicesService} from '../../devices/devices.service'
import { forEach } from '@angular/router/src/utils/collection';
import * as  EventSource from   'eventsource'; 
import {AppSharedService} from '../../../app.shared-service'
import { LoadingService } from '../../shared/loading.service';
import { pipe } from 'rxjs';

declare var $:any;

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})


export class StatusComponent implements OnInit {

  public clientCode;
  public optimunRunTime;
  public AnalogInputs;
  public dataStatus;
  public optimization;
  public recModeSett;
  public afterFlowTs;
  public FlowOptimizationMode;
  public diffrencialPresure;
  public isPOSEnable;
  public uid;
  public displaymodal="none";
  public sensorList;
  public sensorArray=[];
  public RxjsStreamPitstatus;

   public STREAM={
    eventSource: <any>{}
}
  
  constructor(
    private PITService:PITService, 
    private helper:Helper, 
    private DevicesService:DevicesService,
    private appSharedService:AppSharedService,
    private LoadingService: LoadingService)
    
    
   { 
    this.dataStatus={};
    this.optimization;
  }

  async ngOnInit() {
   await this.PITService.currentSensorHeader.subscribe(data=>{
      console.log("sensor header on status page");
      console.log(data);
      this.sensorArray=data;
    })

   await this.PITService.currentAnalagInputs.subscribe(data=>{
      console.log("analog inputs on status page");
      console.log(data);
      this.sensorList=data;
    })

   
    let uid=this.PITService.dataRxjs(1);
    this.uid=uid;
    

    let currentLocation=localStorage.getItem("currentLocation");
    let uidJson=JSON.parse(currentLocation);
    this.clientCode=uidJson.clientCode

    if(uid==undefined){
      uid=uidJson.uid;
      this.uid=uidJson.uid;
      console.log("uidLocalStorage")
      console.log(uid)
    }
    this.PITService.getpitStatus(uid)
    .subscribe(data=>{
    
    
    
      console.log(data)
      this.helper.dataStatus(data,this.dataStatus);
      this.welldepth(data.wellDepth);

      let IOoptions=this.enableOptions(data)

      this.optimization=IOoptions.optimization;
      this.recModeSett=IOoptions.recModeSett;
      this.afterFlowTs=IOoptions.afterFlowTs;
      this.FlowOptimizationMode=IOoptions.FlowOptimizationMode;
      this.diffrencialPresure=IOoptions.diffrencialPresure;
      this.isPOSEnable=IOoptions.isPOSEnable;
      
    
     
          
    })

    await  this.analogInputs(uid);
    
      let dataJson;
      this.RxjsStreamPitstatus=this.PITService.currentWebStream.subscribe(data=>{
        
        console.log("PIT STATUS WEB STREAM");

        if(data.data.class=="PIT" && data.data.type=="STATUS"){

          console.log("live stream on status")
          console.log(data.data.eventData)

          dataJson=data.data.eventData

          this.helper.dataStatus(dataJson,this.dataStatus);
          this.welldepth(dataJson.wellDepth);
          
          let IOoptions=this.enableOptions(dataJson)
  
          this.optimization=IOoptions.optimization;
          this.AnalogInputs.recModeSett=IOoptions.recModeSett;
          this.afterFlowTs=IOoptions.afterFlowTs;
          this.FlowOptimizationMode=IOoptions.FlowOptimizationMode;
          this.diffrencialPresure=IOoptions.diffrencialPresure;
          
        }
   
      
    });
  }

  clearTotals(command){
    $('#sendClear').modal('show');

    this.PITService.update(this.uid,command)
    
    .subscribe(result=>{
      $('#sendClear').modal('hide');
      
      }, error=>{
        $('#sendClear').modal('hide');
        $('#deviceBusy').modal('show');
        setTimeout(()=>{$('#deviceBusy').modal('hide');},20000)
        });

   
  }

  public closeModal(){
    this.displaymodal="none";
  }

  ngOnDestroy() {
    //this.PITService.closeSensorStreaming();
    //this.STREAM.eventSource.close()
    this.RxjsStreamPitstatus.unsubscribe();
   }


public enableOptions(data){

  let optimization;
  let recModeSett;
  let afterFlowTs;
  let FlowOptimizationMode;
  let diffrencialPresure;
  let isPOSEnable;
  

  switch(data.optimizationMode){
    case true:
    optimization="Enable";
    break;
    case false:
    optimization="Disabled";
    break;

  }

  switch(data.isRecTimeAdjEnable){
    case true:
    recModeSett="Enable";
    break;
    case false:
    recModeSett="Disabled";
    break;

  }

    switch(data.isAfTimeAdjEnable){
    case true:
    afterFlowTs="Enable";
    break;
    case false:
    afterFlowTs="Disabled";
    break;

  }

  switch(data.isFlowOptModeEnable){
    case true:
    FlowOptimizationMode="Enable";
    break;
    case false:
    FlowOptimizationMode="Disabled";
    break;

  }

  switch(data.isStablePressModeEnable){
    case true:
    diffrencialPresure="Enable";
    break;
    case false:
    diffrencialPresure="Disabled";
    break;

  }

  switch(data.isPOSEnable){
    case true:
    isPOSEnable="Enable";
    break;
    case false:
    isPOSEnable="Disabled";
    break;

  }

  let result={optimization:optimization,recModeSett:recModeSett, afterFlowTs:afterFlowTs,
    FlowOptimizationMode:FlowOptimizationMode, diffrencialPresure:diffrencialPresure,isPOSEnable:isPOSEnable}

    return result;
}

public analogInputs(uid){
 this.DevicesService.getAnalogInputs(uid)
  .subscribe(data=>{
    this.AnalogInputs=data;
  })
}
  public welldepth(value){
    let optimization= this.helper.welldepth(value);
    
    this.optimunRunTime=optimization;
   }
}
