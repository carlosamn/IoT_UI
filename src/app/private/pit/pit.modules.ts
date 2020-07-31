import '../../../polyfills';
//  Core modules
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {PitRoutes} from './pit.routes';
import {PITService} from './pit.services';
import {Helper} from './helper/helper'

import {MainComponent} from './main/main.component';
import {NotesComponent} from './notes/notes.component';
import {PitComponent} from './pit/pit.component';
import {SettingsComponent} from './settings/settings.component';
import {StatusComponent} from './status/status.component';
import {SensorHeaderComponent} from './sensor-header/sensor-header.component'
import {NgxMaskModule} from 'ngx-mask';
import {secondsToTimePipe} from './pipePit';
import {timeStamp} from './pipeTimeStamp';
//import {DialogContentComponent} from './dialog-content/dialog-content.component'

//  Third parties
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DndModule } from 'ng2-dnd';
//import {CdkTableModule} from '@angular/cdk/table';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
//import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
//import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';
/*import {
    
    MatButtonModule,
    MatDialogModule
  } from '@angular/material';*/


@NgModule({
imports:[

RouterModule.forRoot(PitRoutes,{useHash:false}),
//RouterModule.forRoot(PitRoutes, {onSameUrlNavigation: 'reload'}),
FormsModule,
CommonModule,
NgxMaskModule.forRoot(),
BrowserAnimationsModule,
FormsModule,
ReactiveFormsModule,
],
entryComponents:[],
declarations:[
    MainComponent,
    PitComponent,
    SettingsComponent,
    StatusComponent,
    SensorHeaderComponent,
    secondsToTimePipe,
    timeStamp,
    NotesComponent
    
    
],
bootstrap:[NotesComponent],
  
providers:[PITService,Helper
    //,{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
],

})
export class PitModule{}
//platformBrowserDynamic().bootstrapModule(PitComponent);