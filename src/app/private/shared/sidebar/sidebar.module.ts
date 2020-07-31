//  Core modules
import { NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
//import { EtdDashboardComponent } from '../../../home/etd-dashboard/EtdDashboardComponent';
//import {MainListComponent} from './main-list/main-list.component'


//  Routes
import { SidebarRoutes } from './sidebar.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
    //,RouterModule.forRoot(SidebarRoutes, { useHash: false })
  ],
  providers: [],
  exports: [],
  declarations: []
})
export class SidebarModule { }
