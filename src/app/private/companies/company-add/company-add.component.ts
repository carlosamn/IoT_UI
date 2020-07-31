import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSharedService } from '../../../app.shared-service';
import { CompaniesService } from '../companies.service';
import { Subject } from 'rxjs';
import { ProjectsService } from '../../projects/projects.service';


@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.css']
})
export class CompanyAddComponent implements OnInit {
  public company;
  constructor(private companies: CompaniesService, 
              private router: Router,
              private activeRoute: ActivatedRoute,
              private project:ProjectsService,
              private sharedService: AppSharedService) {
    this.company = {};

    this.sharedService.currentCompany.subscribe(companyId => this.company.clientId = companyId);

  }

  public addCompany() {
    this.company.id = this.company.name;
    this.companies.addCompany(this.company).subscribe(result=> {
      this.router.navigate(['../list'], { relativeTo: this.activeRoute });
    });
  }
  ngOnInit() {}

}