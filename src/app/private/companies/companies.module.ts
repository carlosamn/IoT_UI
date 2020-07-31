import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { CompanyAddComponent } from './company-add/company-add.component';
import { ListCompaniesComponent } from './list-companies/list-companies.component';

//  Routes
import { companiesRoutes } from './companies.routes';

//  Services
import { CompaniesService } from './companies.service';
//third party
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    DataTablesModule,
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(companiesRoutes, { useHash: false })
  ],
  providers: [CompaniesService],
  exports: [],
  declarations: [CompanyAddComponent, ListCompaniesComponent]
})
export class CompaniesModule { }