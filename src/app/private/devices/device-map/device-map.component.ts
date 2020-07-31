import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { } from '@types/googlemaps';

import { DevicesService } from '../devices.service';
import { ScriptService } from '../../../common/services/script-injection.service';
@Component({
  selector: 'app-device-map',
  templateUrl: './device-map.component.html',
  styleUrls: ['./device-map.component.css']
})
export class DeviceMapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;


  constructor(private scripts: ScriptService, private service: DevicesService) {
  	this.scripts.load('gmaps').then(success => {
  	let mapProp = {
  		center: new google.maps.LatLng(51.084035, -114.13072),
  		zoom: 18,
  		matTypeId: google.maps.MapTypeId.TERRAIN
  	};
  	this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  	});
  }

  ngOnInit() {

  }


}