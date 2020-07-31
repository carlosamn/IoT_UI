import { Component, OnInit, Inject,ViewChild, ElementRef } from '@angular/core';
import { PITService } from '../pit.services';
import {AppSharedService} from '../../../app.shared-service';
import * as  JSZip from 'jszip';
import * as saveAs from 'file-saver';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../../shared/loading.service';
import * as EventSource from 'eventsource';

declare var $:any;
//import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
//import {MatDialog,MatDialogRef,MatDialogConfig} from '@angular/material';
//import {MAT_DIALOG_DATA} from "@angular/material";
//import {DialogContentComponent} from "../dialog-content/dialog-content.component"

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  providers: [DatePipe]
})


export class NotesComponent implements OnInit {
  public display="none";
  public displaymodal="none";
  public notesPit = [];
  public checkFile = [];
  public files = [];
  public uid;
  public packettimestamp=" ";
  title = "Select an File!";
  sumadre:string;
  name: string;
  public STREAM={
    eventSource: <any>{}
}
  public RxjsStreamPitNotes;
  constructor(private pitservice: PITService, private datePipe: DatePipe, private LoadingService:LoadingService,
   private sharedService:AppSharedService
    ) {
  }



   async ngOnInit() {
 
       let dataJson;
       this.RxjsStreamPitNotes = this.pitservice.currentWebStream.subscribe(data=>{
          console.log("live stream on notes")
          if(data.data.class=="PIT" && data.data.type=="NOTE"){

              dataJson=data.data.eventData;
              console.log(dataJson)
              this.notesPit.unshift(dataJson);
          }
        })
    
    
      this.getPitNotes();
  }

  ngOnDestroy() {
    //this.pitservice.closeSensorStreaming();
    //this.STREAM.eventSource.close();
    this.RxjsStreamPitNotes.unsubscribe();
   }

  public update(command){
    this.LoadingService.show();
    //this.display="block";
    this.pitservice.update(this.uid,command)
    .subscribe(data=>{
      if(data.poll.status=="success"){
        //this.display="none";
        this.LoadingService.hide();
      }
      

    }, error=>{
        this.LoadingService.hide();
        $('#deviceBusy').modal('show');
        setTimeout(()=>{$('#deviceBusy').modal('hide');},30000)
    })
  } 

  public closeModal(){
   this.display="none";
   this.displaymodal="none";
 }

  public getPitNotes() {
    let projectId;
    let locationId;

    let localStorag = localStorage.getItem("currentLocation");
    let object = JSON.parse(localStorag);

    let uid=this.pitservice.dataRxjs(1);
    if(uid=!undefined){
      this.uid=uid
    }else{
      this.uid=object.uid
    }
    projectId = object.projectId;
    let locationIdObj = object.locationId;
    let locationSingle=localStorage.getItem("locationId");

    projectId = object.projectId;
    if(!locationSingle)
    {
     locationId=locationIdObj;
    }
    else{
     locationId=locationSingle;
    }
    
    
   
      this.pitservice.getPitNotes(projectId,locationId)
        .subscribe(data => {
          for(let index=0;index<data.length;index++){
            this.notesPit.unshift(data[index])
          }
          console.log(data)
          for (var i in data) {
            this.checkFile.push({ index: i, value: false, content: "" });
          }
        })

      }

 

  public downloadView() {

    let cont = 0;
    for (let i = 0; i < this.checkFile.length; i++) {

      if (this.checkFile[i].value) {
        cont = cont + 1;
      }
    }
    if (cont == 1) {
      for (let i = 0; i < this.checkFile.length; i++) {

        if (this.checkFile[i].value) {
          document.body.appendChild(this.checkFile[i].content);
          this.checkFile[i].content.click();
          document.body.removeChild(this.checkFile[i].content);
          URL.revokeObjectURL(this.checkFile[i].content.href);
        }
      }

    }
    else if (cont == 0) {
     /* this.openDialog();*/
     //alert("Select an File!");
     this.display="block";
    }
    else {
      let myDate = Date();
      let currentDate = this.datePipe.transform(myDate, 'yyyy-MM-dd');
      let string = currentDate.toString();

      var zip = new JSZip();
      for (let i = 0; i < this.checkFile.length; i++)
        if (this.checkFile[i].value) {
          {
            zip.file(this.checkFile[i].name, this.checkFile[i].text);
          }
        }
      zip.generateAsync({ type: "blob" })
        .then(function (content) {
          saveAs(content, "PitNotes" + string + ".zip");
          URL.revokeObjectURL(content.href);
        });
    }

  }

  public download(text, name, type, i) {
    var blob = new Blob([text], { type: type });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;

    if (this.checkFile[i].value == false || this.checkFile[i].value == undefined) {
      this.checkFile[i].value = true;
      this.checkFile[i].content = a;
      this.checkFile[i].text = text;
      this.checkFile[i].name = name;
      this.checkFile[i].type = type;
    } else {
      this.checkFile[i].value = false;
    }
  }
}


