import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { ClientsService } from '../../clients/clients.service';
import { ProjectsService } from '../../projects/projects.service';
import { DevicesService } from '../../devices/devices.service';
import { LocationsService } from '../../locations/locations.service';
import { CompaniesService } from '../../companies/companies.service';
import { AppSharedService } from '../../../app.shared-service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { LoadingService } from '../../shared/loading.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-create-update2',
  templateUrl: './users-create-update2.component.html'
})

export class UserCreateOrUpdate2Component implements OnInit {
  public user;
  public type;
  public companies;
  public projectsArray = [];
  public projects;
  public devices;
  public locations;
  public redirectUrl;
  public projectQty = 1;
  public isUpdate = false;
  public allProjectSelected = false;
  public swalOptions;
  public projectsSelecteds;
  public devicesSelecteds;
  public locationsSelecteds;
  public addSelect;

  public profileEdition: boolean;
  public selectd;
  public CompanyOnly=false;
  public All=false;
  @ViewChild('errors') private errors: SwalComponent;

  constructor(private loading: LoadingService,
              private usersService: UsersService,
              private router: Router,
              private sharedService: AppSharedService,
              private clientsService: ClientsService,
              private locationsService: LocationsService,
              private activeRoute: ActivatedRoute,
              private projectsService: ProjectsService,
              private devicesService: DevicesService,
              private companiesServices: CompaniesService) {


    this.swalOptions = {};
    this.user = {};
    this.user.isActive = true;
    this.companies = [];
    this.projects = [];
    this.devices = [];
    this.locations = [];
    this.projectsSelecteds=[];
    this.devicesSelecteds=[];
    this.locationsSelecteds=[];
    this.sharedService.currentCompany.subscribe(companyId => this.user.clientId = companyId);

    this.addSelect = true;

    //  this.profileEdition verifies if the route has accesed from "change profile user";
    this.activeRoute.queryParams.subscribe(params => { if (params.profileEdit) this.profileEdition = true });
  }

  ngOnInit() {
    //  Verificamos el tipo -> /invite /master /sysadmin
    this.type = this.activeRoute.snapshot.params.userType;

    //  Para update, cogemos el parametro userId
    let userId = this.activeRoute.snapshot.params.userId;

    //  Si existe el usuario, entonces correremos lo siguiente
    if(userId) {
      // 1.- Diremos que es "edit / update"
      this.isUpdate = true;
      //  2.- Buscamos al usuario por id para obtener sus datos
      this.usersService.getUserById(userId).subscribe(user => {
        this.user = user;
        if(this.user.projectIds.length > 0) this.addSelect = false
        else this.addSelect = true;
        console.log('veamos las locations');
        console.log(this.user);
        for(let i = 0; i < this.user.locationIds.length; i++ ){

          this.projectsArray.push({
            projectId:this.user.locationIds[i].projectId,
            locations:this.user.locationIds[i].locationId
          });
        }
        console.log('projects array');
        console.log(this.projectsArray);
      });
    } else { 
        this.addSelect = false;
    }


       //  Condicionales por tipo de parametro en ruta (invite, master, admin)
    switch(this.type) {
      case 'master':
        //  Creamos ruta de redireccion
        if(this.isUpdate && this.profileEdition == true) this.redirectUrl = '../../../../dashboard';
        else if(this.isUpdate) this.redirectUrl = '../../../master';
        else this.redirectUrl = '../../master';
        this.user.userType = 'webmaster';
        this.user.userRealm = 'client';
      break;
      case 'admin':
        //  Creamos ruta de redireccion
        if(this.isUpdate && this.profileEdition == true) this.redirectUrl = '../../../../dashboard';
        else if(this.isUpdate) this.redirectUrl = '../../../admin';
        else this.redirectUrl = '../../admin';
        this.user.userType = 'sysadmin';
        this.user.userRealm = 'client';
      break;
        //  Creamos ruta de redireccion
      case 'invite':
        this.processInviteValidations();
      break;
    }
  }

