//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { FL3GraphsComponent } from './fl3-graphs/fl3-graphs.component';
import { FL3ReportsComponent } from './fl3-reports/fl3-reports.component';
import { FL3SettingsComponent } from './fl3-settings/fl3-settings.component';
import { FL3OptionsComponent } from './fl3-options/fl3-options.component';
//import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';


//  Pipes
import { ShotStartPipe } from './fl3.pipe';

//  Routes
import { fl3Routes } from './fl3.routes';

//  Services
import { AlarmsService} from './../alarms/alarms.service';
import { FL3Service } from './fl3.service';
import { FL3SharedService } from './fl3-shared.service';

import { LoadingService } from '../shared/loading.service';
import { DevicesService } from '../devices/devices.service';
import { EtdService } from '../home/etd.service';
//import { ConfirmationDialogService } from '../../common/confirmation-dialog/confirmation-dialog.service';

//  Third Party Modules
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DndModule } from 'ng2-dnd';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    CommonModule,
    SweetAlert2Module,
    DndModule,
    RouterModule.forRoot(fl3Routes, { useHash: false })
  ],
  providers: [FL3Service, FL3SharedService, LoadingService, DevicesService, EtdService,AlarmsService],
  exports: [FL3OptionsComponent],
  declarations: [FL3GraphsComponent, FL3ReportsComponent, FL3SettingsComponent, FL3OptionsComponent, ShotStartPipe]
})
export class FL3Module { }
