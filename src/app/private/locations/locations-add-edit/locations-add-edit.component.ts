import { Component, OnInit , ViewChild,AfterViewInit, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';

//  Services
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { CompaniesService } from '../../companies/companies.service';
import { ProjectsService } from '../../projects/projects.service';
import { LocationsService } from '../locations.service';
import { LoadingService } from '../../shared/loading.service';
import { ClientsService } from '../../clients/clients.service';
import { UsersService } from '../../users/users.service';
import { DevicesService } from '../../devices/devices.service';
import { FL3Service } from '../../fl3/fl3.service';
import { md5 } from '../../../common/utilities/md5';
import { AppSharedService } from '../../../app.shared-service';
import { dashboards } from '../../routing-dashboards';
import { ScriptService } from '../../../common/services/script-injection.service';
import { } from '@types/googlemaps';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../locations-add-edit/_services/index';
import { SettingsComponent } from '../../pit/settings/settings.component';
@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-add-edit.component.html',
  styleUrls: ['./locations-add-edit.component.css']
})
export class LocationsAddEditComponent implements OnInit {
  @ViewChild("lsd1") lsd1:ElementRef;
  @ViewChild("text1") text1:ElementRef;
  @ViewChild("nts1") nts1:ElementRef;
  @ViewChild('gmap') gmapElement: any;
  @ViewChild('notifications') private notifications: SwalComponent;

  public inputLat;
  Map: google.maps.Map;
  //public Map;
  public currentLat: any;
  public currentLong: any;
  //public marker: google.maps.Marker;

  public isEdit: boolean = false;

  public projects;
  public locations;
  public companies;
  public device;
  public dashboardPages;
  public dashboardPagesFull
  public radioId;
  private companyId;
  public LATmap;
  public lsd=false;
  public nts=false;
  public text=false;
  public lati=false;
  public lat;
  public long;
  public place;
  public wrongaddress=true;


  private path = { base: `${environment.basepath}`,
  modelCompany: 'companies' ,
  modelProjects: 'projects' ,
  modelLocation : 'locations'};
  public validatelsd=false;
  public validatents=false;
  public validatetext=false;
  public validatelat=false;

  /*setCenter(e:any){
    e.preventDefault();
    this.Map.setCenter(new google.maps.LatLng(this.lat, this.long));
}*/


public notificationOptions  = {
  type : '',
  width : '',
  title : '',
  text : ''
}

  public location = {
    locationId : "",
    description : "",
    uid : "",
    projectId: "",
    companyId : "",
    isLegacy : false,
    active : false
  };

   // RXJS Subscriptions
   public SUBS = {
    alarms: <any>{},
    company : <any>{},
    companies : <any>{},
    locations : <any>{},
    location : <any>{},
    user: <any>{},
    dashboards: <any>{},
    projects : <any>{}
  };


  constructor(private appShared: AppSharedService,
              private scripts: ScriptService,
              private companyService: CompaniesService,
              private activeRoute: ActivatedRoute,
              private devicesService: DevicesService,
              private router: Router,
              private http: HttpClient,
              private loadingService: LoadingService,
              private locationsService: LocationsService,
              private projectsService: ProjectsService,
              private ElementRef:ElementRef,
              private alertService:AlertService
              ){


  }

  ngAfterViewInit() {

    /*var m=new google.maps.Map(document.getElementById("Mapp"),{
      center: {lat: 51.084035, lng:-114.13072},
      zoom: 18
    });
    var geocoder = new google.maps.Geocoder();
        this.ElementRef.nativeElement.querySelector('#submit')
          .addEventListener('click',console.log("afterViewinit click action"));*/
  }

