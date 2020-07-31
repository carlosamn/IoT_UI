import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSharedService } from '../../app.shared-service';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html'
})
export class AlarmsComponent implements OnInit {

  constructor(private sharedservice: AppSharedService) {}

  ngOnInit() {
  }

}
