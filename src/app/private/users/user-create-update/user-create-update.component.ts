import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UsersService } from '../users.service';
import { ProjectsService } from '../../projects/projects.service';
import { LocationsService } from '../../locations/locations.service';
import { CompaniesService } from '../../companies/companies.service';

import { AppSharedService } from '../../../app.shared-service';
import { LoadingService } from '../../shared/loading.service';

import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { filter } from 'rxjs/operators';

import { getArrayOfLocations, 
     selectAllLocationIds, 
     selectAllLocationIdsByCompany,
     parseLocationsAndProjects } from '../../../common/helpers/helpers'

@Component({
  selector: 'app-user-create-update',
  templateUrl: './user-create-update.component.html',
  styleUrls: ['./user-create-update.component.css']
})

export class UsersCreateOrUpdateComponent implements OnInit {
    /*
      1.- Paso 1, crear un array que tenga sólo un valor, este array iterará y pintará los proyectos y locaciones

    */
    @ViewChild('errors') private errors: SwalComponent;
    public projectsArray;
    public projects;
    public companies;
    public allLocations;

    public type;
    public redirectUrl;
    public isProfileEdition;
    public isUpdate;

    public user;
    public $swalOptions;
    public $errorHtml;

    constructor(private readonly router: Router,
        private readonly activeRoute: ActivatedRoute,
        private readonly sharedService: AppSharedService,
        private readonly usersService: UsersService,
        private readonly locationsService: LocationsService,
        private readonly companiesServices: CompaniesService,
        private readonly projectsService: ProjectsService) {
        this.redirectUrl = '';
        this.$errorHtml = '';
        this.$swalOptions = {};
        this.user = {};
        this.projectsArray = [];
    }

    async ngOnInit() {
        //  Verificamos el tipo -> /invite /master /sysadmin
        this.type = this.activeRoute.snapshot.params.userType;

        if (this.type === 'invite') {
            this.companies = await this.getCompanies();
            this.projects = await this.getProjects();
            this.allLocations = await this.getAllLocations();
        }
          //  Calling all projects from company

          //  Para update, cogemos el parametro userId
        let userId = this.activeRoute.snapshot.params.userId;

        //  Si existe el usuario, entonces correremos lo siguiente
        if(userId) {
            // 1.- Diremos que es "edit / update"

            this.isUpdate = true;

            //  2.- Buscamos al usuario por id para obtener sus datos
            this.usersService.getUserById(userId).subscribe(user => {
                this.user = user;
                /*
                 * Cogemos todos los proyectos del usuario en mención, asi llenaremos la data
                 */ 
                user.projectIds.map(projectId => {
                    let locations = this.allLocations.filter(location => location.projectId == projectId);
                    let selectedLocations = getArrayOfLocations(projectId, user);
                        this.projectsArray.push({
                            projects: this.projects,
                            locations,
                            selectedLocations,
                            selectedProject: projectId
                          });
                });
            });
        }

        this.sharedService.currentCompany.subscribe(companyId => this.user.clientId = companyId);

        switch(this.type) {
            case 'master':
                //  Creamos ruta de redireccion
                if(this.isUpdate && this.isProfileEdition == true) this.redirectUrl = '../../../../dashboard';
                else if(this.isUpdate) this.redirectUrl = '../../../master';
                else this.redirectUrl = '../../master';
                this.user.userType = 'webmaster';
                this.user.userRealm = 'client';
            break;
            case 'admin':
                //  Creamos ruta de redireccion
                if(this.isUpdate && this.isProfileEdition == true) this.redirectUrl = '../../../../dashboard';
                else if(this.isUpdate) this.redirectUrl = '../../../admin';
                else this.redirectUrl = '../../admin';
                this.user.userType = 'sysadmin';
                this.user.userRealm = 'client';
            break;
                //  Creamos ruta de redireccion
                case 'invite':
                if (this.isUpdate) {
                    if (this.isProfileEdition) this.redirectUrl = '../../../../dashboard';
                    else this.redirectUrl = '../../../invite';
                } else {
                    this.user.userRealm = 'customer';
                    this.projectsArray = [{ projects: this.projects, locations: [], selectedLocations: [], selectedProject: '' }];
                    this.redirectUrl = '../../invite';
                }
            break;
        }
    }
    public createOrUpdate() {
        if (this.user.projectIds !== 'All') {
            const result = parseLocationsAndProjects(this.projectsArray);
            this.user.locationIds = result.locationIds;
            this.user.projectIds = result.projectIds;            
        }

          if(this.isUpdate) this.updateUser();
          else this.addUser();
    }

