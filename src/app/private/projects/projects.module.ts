//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { AddProjectComponent } from './add-project/add-project.component';

//  Routes
import { projectsRoutes } from './projects.routes';

//  Services
import { ProjectsService } from './projects.service';
import { ClientsService } from '../clients/clients.service';
import { AlarmsService } from '../alarms/alarms.service';

import { AlarmsCountByProject } from "./lib/pipes/alarms.count.pipe"; // import our pipe here


//  Third party module
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    DataTablesModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(projectsRoutes, { useHash: false })
  ],
  providers: [ProjectsService, ClientsService, AlarmsService],
  exports: [],
  declarations: [ChooseProjectComponent, ListProjectsComponent, AddProjectComponent, AlarmsCountByProject]
})
export class ProjectsModule { }
