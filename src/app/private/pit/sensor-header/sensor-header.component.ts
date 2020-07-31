import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AppSharedService} from '../../../app.shared-service';
import {FL3SharedService} from '../../fl3/fl3-shared.service'; 
import { EtdService } from '../../home/etd.service';
import { ISubscription } from "rxjs/Subscription";
import {PITService} from '../pit.services'
import {Helper} from '../helper/helper'
import {secondsToTimePipe} from '../../pit/pipePit'
import * as  EventSource from   'eventsource'; 
import { timeInterval } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-sensor-header',
  templateUrl: './sensor-header.component.html',
  styleUrls: ['./sensor-header.component.css']
})
export class SensorHeaderComponent implements OnInit {
  public url;
  public auxSensors;
  public lastUpdate="";
  public selectedLocation;
  public controller;
  public activedSensors=0;
  public sensors;
  public pitPacket8;
  public sensorPacket8=[];
  public comminUIDfromLS=true;

  public SUBS = {
    location: <any>{},
    isCollar : <any>{}
  };

  public STREAM={
    source:<any>{}
  }

  
  

  public DATA;
  //public Sensors=[];
  public Sensors;
  public uid;
  public enable;
  public packetTimestamp;
  public timeStamp;

  private sensorsSubscription: ISubscription;
  constructor(private router: Router, private sharedService: AppSharedService,
    private Fl3Service:FL3SharedService, private etdService:EtdService,private pitService:PITService,
    private helper:Helper) {
    this.sensors=[];
    this.pitPacket8={pitlegacy:{}};
    this.enable;

  }
  
  
  

  async ngOnInit() {
   
      let SensorsTest;
      let Cuid;
      let clientCode;
    
      let currentLocation=localStorage.getItem("currentLocation");
      let uidJson=JSON.parse(currentLocation);

      Cuid=this.pitService.dataRxjs(1);
      console.log("uidReactive")
      console.log(Cuid)
      
      if(Cuid==undefined){
        clientCode=uidJson.clientCode;
        Cuid=uidJson.uid;
        console.log("uidLocalStorage")
        console.log(Cuid)
      }


     await this.pitService.getAnalogInputs(Cuid)
      .subscribe(data=>{
        if(data.status=="404"){
          console.log("model doesn´t exist")
        }
        console.log("analog inputs")
        console.log(data)
        this.pitService.setCurrentAnalagInputs(data);
        this.Sensors=data;
        SensorsTest=data;
        /*console.log("sensor header")
         console.log(SensorsTest);*/

          this.pitService.getSensorHeader(Cuid)
          .subscribe(values=>{
          console.log("sensor header")
          console.log(values);

          

           /* Update here  throug a service the units, names of analog inputs*/ 
         for(let i in values.sensordata){
          console.log("sensor header values")
          let timeStamp2=values.sensordata[i].packetTimestamp
          this.timeStamp=timeStamp2.replace(/-/g,'/')
          let c=0
          let sensorArray=[]
          for(let index in values.sensordata[i].sensors){
            console.log("values")
            SensorsTest[c].value=values.sensordata[i].sensors[index]
            console.log(SensorsTest[c].value)
            sensorArray.push(SensorsTest[c].value)
            c=c+1;
            
          }
          console.log("sensors values")
          console.log(sensorArray)
          
          this.pitService.setCurrentSensorHeader(sensorArray);


          
          

          /* Update here  throug a service the values of sensors*/ 
        }
     })
      })

      
      this.pitService.initSensorStreaming();

   
      let uri=`${this.pitService.path.sensors}${clientCode}${Cuid}`
      this.STREAM.source = new EventSource(uri);
      this.STREAM.source.onopen =  event => {
      };
      this.STREAM.source.onerror = event => {
      };
      this.STREAM.source.addEventListener("sensor", event => {
        let dataJson = JSON.parse(event.data);
         let array=event.data.split(',');
         let sensorValue=8;

         let dateTime={
            year : "2019",
            month : array[2],
            day : array[3],
            seconds : array[6]
          }

          let currentTime= new Date();
          let CurrentHour=currentTime.getHours();
          let CurrentMinuntes=currentTime.getMinutes();
          let CurrentSeconds = currentTime.getSeconds();

          let currentLocaleString = new Date().toLocaleString();
          let timeStam=`${currentLocaleString}`
          let timeStamp2=timeStam.toString()
          this.timeStamp=timeStamp2.replace(/-/g,'/')
         // this.timeStamp=`${dateTime.year}-${dateTime.month}-${dateTime.day} ${CurrentHour}:${CurrentMinuntes}:${dateTime.seconds}`
        
         if(dataJson.packet[0] == '8'){
           this.Sensors[0].value=array[8]
           this.Sensors[1].value=array[9]
           this.Sensors[2].value=array[12]
           this.Sensors[3].value=array[13]
          /*for(let i=0;i<this.Sensors.length;i++){
            this.Sensors[i].value=array[sensorValue]
            sensorValue=sensorValue+1
         
          }*/
        }
      });
    

      this.url=window.location.href;
      if(this.url.includes("/pit/"))
      {
       this.url=true;
      }else 
      {
        this.url=false;
      
      }


    }

    ngOnDestroy() {
      this.pitService.closeSensorStreaming();
      //this.STREAM.source.close();
     }
    

    navigate(route) {
    
      let currentProject = this.router.url.split('/')[1];
      let fullRoute = [currentProject];
      let parsedRoute = route.split('/');
    
      parsedRoute.map(route => {
        fullRoute.push(route);
      });
    
      this.router.navigate(fullRoute);
    
    } 

}

