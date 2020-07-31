import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { ListClientsComponent } from './list-clients/list-clients.component';
import { ClientAddOrEditComponent } from './client-add-edit/client-add-edit.component';

//  Routes
import { clientsRoutes } from './clients.routes';

//  Services
import { ClientsService } from './clients.service';

//  Third party module
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  imports: [
  	DataTablesModule,
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(clientsRoutes, { useHash: false })
  ],
  providers: [ClientsService],
  exports: [],
  declarations: [ListClientsComponent, ClientAddOrEditComponent]
})
export class ClientsModule { }