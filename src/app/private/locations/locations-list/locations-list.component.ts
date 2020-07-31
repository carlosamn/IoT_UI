import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { LocationsService } from '../locations.service';
import { FL3Service } from '../../fl3/fl3.service';
import { AppSharedService } from '../../../app.shared-service';




declare var jquery: any;
declare var $: any;



@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.css']
})

export class LocationsListComponent implements OnInit {

  public locations;
  public location;
  public updflag;
  public currentProject;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

      // RXJS Subscriptions
      public SUBS = {
        DtOptions: <any>{},
        locations: <any>{},
        location: <any>{},
        user: <any>{},
        project: <any>{}
      };

  constructor (
    private sharedService: AppSharedService,
    private locationsService: LocationsService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fl3Service: FL3Service
  ) {
    this.currentProject = localStorage.getItem('currentProject');
    this.locations = [];
    this.location = {};
  }


  async ngOnInit() {


    this.SUBS.DtOptions = this.sharedService.currentDtOptions.subscribe(options => this.dtOptions = options);
    this.SUBS.locations = this.sharedService.currentLocationsObj.subscribe(locations => {
      this.locations = Object.values(locations);

    });

    let locations = await this.locationsService.updateLocationsFromServerPromise();
    this.sharedService.setCurrentLocations(locations);
    this.dtTrigger.next();
    console.log("locationlist-component update locations ")
    console.log(locations)


  }

  private getLocationsByProject() {
    this.locationsService.getLocations()
      .subscribe(locations => {
        this.locations = locations;
        this.dtTrigger.next();
      }, err => {
        //console.error(err);
      });
  }

  public deleteLocation(locationId, index) {
    if (confirm("Do you want to permanently delete this Location?")) {
        this.locationsService.deleteLocationById(locationId).then( async response => {
        let locations = await this.locationsService.updateLocationsFromServerPromise();
        this.sharedService.setCurrentLocations(locations)
        });
    } else {
      return false;
    }
  }


}
