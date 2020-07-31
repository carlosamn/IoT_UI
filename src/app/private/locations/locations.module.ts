//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

//  Components
import { LocationsAddEditComponent } from './locations-add-edit/locations-add-edit.component';
import { LocationsSetupComponent } from './locations-setup/locations-setup.component';
import { LocationsListComponent } from './locations-list/locations-list.component';
import { AlertComponent } from './locations-add-edit/_directives/index'
import { AlertService } from './locations-add-edit/_services/index'
import { HomeComponent } from './locations-add-edit/home/index'
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

//  Routes
import { LocationsRoutes } from './locations.routes';

//  Services
import { LocationsService } from './locations.service';

//  Third party module
import { DataTablesModule } from 'angular-datatables';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { LaInputMaskModule } from 'la-input-mask';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  imports: [
    BrowserModule,
    DataTablesModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    LaInputMaskModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    SweetAlert2Module,
    NgxMaskModule.forRoot(),
    RouterModule.forRoot(LocationsRoutes, { useHash: false })
  ],
  providers: [LocationsService,AlertService],
  exports: [],
  declarations: [LocationsAddEditComponent,LocationsSetupComponent,LocationsListComponent,HomeComponent,AlertComponent]
})

export class LocationsModule { }
