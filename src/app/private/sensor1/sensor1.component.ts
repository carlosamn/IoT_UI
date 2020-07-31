import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Http, Response, Headers} from '@angular/http';
import { AppSharedService } from '../../app.shared-service';


@Component({
  selector: 'app-sensor1',
  templateUrl: './sensor1.component.html'
})
export class Sensor1Component implements OnInit {

  
dataProject:any=null;
ut:String;
dataCompanies:any=null;
active:String;
utc:any;
clientid:String;
project:String
companyId:String;
cid:string;
isactive:Boolean=true;
webmaster:Boolean;
  websysadmin:Boolean;
  websys:Boolean;
  userType:String=null;
  projectid:Boolean=false;
  controllerName:String='';
controllerUid:String='';
  constructor() {
  
  
  this.cid =localStorage.getItem('Companyproject'),
  this.dash()
  
  
}
public dash(){
  this.userType=localStorage.getItem("userType");
  this.project=localStorage.getItem('project');
  this.controllerName=localStorage.getItem('ControllerName');
   this.controllerUid=localStorage.getItem('ControllerUid');
  if(this.project=="Live Controller Demo"){this.projectid=true}
  
  if(this.userType=="webmaster"){
  this.webmaster=true;
  }
  if (this.userType=="webmaster" || this.userType=="sysadmin" || this.userType=="admin"){
    this.websysadmin=true;
  }
  if (this.userType=="webmaster" || this.userType=="sysadmin" ){
      this.websys=true;
    }
  }
  public logout(){
    let userId = localStorage.getItem('id');
    localStorage.removeItem('id');
    
  }

  ngOnInit() {
  }

 

}

