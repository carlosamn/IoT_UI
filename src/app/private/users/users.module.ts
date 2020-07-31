//  Core modules
import { NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { UsersPasswordComponent } from './users-password/users-password-form.component';
import { UsersCreateOrUpdateComponent } from './user-create-update/user-create-update.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { UsersMasterComponent } from './users-master/users-master.component';
import { UserInviteComponent } from './user-invite/user-invite.component';

import { UserCreateOrUpdate2Component } from './users-create-update2/users-create-update2.component';
//  Routes
import { usersRoutes } from './users.routes';

//  Services
import { UsersService } from './users.service';

// Third Party Modules
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  imports: [
    DataTablesModule,
    NgSelectModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RouterModule.forRoot(usersRoutes, { useHash: false })
  ],
  providers: [UsersService],
  exports: [],
  declarations: [UserCreateOrUpdate2Component, UsersPasswordComponent, UsersCreateOrUpdateComponent, UsersAdminComponent, UsersMasterComponent,  UserInviteComponent]
})
export class UsersModule { }