  public async ngOnInit(){
    this.LATmap=false;



    //console.warn('this.appShared.companyObj.getValue();')
    //console.warn(JSON.parse(localStorage.getItem('currentLocation')))


    this.SUBS.locations = this.appShared.currentLocationsObj.subscribe(async locations => {
      console.log("locations @ locations-add-edit.components.ts")
      console.log(locations)
      this.locations = Object.values(locations);
    });

    await this.locationsService.updateLocationsFromServerPromise();


        this.appShared.currentCompanyObj.subscribe( company => {
          this.companyId = company["clientId"];
          this.SUBS.companies =  this.companyService.getCompanies({ clientId: this.companyId }).subscribe(companies => {
          this.companies = companies;
          this.SUBS.projects = this.projectsService.getProjects({ clientId: this.companyId }).subscribe(projects => {
            this.projects = projects;



            this.SUBS.location = this.appShared.currentLocationObj.subscribe(async location => {

        this.dashboardPagesFull = await this.devicesService.getDashboardPages();

        this.activeRoute.params.subscribe(params => {
          if(params["locationId"]){
            this.isEdit = true;
            this.location.locationId = params["locationId"];
          }else{
            this.isEdit = false
          }
        });



      if(this.isEdit){

        let currentLocation = this.locations.filter( _location => {
          return _location.locationId == this.location.locationId
        })[0];


      this.location.locationId = currentLocation["locationId"];
      this.location.description = currentLocation["description"];


      let index0;
      let index3;
      let index4;
      let index16;
      let comma;
      let onlyNumerico="";

      for(let i=0;i<this.location.description.length;i++){
       index0= this.location.description[0];
       index3=this.location.description[3];
       index4=this.location.description[4];
       index16=this.location.description[16];
       onlyNumerico=this.location.description[i]+onlyNumerico;
       if(this.location.description[i]==","){
         comma=true;
       }

      }
      let flag=this.tiene_letras(onlyNumerico);
        if(index3=='/'){
          this.radioId="LSD";
          this.LATmap=false;
          this.lsd=true;
          this.nts=false;
          this.text=false;
          this.lati=false;

        }else if(index4=='-'){
        this.radioId="NTS";
        this.LATmap=false;
        this.nts=true;
        this.lsd=false;
        this.text=false;
        this.lati=false;
      }
      else if(comma){
        this.radioId="LAT";
        this.LATmap=true;
        this.nts=false;
        this.lsd=false;
        this.text=false;
        this.lati=true;
      }
      else{
        this.radioId="TEXT";
        this.LATmap=false;
        this.nts=false;
        this.lsd=false;
        this.text=true;
        this.lati=false;

      }


      this.location.uid = currentLocation["uid"];
      this.location.projectId = currentLocation["projectId"];
      this.location.companyId = currentLocation["companyId"];
      this.location.isLegacy = currentLocation["isLegacy"];
      this.location.active = currentLocation["active"];

      this.dashboardPages = this.dashboardPagesFull.map( dashboardPage => {
        let isPage = currentLocation["dashboardPages"].includes(dashboardPage.page);
        let out = {
          page: dashboardPage.page,
          active: isPage
        };
        return out;
      })


      }else{
      this.dashboardPages = this.dashboardPagesFull.map( dashboardPage => {
        let out = {
          page: dashboardPage.page,
          active: false
        };
        return out;
      })

      this.radioId="TEXT";
      this.validatents=false;this.validatelat=false;this.validatelsd=false;this.nts=false;this.lsd=false;this.lati=false;this.text=true;this.LATmap=false;
    }

      //this.scripts.load('gmaps').then(success => {
        /*let mapProp = {
          center: {lat: 51.084035, lng:-114.13072},
          zoom: 18,
          matTypeId: google.maps.MapTypeId.TERRAIN
        };*/

      //});
      this.scripts.load('gmaps').then(success => {
        let mapProp = {
          center: new google.maps.LatLng(51.084035, -114.13072),
          zoom: 18,
          matTypeId: google.maps.MapTypeId.TERRAIN
        };
        this.Map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        });
      //var geocoder = new google.maps.Geocoder();



        });
      });

  });
});

  }










  public async ngOnDestroy() {
    try{this.SUBS.alarms.unsubscribe();}catch(e){}
    try{this.SUBS.company.unsubscribe();}catch(e){}
    try{this.SUBS.locations.unsubscribe();}catch(e){}
    try{this.SUBS.location.unsubscribe();}catch(e){}
    try{this.SUBS.user.unsubscribe();}catch(e){}

}


b(geocoder,m, address){
  geocoder.geocode({address:address}, function (results,status){
  if(status==='OK'){
     m.setCenter(results[0].geometry.location);
      var  markerr   =  new google.maps.Marker({
    map: m,
    position: results[0].geometry.location
  });
  localStorage.setItem('invalidAddress','false');
}else{ localStorage.setItem('invalidAddress','true')};

localStorage.setItem("latlng",results[0].geometry.location.toString());

  });

}

