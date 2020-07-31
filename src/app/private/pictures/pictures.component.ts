import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Http, Response, Headers, RequestOptions} from '@angular/http'
import {Injectable} from '@angular/core'
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html'
})
export class PicturesComponent implements OnInit {



data:any=null;
id:String;
clientID:String;
project:String;
dataClient:String;
userid:String;
cid:String;
projectid:Boolean=false;
controllerName:String='';
controllerUid:String='';


  constructor() {

  this.cid =localStorage.getItem('Companyproject'),
  this.dash();



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
   public logout(){
    this.id=localStorage.getItem('id');
    localStorage.removeItem('id');


  }

  ngOnInit() {
  }

}
