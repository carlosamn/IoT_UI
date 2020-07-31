//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { LogsDataComponent } from './log-data/log-data.component';
//  Routes
import { logsRoutes } from './logs.routes';

//  Services
import { LogsService } from './logs.service';

import { ProjectsService } from '../projects/projects.service';
import { DevicesService } from '../devices/devices.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  imports: [
    DataTablesModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    RouterModule.forRoot(logsRoutes, { useHash: false })
  ],
  providers: [LogsService, ProjectsService, DevicesService],
  exports: [],
  declarations: [LogsDataComponent]
})

export class LogsModule { }