   c(place) {
  var m = new google.maps.Map(document.getElementById("gmap"),{
    center: {lat: 51.084035, lng:-114.13072},
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
  var  geocoder = new google.maps.Geocoder();

 this.b(geocoder,m,place);



}

public async  d(){
  setTimeout(a=>{
  let lat="";
  let lng="";
  let latF=false;
  let ltlg= localStorage.getItem("latlng");
  let invalidAddress=localStorage.getItem("invalidAddress");
  if(invalidAddress=="true"){this.wrongaddress=true} else this.wrongaddress=false;
      let leng:number;
      let lengL:number;
      if(ltlg[1]=='-'){leng=12;lengL=11}else leng=11;lengL=10
  for(let i=0;i<ltlg.length;i++){

      if(latF==false && i<leng && ltlg[i]!='(' && ltlg!=')' && ltlg[i]!=',' ){
        lat=lat+ltlg[i];
      }else if(i>lengL && ltlg[i]!=')' && ltlg!='('&& ltlg[i]!=','){ latF=true;
        lng=lng+ltlg[i];
      }else console.log();
  }
  this.lat=lat;
  this.long=lng;
  this.location.description=this.lat+','+this.long;


},1000,[]);
if(this.wrongaddress==false){
setTimeout(a=>{
  this.error("Invalid address! Please write one correct!");
},1000,[]);
}
localStorage.setItem('invalidAddress','true');
}

public error(message: string) {
  this.alertService.error(message);
}
  private tiene_letras(texto){
    let letras="abcdefghyjklmnopqrstuvwxyz";
    texto = texto.toLowerCase();
    for(let i=0; i<texto.length; i++){
       if (letras.indexOf(texto.charAt(i),0)!=-1){
          return 1;
       }
    }
    return 0;
 }

  /*public a(){
    this.location.description=this.lat+','+this.long;
    this.radioId="LAT";
  }
  public la(){
     let la= this.deny(this.lat);
      this.lat=la;
  }
  public lo(){
    let lo= this.deny(this.long);
  this.long=lo;
 }
   public deny(latlong){
    let out="";
    let strings='2134567890.,-"';
    if(latlong!=undefined){
    for(var i=0;i<latlong.length;i++){
      if(strings.indexOf(latlong.charAt(i))!=-1)
        {out=out+latlong.charAt(i);}
    }
    return out;
  }

   }*/

  public validateLSD(){
    console.log("latlong.."+this.lat);
    if (this.location.description.length<18){
      this.validatelsd=true;
    }else this.validatelsd=false;
  }
  public validateNTS(){
    if (this.location.description.length<16){
      this.validatents=true;
    }else this.validatents=false;
  }
  public validateTEXT(){
    if (this.location.description.length<6){
      this.validatetext=true;
    }else {this.validatetext=false;}
    let out="";
    let strings='2134567890qwertyuiopasdfghjklñzxcvbmnQWERTYUIOPASDFGHNJKLÑZXCVBNM-,. ';
    for(var i=0;i<this.location.description.length;i++){
      if(strings.indexOf(this.location.description.charAt(i))!=-1)
        {out=out+this.location.description.charAt(i);}
        if(this.location.description[i]==" " && this.location.description[i-1]==" "){
          this.location.description[i].replace(" ","");
          console.log("doble espacio");
        }
    }
    this.location.description=out;
  }

  public mask(){
    let par= this.location.description;
    let newWord="";
    for(let i=0;i<par.length;i++){
     if(i==16){newWord=newWord+"W";}
     else newWord=newWord+par[i];
   }
    this.location.description=newWord;
   }

   public radioButton(par){
      let lati;
       let longi;
     if(par=="LAT"){
      this.radioId="LAT"
      this.LATmap=true;
       let flagLAT=false;
       this.nts=false;
       this.lsd=false;
       this.text=false;
       this.lati=true;
       this.validatents=false;
       this.validatetext=false;
       this.validatelsd=false;
       for(let i=0;i<this.location.description.length;i++){

          //console.log(flagLAT);
         if(this.location.description[i]==','){
           flagLAT=true;
           //console.log(flagLAT);
           //console.log("index of comma is..."+i);
         }
         if(flagLAT==false){lati=lati+this.location.description[i];
         // console.log("current character is.."+this.location.description[i]);
        }
          else
          {longi=longi+this.location.description[i];
            //console.log("current character is.."+this.location.description[i]);
          }
            }
            lati.substr(9);
            longi.substr(10);
            this.lat=lati;
            this.long=longi;
            this.lat=this.lat.substr(9);
            this.long=this.long.substr(10);

     }else if(par=="NTS"){this.validatelat=false;this.validatetext=false; this.validatelsd=false;this.lsd=false;this.text=false;this.lati=false;this.nts=true;this.LATmap=false;}
     else if(par=="LSD"){this.validatents=false; this.validatetext=false;this.validatelat=false;this.nts=false;this.text=false;this.lati=false;this.lsd=true;this.LATmap=false;}
     else{               this.validatents=false;this.validatelat=false;this.validatelsd=false;this.nts=false;this.lsd=false;this.lati=false;this.text=true;this.LATmap=false;}

    // console.log("latLong is.."+this.location.description);
     this.radioId=par;
   }

    public requiredtext(){
    this.text1.nativeElement.focus();
   }
   public requiredlsd(){
    this.lsd1.nativeElement.focus();
   }
   public requirednts(){
    this.nts1.nativeElement.focus();
   }

  public async createOrUpdate(){
    if (this.isEdit)
    {
      this.editLocation();
    }
    else {
      this.addLocation()
    }
  }

  public async resetDeviceData(){

  }

  public addLocation(){
    //console.log("add")
    let _location = {
      isLegacy : this.location.isLegacy,
      uid : this.location.uid,
      clientCode : "ams",
      projectId : this.location.projectId,
      companyId : this.location.companyId,
      description : this.location.description,
      dashboardPages: this.dashboardPages
                      .filter( _page => {return _page.active} )
                      .map( _page => {return _page.page} )
    }
    this.locationsService.addLocation(_location).then( async response => {
      await this.locationsService.updateLocationsFromServerPromise();
      this.router.navigate(['../list'], { relativeTo: this.activeRoute });
    })
  }

  public editLocation(){

    console.log("coordinates..."+this.location.description);

    let _location_id = this.location.locationId;
    let _location = {
      isLegacy : this.location.isLegacy,
      uid : this.location.uid,
      clientCode : '',
      projectId : this.location.projectId,
      companyId : this.location.companyId,
      description : this.location.description,
      dashboardPages: this.dashboardPages
                      .filter( _page => {return _page.active} )
                      .map( _page => {return _page.page} )
    }



    this.locationsService.editLocationById(_location_id,_location)
    .then( response => {

      let url = `${this.path.base}/${this.path.modelLocation}/`;
      this.http.get(url).map((data: any) => {return data;})
      .toPromise().then( locations => {

        let kLocation = parseInt(localStorage.getItem("currentLocationIndex"));
        let kProjectId = JSON.parse(localStorage.getItem("currentProject")).id;
        let pLocations = locations.filter( location => {
            return location.projectId == kProjectId
        });

        this.appShared.setCurrentLocations(pLocations)
        this.appShared.setCurrentLocation(pLocations[kLocation])

        localStorage.setItem("currentLocations",JSON.stringify(pLocations))
        localStorage.setItem("currentLocation",JSON.stringify(pLocations[kLocation]))

        this.router.navigate(['../../list'], { relativeTo: this.activeRoute });
      }).catch( error => {

        console.error(" ")
        console.error(" ----- ")
        console.error(" ")
        console.error(error)
        console.error(" ")
        console.error(" ----- ")
        console.error(" ")
      })
    })
    .catch( error => {
      console.error(" ERROR PATCHING THE EDIT LOCATION")

      let _project = this.location.projectId;
      let _location = error.body.error.message.split('Device Logging To Different Location')[1];

      this.notificationOptions = {
        type : 'error',
        width : '42em',
        title : 'That UID is already assigned to a location in ' + _project + ' , ' + _location,
        text : 'Please delete it from that project before assigning it to a new location'
      }
      setTimeout( x => {this.notifications.show()},500)

    })

  }

}


/**


{
  "locationId": "string",
  "description": "string",
  "projectId": "string",
  "uid": "string",
  "companyId": "string",
  "isLegacy": false,
  "clientCode": "string",
  "dashboardPages": [
    "string"
  ]
}

 */
