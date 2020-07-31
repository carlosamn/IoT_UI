import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Http, Response, Headers} from '@angular/http';
import { AppSharedService } from '../../app.shared-service';

@Component({
  selector: 'app-ohd',
  templateUrl: './ohd.component.html'
})
export class OhdComponent implements OnInit {
  
id:String;
clientID:String;
project:String;
dataClient:String;
userid:String;
cid:String;
projectid:Boolean=false;
controllerName:String='';
controllerUid:String='';
  
  constructor(private router:Router, private http:Http, private sharedservice: AppSharedService) {
   
    this.dash()

 
   }
   webmaster:Boolean;
   websysadmin:Boolean;
   websys:Boolean;
   userType:String=null;
    
   
   dash() {

    this.project = localStorage.getItem('project');
    this.userType = localStorage.getItem('userType');
    this.controllerName=localStorage.getItem('ControllerName');
   this.controllerUid=localStorage.getItem('ControllerUid');
    if(this.project=="Live Controller Demo"){this.projectid=true}

    if (this.userType === 'webmaster') {
      this.webmaster = true;
    }

    if (this.userType === 'webmaster' || this.userType === 'sysadmin' || this.userType === 'admin') {
      this.websysadmin = true;
    }

  }
  ngOnInit() {
  }

}