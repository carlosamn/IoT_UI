import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSharedService } from '../../app.shared-service';

@Component({
  selector: 'app-web-events',
  templateUrl: './webEvents.component.html'
})
export class WebEventsComponent implements OnInit {

  constructor(private sharedservice: AppSharedService) {}

  ngOnInit() {
  }

}
