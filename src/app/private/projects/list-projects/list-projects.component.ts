import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSharedService } from '../../../app.shared-service';
import { AuthenticationService } from '../../../public/authentication/authentication.service';

import { ProjectsService } from '../projects.service';
import {CompaniesService} from '../../companies/companies.service';

import { Subject } from 'rxjs';
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {
  public activeIndex;
  public projects;
  public companiesList;
  public userData;
  
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<any> = new Subject();

  constructor(private projectsService: ProjectsService, 
              private appService: AppSharedService, 
              private companies:CompaniesService, 
              private authService: AuthenticationService) {

    this.companiesList = [];
  }

  async ngOnInit() {
    $('.datepicker').datepicker({ dateFormat: 'yy-mm-dd' });
		this.userData = await this.authService.getUserData();
    this.appService.currentDtOptions.subscribe(options => this.dtOptions = options);
    this.getProjects();
    this.getCompanies();
    
  }
   getCompanies(){
    this.companies.getCompanies()
    .subscribe(result=>{this.companiesList=result;})
  }

  getProjects() {
    this.projectsService.getProjects()
      .subscribe(projects => {
        console.log('PROJECTS');
        console.log(projects);
        this.projects = projects;
        this.dtTrigger.next();
        //console.log(this.projects);
      }, err => {
        //console.error(err);
      });
  }

  activateIndex(index) {
    this.activeIndex = index;
  }

  updateProject(project) {
    this.projectsService.updateProject(project.id, project)
      .subscribe(project => {
        this.activeIndex = undefined;
      }, err => {
        //console.log(err);
      });
  }

  deleteProject(projectId, index) {
   if(confirm("Do you want to permanently delete  this Project?")){
    this.projectsService.deleteProjectById(projectId)
      .subscribe(res => {
        this.projects.splice(index, 1);
      }, err => {
        //console.log(err);
      });
    }
    else return false;
  }

}