  private processInviteValidations() {
    //  Validation for invited user
    if(this.isUpdate && this.profileEdition == true) this.redirectUrl = '../../../../dashboard';
    else if(this.isUpdate) this.redirectUrl = '../../../invite';
    else this.redirectUrl = '../../invite';

    this.user.userRealm = 'customer';

    //  Calling the companies for API
    this.companiesServices.getCompanies().subscribe(companies => this.companies = companies);

    //  Calling all projects from company
    this.projectsService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
        //  Creating associative array from the multiple users (+)

      });
      if(this.addSelect==false)
        this.projectsArray.push({ projects: this.projects, devices: [] });
  }


  public selectedProject(project, index) {
    //  Verifying if the user has chosen "all" and
    if(project && project !== 'all') {
      //  Flag for "all projects selected"
      this.allProjectSelected = false;
      //  If a single project is selected, we will search about all controllers for this project
      this.devicesService.getDevices({ projectId: project })
        .subscribe(devices => {
          //  We search the index selected, then we add to projectsArray index the devices,
          //  This devices will be shown in the page per each (line->index)
          devices.unshift('All','Company Only');
          this.devices = devices;
          //the devices selected will sotore here
          this.projectsArray[index].selectedDevices = [];
          //all devices availables
          this.projectsArray[index].devices = devices;
          //the project selected
          this.projectsArray[index].projectId = project;
        }, err => {
          //console.log(err);
        });
    } else if (project === 'all') {
      this.allProjectSelected = true;
      this.devicesService.getAllControllers()
        .subscribe(devices => {
          //  If we chosen (all projects), we request for all controllers for every project
          //  After this we set all the controllers in each device
          this.devices = devices;
          this.projectsArray[index].selectedDevices = [];
          this.projectsArray[index].devices = devices;
          this.projectsArray[index].projectId = project;
        }, err => {
          //console.error(err);
        });
      // Do stuff
    } else {
      this.projectsArray[index].devices = [];
      this.projectsArray[index].projectId = '';
      this.projectsArray[index].selectedDevices = [];
    }
  }


  public selectedProject2(project, index) {
    //  Verifying if the user has chosen "all" and
    if(project && project !== 'all') {
      //  Flag for "all projects selected"
      this.allProjectSelected = false;
      //  If a single project is selected, we will search about all controllers for this project
      this.locationsService.getLocationsAsObs({ projectId: project })
        .subscribe(locations => {
          //  We search the index selected, then we add to projectsArray index the devices,
          //  This devices will be shown in the page per each (line->index)
          locations.unshift('All','Company Only');
          this.locations = locations;
          //the devices selected will sotore here
          this.projectsArray[index].selectedLocations = [];
          //all devices availables
          this.projectsArray[index].locations = locations;
          //the project selected
          this.projectsArray[index].projectId = project;
        }, err => {
          //console.log(err);
        });
    } else if (project === 'all') {
      this.allProjectSelected = true;
      this.locationsService.getAllLocationsAsObs()
        .subscribe(locations => {
          //  If we chosen (all projects), we request for all controllers for every project
          //  After this we set all the controllers in each device
          this.locations = locations;
          this.projectsArray[index].selectedLocations = [];
          this.projectsArray[index].locations = locations;
          this.projectsArray[index].projectId = project;
        }, err => {
          //console.error(err);
        });
      // Do stuff
    } else {
      this.projectsArray[index].locations = [];
      this.projectsArray[index].projectId = '';
      this.projectsArray[index].selectedLocations = [];
    }
  }


  //Hide the devices choosing all or just "company only" devices
  selectedDevice(device, index){


    //loop each selected devices
   for(var each in device){

       //detect if 'all' controller of current project is selected
       if(device[each].name==undefined && device[each]=='All'){


         this.All=true;
         this.devicesService.getDevices({projectId:this.projectsArray[index].projectId}).subscribe(async (devices:any[])=>{

           let array=[];
           for(var i=0;i<devices.length;i++){
             //just save in an array the uid value of controllers
             array.push(devices[i].uid);
             }
             this.projectsArray[index].controllerId=array

         });


       //detect if 'CompanyOnly' controller of current project is selected
     }else if(device[each].name==undefined && device[each]=='Company Only'){
       this.CompanyOnly=true;
         //this service retrieve the controllers who have an array list of companyId as parameter
         this.devicesService.getDevicesListByName(this.projectsArray[index].projectId,this.user.companyIds)
       .subscribe(async (devices:any[])=>{
         let array=[];
         for(var i=0;i<devices.length;i++){
           array.push(devices[i].uid);
           }
           this.projectsArray[index].controllerId=array

           });

       }
       else{
         if(this.All){this.projectsArray[index].controllerId=[];this.All=false;}
         else if(this.CompanyOnly){this.projectsArray[index].controllerId=[];this.CompanyOnly=false;}
       }
   }

 }


 //Hide the devices choosing all or just "company only" devices
 selectedLocation(location, index){
  //loop each selected devices
 for(var each in location){
     //detect if 'all' controller of current project is selected
     if(location[each].name==undefined && location[each]=='All'){
       this.All=true;
       this.locationsService.getLocationsAsObs({projectId:this.projectsArray[index].projectId}).subscribe(async (locations:any[])=>{
         let array=[];
         for(var i=0;i<locations.length;i++){
           //just save in an array the uid value of controllers
           array.push(locations[i].description);
          }
          this.projectsArray[index].locationId = array
       });
     //detect if 'CompanyOnly' controller of current project is selected
   }else if(location[each].name==undefined && location[each]=='Company Only'){
     this.CompanyOnly=true;
       //this service retrieve the controllers who have an array list of companyId as parameter
       this.locationsService.getLocationsListByName(this.projectsArray[index].projectId,this.user.companyIds).subscribe(async (locations:any[])=>{
         console.log(locations);
       let array=[];
       for(var i=0;i<locations.length;i++){
         array.push(locations[i].description);
         }
         this.projectsArray[index].locationId=array
         });
     }
     else{
       if(this.All){this.projectsArray[index].locationId=[];this.All=false;}
       else if(this.CompanyOnly){this.projectsArray[index].locationId=[];this.CompanyOnly=false;}
     }
 }

}
















  public parseProjectsForInvitedUser() {
    this.user.controllerIds = [];
    this.user.projectIds = [];
    let deviceIds = [];

    if(this.allProjectSelected) {
      this.projects.map(project => this.user.projectIds.push(project.id));
      this.devices.map(device => {
        deviceIds.push(device.uid);
      });
      this.user.controllerIds.push({ projectId: 'All', controllers: deviceIds });
    } else {
      this.projectsArray.map(project => {
        this.user.controllerIds.push({ projectId: project.selectedProject, controllers: project.selectedDevices });
        this.user.projectIds.push(project.selectedProject);
      });
    }
  }

  public addProject() {
    if(this.projectsArray.length === this.projects.length) return false;
    this.projectsArray.push({ projects: this.projects });
  }

  public deleteProject(index) {
    this.projectsArray.splice(index, 1);
  }

  public createOrUpdate() {
    if(this.isUpdate) this.updateUser();
    else this.addUser();
  }





  public updateUser() {




    let errorHtml = '';
    //crear 2 arreglos para la data actualizada
    let finalArrayControllers=[];
    let finalArrayProjects=[];
    let finalArrayLocations = [];
    //estructurar la data en cada arreglo
    for(var each=0;each<this.projectsArray.length;each++){
      finalArrayProjects.push(this.projectsArray[each].projectId);
      finalArrayLocations.push({projectId:this.projectsArray[each].projectId,
        locationId:this.projectsArray[each].locationId});
    }
    //meter ambos arreglos en el objeto que hara el patch
    this.user.projectIds=finalArrayProjects;
    this.user.controllerIds=finalArrayControllers;
    this.user.locationIds=finalArrayLocations;
    this.usersService.updateUser(this.user.id, this.user)
      .subscribe(results => {
        this.router.navigate([this.redirectUrl], { relativeTo: this.activeRoute });
      }, err => {
        //console.error(err);
        for(var item in err.details.messages) {
          if(err.details.codes[item] == 'presence') errorHtml = `${errorHtml}<div class="danger">${item} ${err.details.messages[item]}</div>`;
          else if(err.details.codes[item] == 'uniqueness') errorHtml = `${errorHtml}<div class="danger">${err.details.messages[item]}</div>`;
        }
        this.swalOptions = { title: 'Complete the required information, Do not add the same project twice', type: 'error', html: errorHtml };
        setTimeout(() => { this.errors.show() }, 200);
       // if(err.message.indexOf("conatins duplicate"))
        //alert("Can´t select the same project twice");
      });


    }



  public addUser() {
    let errorHtml = '';
    if(this.type === 'invite') this.parseProjectsForInvitedUser();
    //console.log('THIS USER HERE');
    let finalArrayControllers=[];
    let finalArrayLocations=[];
    let finalArrayProjects=[];
    //estructurar la data en cada arreglo
    for(var each=0;each<this.projectsArray.length;each++){
      finalArrayProjects.push(this.projectsArray[each].projectId);
      finalArrayLocations.push({projectId:this.projectsArray[each].projectId,
                                locationId:this.projectsArray[each].locationId});
    }
    //meter ambos arreglos en el objeto que hara el patch
    this.user.projectIds=finalArrayProjects;
    this.user.controllerIds=finalArrayControllers;
    this.user.locationIds=finalArrayLocations;

    this.usersService.addUser(this.user)
      .subscribe(user => {
        this.router.navigate([this.redirectUrl], { relativeTo: this.activeRoute });
      }, err => {

        for(var item in err.details.messages) {
          if(err.details.codes[item] == 'presence') errorHtml = `${errorHtml}<div class="danger">${item} ${err.details.messages[item]}</div>`;
          else if(err.details.codes[item] == 'uniqueness') errorHtml = `${errorHtml}<div class="danger">${err.details.messages[item]}</div>`;
        }
        this.swalOptions = { title: 'Is not allowed select the same project twice', type: 'error', html: errorHtml };
        setTimeout(() => { this.errors.show() }, 200);
      });

  }

}

