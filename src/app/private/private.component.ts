import { Component, OnInit } from '@angular/core';
import { AlarmsService } from "./alarms/alarms.service";
import { WebEventsService } from "./webEvents/webEvents.service";
import {AppSharedService} from '../app.shared-service';
import {LocationsService} from './locations/locations.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {

  constructor(private webEventsService : WebEventsService, private sharedService: AppSharedService, private alarmsService : AlarmsService) {


  }

  async ngOnInit() {


  }






}