    private updateUser() {
        this.usersService.updateUser(this.user.id, this.user)
            .subscribe(results => {
                this.router.navigate([this.redirectUrl], { relativeTo: this.activeRoute });
            }, err => {
                //  console.error(err);
                for(var item in err.details.messages) {
                    if(err.details.codes[item] == 'presence') this.$errorHtml = `${this.$errorHtml}<div class="danger">${item} ${err.details.messages[item]}</div>`;
                    else if(err.details.codes[item] == 'uniqueness') this.$errorHtml = `${this.$errorHtml}<div class="danger">${err.details.messages[item]}</div>`;
                }
                this.$swalOptions = { title: 'Complete the required information, Do not add the same project twice', type: 'error', html: this.$errorHtml };
                setTimeout(() => { this.errors.show() }, 200);
         // if(err.message.indexOf("conatins duplicate"))
          //alert("Can´t select the same project twice");
        });
    }

    private addUser() {
        this.usersService.addUser(this.user)
            .subscribe(user => {
                this.router.navigate([this.redirectUrl], { relativeTo: this.activeRoute });
            }, err => {
                for(var item in err.details.messages) {
                    if(err.details.codes[item] == 'presence') this.$errorHtml = `${this.$errorHtml}<div class="danger">${item} ${err.details.messages[item]}</div>`;
                    else if(err.details.codes[item] == 'uniqueness') this.$errorHtml = `${this.$errorHtml}<div class="danger">${err.details.messages[item]}</div>`;
                }
                this.$swalOptions = { title: 'Is not allowed select the same project twice', type: 'error', html: this.$errorHtml };
                setTimeout(() => { this.errors.show() }, 200);
            });
    }

    /*
     *  Fill locations llena las locaciones de la fila del select seleccionado, según las condicionales
     */
    private async fillLocations(projectId, index) {
        /*
         *  Verificamos que el projectId exista, si no existe es porque en vez de seleccionar, 
         *  hemos borrado un record seleccionado anteriormente
         */
        if (projectId) {
            if (projectId === 'All') {
                this.user.projectIds = 'All';
                this.user.locationIds = [];
            } else {
                this.user.projectIds = [];
                /*  
                 *  Si el proyecto ha sido seleccionado individualmente, entonces  llenaremos el select Locations.
                 */
                this.projectsArray[index].locations = this.allLocations.filter(location => location.projectId == projectId);
                this.projectsArray[index].selectedLocations = [];
            }
        } else {
            /*
            * Éste else se ejecuta cuando eliminan un proyecto seleccionado, las locations serán vacios
            */
            this.projectsArray[index].locations = [];
            this.projectsArray[index].selectedLocations = [];
        }
  }

    public selectLocation(location, index) {
        if (location.includes('All')) {
            const locations = selectAllLocationIds(this.projectsArray[index].locations);
            this.projectsArray[index].selectedLocations = locations;
        }

        if (location.includes('Company')) {
            const locations = selectAllLocationIdsByCompany(this.projectsArray[index].locations, [this.companies[0], this.companies[1]]);
            this.projectsArray[index].selectedLocations = locations;
        }
    }

    public addProject():void {
        this.projectsArray.push({ 
            projects: this.projects, 
            locations: [], 
            selectedLocations: [], 
            selectedProject: '' 
        });
    }

    public deleteProject(index) {
        this.projectsArray.splice(index, 1);
    }

    private getLocationBySelectedProject(projectId) {
        return new Promise((resolve: Function, reject: Function) => {
            this.locationsService.getLocationsAsObs({ projectId })
                .subscribe(
                    locations   => resolve(locations),
                    error     => reject(error)
                )
        });
    }

    private getAllLocations() {
        return new Promise((resolve: Function, reject: Function) => {
            this.locationsService.getAllLocationsAsObs()
                .subscribe(
                    locations    => resolve(locations),
                    error        => reject(error)
                )
        });
    }

    //  Necesarios solo una vez
    private getProjects() {
        return new Promise((resolve: Function, reject: Function) => {
            this.projectsService.getProjects()
            .subscribe(
                projects     => resolve(projects),
                error        => reject(error)
            )
        });
    }

    private getCompanies() {
        return new Promise((resolve: Function, reject: Function) => {
            this.companiesServices.getCompanies()
                .subscribe(
                    companies    => resolve(companies),
                    error        => reject(error)
                )
        });
    }
}


