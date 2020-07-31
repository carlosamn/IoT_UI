import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';

import { ProjectsService } from '../projects.service';
import { CompaniesService } from '../../companies/companies.service';

declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
	public clientId;
	public project;
	public userData;
	public companies;

	constructor(private router: Router,
				private activeRoute: ActivatedRoute,
				private projectsService: ProjectsService,
				private sharedService: AppSharedService,
				private companiesService: CompaniesService,
				private authService: AuthenticationService) {
		//  Getting user data
		this.sharedService.currentCompany.subscribe(company => this.clientId = company);
		this.companies = [];
		this.project = {};
	}

	async ngOnInit() {
		$('.datepicker').datepicker({ dateFormat: 'yy-mm-dd' });
		this.userData = await this.authService.getUserData();
		this.getCompanies();
	}

	addProject() {
		this.project.clientId = this.clientId;
		this.projectsService.addProject(this.project).subscribe(project => {

      console.clear();
      console.log(project)
      let defaultLocation = {
        description: "default",
        projectId: project.id,
        uid: "NA",
        companyId: project.companyId,
        isLegacy: false,
        clientCode: project.clientId,
        dashboardPages: []
      };



      this.router.navigate(['../list'], { relativeTo: this.activeRoute });

			}, err => {
				//console.log(err);
			});
	}

	resetProjectData() {
		this.project = {};
	}

	getCompanies() {
		let options;
		if(this.userData.userType === 'webmaster') options = {};
		else options = { clientId: this.clientId };

		this.companiesService.getCompanies(options)
			.subscribe(companies => {
				this.companies = companies;
			}, err => {
				//console.log(err);
			});
	}

}
