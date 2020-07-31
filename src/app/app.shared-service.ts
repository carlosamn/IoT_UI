import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as env from '../environments/environment';
import * as transform from './common/filters/text-transform';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppHTTPService } from './app.http-service';
import { Observable } from "rxjs/Observable"
import { ObserveOnOperator } from 'rxjs/operators/observeOn';
import { concat } from 'rxjs/observable/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/skipUntil';

import { md5 } from './common/utilities/md5';

@Injectable()
export class AppSharedService {
  //  url logo declaration
  private logo = new BehaviorSubject<string>('');

  //  Company name declaration
  private company = new BehaviorSubject<string>('');

  //  Current logged user declaration
  private user = new BehaviorSubject<object>({});

  //  Current selected device
  private selectedDevice = new BehaviorSubject<object>({});

  //  Current selected location
  private selectedLocation = new BehaviorSubject<object>({});

  //  Shortcut options
  private shortcutPages = new BehaviorSubject<Array<string>>([]);

  //  Private datatable options
  private dtOptions = new BehaviorSubject<object>({});

  // Privaet Project
  private project = new BehaviorSubject<object>({});

  //  Basepath declaration
  private path: string;

  //  Loader
  private loader = new BehaviorSubject<boolean>(false);

  private companyId = new BehaviorSubject<string>('');

  //description

  private Description = new BehaviorSubject<string>("");

  private uid= new BehaviorSubject<string>("");


  public currentLocationObjAntiBound = true;

  public projectObj = new BehaviorSubject<object>({});
  public companyObj = new BehaviorSubject<object>({});
  public locationObj = new BehaviorSubject<object>({});
  public locationsObj = new BehaviorSubject<object>({});
  public alarmsObj = new BehaviorSubject<object>({});



  // Declaring observable variables
  currentLoaderStatus = this.loader.asObservable();
  currentLogo = this.logo.asObservable();
  currentCompany = this.company.asObservable();
  currentDtOptions = this.dtOptions.asObservable();
  currentUserObject = this.user.asObservable();
  currentSelectedDevice = this.selectedDevice.asObservable();
  currentSelectedLocation = this.selectedLocation.asObservable();
  currentShortcutPages = this.shortcutPages.asObservable();
  currentCompanyId = this.companyId.asObservable();
  currentProject = this.project.asObservable();
  currentPath = this.path;

  currentProjectObj = this.projectObj.asObservable();
  currentCompanyObj = this.companyObj.asObservable();
  currentLocationObj = this.locationObj.asObservable();
  currentLocationsObj = this.locationsObj.asObservable();
  currentAlarmsObj = this.alarmsObj.asObservable();
  currentDescription=this.Description.asObservable();
  currentUid=this.uid.asObservable();

  constructor(private http: AppHTTPService) {
    this.setDefaultLogo();
    this.setDtOptions();
  }

  setCurrentUid(uid){
    this.uid.next(uid);
  }

  setCurrentDescription(description){
    this.Description.next(description);
    
  }

  

  setCurrentProject(project){
    this.projectObj.next(project);
  }
  setCurrentCompany(company){
    this.companyObj.next(company);
  }
  setCurrentLocation(location){
    if(location){
      this.locationObj.next(location);
    }

  }
  setCurrentLocations(locations){
    if(locations){
      this.locationsObj.next(locations);
    }

  }
  setCurrentAlarms(alarms){
    this.alarmsObj.next(alarms);
  }


  getCurrentAlarms(){
    return this.alarmsObj.getValue()
  }


  setLoadingVisibility(visible: boolean) {
    this.loader.next(visible);
  }

