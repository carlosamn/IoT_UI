import '../../../polyfills';
//  Core modules
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {PitRoutes} from './pit-2.routes';
import {Pit2Service} from './pit-2.services';
import { Pit2Component } from './pit-2.component'

import {MainComponent} from './main/main.component';
import {NotesComponent} from './notes/notes.component';
import {EfmComponent} from './efm/efm.component';
import {SettingsComponent} from './settings/settings.component';
import {StatusComponent} from './status/status.component';

@NgModule({
    imports:[
    
    RouterModule.forRoot(PitRoutes,{useHash:false}),
    //RouterModule.forRoot(PitRoutes, {onSameUrlNavigation: 'reload'}),
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ],
    entryComponents:[],
    declarations:[
        MainComponent,
        EfmComponent,
        SettingsComponent,
        StatusComponent,
        NotesComponent,
        Pit2Component
    ],
    bootstrap:[NotesComponent],
      
    providers:[Pit2Service
        //,{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
    ],
    
    })
    export class Pit2Module{}