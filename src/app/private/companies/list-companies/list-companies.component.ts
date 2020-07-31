import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {CompaniesService} from '../companies.service';
import { AppSharedService } from '../../../app.shared-service';
import { Subject } from 'rxjs';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.css']
})

export class ListCompaniesComponent implements OnInit {
  public companyList;
  public compan;
  public activeIndex;
  public SUBS = {
    DtOptions: <any>{}
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private companies: CompaniesService, private services: AppSharedService) {

    this.companyList = [];
    this.compan = {};
}

  public deleteCompany(company, index) {
    if (confirm('Do you want to permanently delete  this Company?')) {
      this.companies.deleteCompanyById(company, index)
        .subscribe(device => {
          this.companyList.splice(index, 1);
        }, err => {
          //console.log('Something is wrong');
        });
    } else { return false; }
  }
  public activateIndex(index) {
    this.activeIndex = index;
  }

  public updateCompany(company) {
    this.companies.updateCompany(company.id, company)
      .subscribe(com => {
        this.activeIndex = undefined;
      }, err => {
        //console.log(err);
      });
  }
  ngOnInit() {

    this.SUBS.DtOptions = this.services.currentDtOptions.subscribe(options => this.dtOptions = options);
    this.companies.getCompanies()
    .subscribe(res => { this.companyList = res; this.dtTrigger.next(); });
  }
}