  //  Generating new shortcut page for device selected
  settingShortCutPages(pages: Array<string>) {

    if(pages){

      let fileName = '';
      let url = '';

      let dashboardPages = [];
      dashboardPages.push({
        page:'Data', 
        url:'../assets/img/shortcuts/data.svg',
        route:''
                });
      let _pages = Object.values(pages);

      _pages.map(page => {
        try{
            
              if(page !== 'fl3' && page !== 'qso' && page!=='pit'  ) {
                url = `../assets/img/shortcuts/${page.toLowerCase()}.svg`
                page = transform.capitalizeAndReplaceSub(page);
                dashboardPages.push({ page: page, url: url, route: '' });
              }
              else if(page === 'qso'){
                    //  Mapping shortcuts routes for QSO
                dashboardPages.push({
                  page: 'QSO Main',
                  url: `../assets/img/shortcuts/qso_maindashboard.svg`,
                  route: ''
                }, {
                  page: 'QSO Settings',
                  url: `../assets/img/shortcuts/qso_settings.svg`,
                  route: ''
                }, {
                  page: 'QSO Fracview',
                  url: `../assets/img/shortcuts/qso_fracview.svg`,
                  route: ''
                }, {
                  page: 'QSO Realtime',
                  url: `../assets/img/shortcuts/qso_realtime.svg`,
                  route: ''
                }, {
                  page: 'QSO Overview',
                  url: `../assets/img/shortcuts/qso_joboverview.svg`,
                  route: ''
                });

              }
              else if(page === 'pit'){
                //  Mapping shortcuts routes for QSO
            dashboardPages.push({
              page: 'PIT Main',
              url: `../assets/img/shortcuts/qso_maindashboard.svg`,
              route: ''
            },
            {
              page: 'PIT Status',
              url: `../assets/img/shortcuts/qso_fracview.svg`,
              route: ''
            }, {
              page: 'PIT Settings',
              url: `../assets/img/shortcuts/qso_settings.svg`,
              route: ''
            },  {
              page: 'PIT Notes',
              url: `../assets/img/shortcuts/qso_realtime.svg`,
              route: ''
            }, {
              page: 'PIT EFM',
              url: `../assets/img/shortcuts/qso_joboverview.svg`,
              route: ''
            });

              }
              else {
                //  Mapping shortcuts routes for FL3
                dashboardPages.push({
                  page: 'Fl3 graph',
                  url: `../assets/img/shortcuts/fl3_graph.svg`,
                  route: ''
                }, {
                  page: 'Fl3 settings',
                  url: `../assets/img/shortcuts/fl3_settings.svg`,
                  route: ''
                }, {
                  page: 'Fl3 reports',
                  url: `../assets/img/shortcuts/fl3_reports.svg`,
                  route: ''
                });
              }
        }
        catch(e){
          //console.log(" -------------------------------------- ")
          //console.error("Cathing Error on Pages Shortcuts");
          //console.log(" -------------------------------------- ")
          //console.log(e)
        }
      });


      this.shortcutPages.next(dashboardPages);

/*

*/


    }




  }
  //  Getting the new selected device
  settingSelectedDevice(device: object) {
    this.selectedDevice.next(device);
  }

  //  Getting the new selected location
  settingSelectedLocation(location: object) {
    this.selectedLocation.next(location);
    //console.log(" ");
    //console.warn(" Debugging -> ngOnInit() :: this.selectedLocation ");
    //console.log(location);
    //console.log(" ");
  }

  settingUserObject(user: object) {
    //  Setting the user objet
    this.user.next(user);
  }

  setDefaultLogo() {
    this.path = `${env.environment.basepath}`;
    let full = window.location.host;
    let parts = full.split('.');
    let company = parts[0].toLowerCase();
    if(parts[2]) {
      this.logo.next(`${this.path}/containers/clientlogo/download/${company}.jpeg`);
      this.company.next(company);
    }
    else {
      this.logo.next(`${this.path}/containers/clientlogo/download/${env.environment.defaultCompany}.jpeg`);
      this.company.next(`${env.environment.defaultCompany}`);
    }
  }

  setDtOptions() {
    //  Settings datatable options
    let options;
    let scrollX;
    let width = window.innerWidth;
    if(width < 700) scrollX = true;
    else scrollX = false;

    options = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [],
      scrollX: scrollX
    };
    this.dtOptions.next(options);
  }

  setProject(projectId: any) {

    let path = { base: `${environment.basepath}`, model: 'projects' };
    let url= `${path.base}/${path.model}/${projectId}`;

    this.http.get(url)
      .map((data: any) => {
        return data;
      }).toPromise().then( data =>{
        this.project.next(data);
      });
      /*

    */
  }
}












