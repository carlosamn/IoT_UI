import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSharedService } from '../../../app.shared-service';
import { LocationsService } from '../../locations/locations.service';
import { AlarmsService } from '../../alarms/alarms.service';
import { httpFactory } from '@angular/http/src/http_module';
import { HttpClient } from '@angular/common/http';
import { AppHTTPService } from './../../../app.http-service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-private-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  private path = { base: `${environment.basepath}`,
  modelCompany: 'companies' ,
  modelProjects: 'projects' ,
  modelLocation : 'locations'};

  public projectName;
  public hours;
  public minutes;
  public seconds;
  public companyId;
  public selectedDevice;
  public selectedLocation ={
    companyId : "",
    uid : "",
    description : "",
    projectId : ""
  }

  public SUBS = {
    project : <any>{},
    company: <any>{},
    location: <any>{}
  }

  public STATE = {
    currentProject : <any>{},
    currentCompany : <any>{},
    currentLocation : <any>{},
    currentLocations : <any>{},
    currentLocationIndex : 0
  }

  constructor(private router: Router,
              private http: AppHTTPService,
              private changeDetectorRef : ChangeDetectorRef,
              private locationsService : LocationsService,
              private alarmsService : AlarmsService,
              private sharedService: AppSharedService) {
  }




  async ngOnInit() {



    this.SUBS.location = this.sharedService.currentLocationObj.debounceTime(500).subscribe(async location => {

      this.STATE.currentLocation = location;

      if(location["dashboardPages"]){
        let dashboardPages  = location["dashboardPages"];
        this.sharedService.settingShortCutPages(dashboardPages);
      }


    });



    const self = this;
    setInterval(() => {
      self.setTime();
    }, 1000);



    // Set Initial State

    if(!localStorage.getItem('currentLocationIndex')){
      localStorage.setItem('currentLocationIndex','0');
    }

    let initProject = await this.setInitProject();
    this.sharedService.setCurrentProject(JSON.parse(initProject["data"]))
    this.STATE.currentProject = JSON.parse(initProject["data"]);
    await this.delayTimer();

    let initCompany = await this.setInitCompany(JSON.parse(initProject["data"]));
    this.sharedService.setCurrentCompany(JSON.parse(initCompany["data"]))
    this.STATE.currentCompany = JSON.parse(initCompany["data"]);
    await this.delayTimer();

    let initLocations = await this.setInitLocation(JSON.parse(initProject["data"]));
    this.sharedService.setCurrentLocation(initLocations["data"][parseInt(localStorage.getItem('currentLocationIndex'))])
    await this.delayTimer();

    this.sharedService.setCurrentLocations(initLocations["data"]);
    await this.delayTimer();


    /*
    let dashboardPages  = this.STATE.currentLocation.dashboardPages;
    this.sharedService.settingShortCutPages(dashboardPages);
    await this.delayTimer();
*/



  }



  ngOnDestroy(): void {
   // try{this.SUBS.company.unsubscribe()}catch(e){ console.error(" AMS ERROR :: Error Unsubscribing 'Company' @ header.component / " + (new Date()).toDateString() )}
    try{this.SUBS.location.unsubscribe()}catch(e){ console.error(" AMS ERROR :: Error Unsubscribing 'Location' @ header.component / " + (new Date()).toDateString() )}
    //try{this.SUBS.project.unsubscribe()}catch(e){ console.error(" AMS ERROR :: Error Unsubscribing 'Project' @ header.component / " + (new Date()).toDateString() )}
  }







  public setInitProject(){
    return new Promise( async (resolve,reject) => {
      let projectLocalStorage = localStorage.getItem('currentProject');
      if(projectLocalStorage){
        this.STATE.currentProject = JSON.parse(projectLocalStorage);
        localStorage.setItem('project', this.STATE.currentProject["id"]);
        resolve({status : 'Ok', source : 'localStorage' , model : 'project' , data: projectLocalStorage})
      }else{
        const arrayRoutes = this.router.url.split('/');
        let projectFromServerId = arrayRoutes[1].replace("_", " ");
        let projectFromServer = await this.getHTTPProjectByProjectId(projectFromServerId)
        this.STATE.currentProject = projectFromServer;
        localStorage.setItem('currentProject', JSON.stringify(projectFromServer));
        localStorage.setItem('project', projectFromServer["id"]);
        resolve({status : 'Ok', source : 'HTTP' , model : 'project' , data: projectFromServer})
      }
    });
  }

  public setInitCompany(project?){
    return new Promise( async (resolve,reject) => {
      let companyLocalStorage = localStorage.getItem('currentCompany');

        let companyFromServer = await this.getHTTPCompanyByCompanyId(project["companyId"])
        this.STATE.currentCompany = companyFromServer;
        localStorage.setItem('currentCompany', JSON.stringify(companyFromServer));
        resolve({status : 'Ok', source : 'HTTP' , model : 'company' , data : JSON.stringify(companyFromServer)})

    });
  }



  public setInitLocation(project?){
    return new Promise( async (resolve,reject) => {

      let locationLocalStorages = localStorage.getItem('currentLocations');
      let locationLocalStorage = localStorage.getItem('currentLocation');
      let locationIndexLocalStorage = localStorage.getItem('currentLocationIndex');

        let locationFromServer = await this.getHTTPLocationsByProjectId(project["id"])

        this.STATE.currentLocation = locationFromServer[0];
        this.STATE.currentLocations = locationFromServer;

        if(locationIndexLocalStorage){
          this.STATE.currentLocationIndex = parseInt(locationIndexLocalStorage);
          localStorage.setItem('currentLocationIndex',locationIndexLocalStorage);
        }else{
          this.STATE.currentLocationIndex = 0;
          localStorage.setItem('currentLocationIndex','0');
        }

        localStorage.setItem('currentLocations', JSON.stringify(locationFromServer));
        localStorage.setItem('currentLocation', JSON.stringify(locationFromServer[0]));

        resolve({status : 'Ok', source : 'HTTP' , model : 'location' , data : locationFromServer})

    })
  }





  public delayTimer(){
    return new Promise( (resolve,reject) => {
      setTimeout( x => {
          resolve("Timmer is Over, Go Next Step")
      },50);
    });
  }









public getHTTPProjectByProjectId(projectId){
 return new Promise (async(resolve,reject) => {
  let url = `${this.path.base}/${this.path.modelProjects}/${projectId}`;
  this.http.get(url).map((data: any) => {return data;}).toPromise().then( response => {resolve(response)} ).catch( error => { resolve(error) });
 });
}
public getHTTPCompanyByCompanyId(companyId){
 return new Promise (async(resolve,reject) => {
  let url = `${this.path.base}/${this.path.modelCompany}/${companyId}`;
  this.http.get(url).map((data: any) => {return data;}).toPromise().then( response => {resolve(response)} ).catch( error => { resolve(error) });
 });
}
public getHTTPLocationsByProjectId(projectId){
  return new Promise (async(resolve,reject) => {
   let url = `${this.path.base}/${this.path.modelLocation}/`;
   this.http.get(url).map((data: any) => {return data;}).toPromise().then( locations => {
     let locationOnProjectId = locations.filter( location => { return location.projectId == projectId})
     resolve(locationOnProjectId)
    }).catch( error => { resolve(error) });
  });
 }








  public setTime() {
    let date;
    let hours;
    let minutes;
    let seconds;
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    this.hours = ( hours < 10 ? '0' : '' ) + hours;
    this.minutes = ( minutes < 10 ? '0' : '' ) + minutes;
    this.seconds = ( seconds < 10 ? '0' : '' ) + seconds;
  }

}
