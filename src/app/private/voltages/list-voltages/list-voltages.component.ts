import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';

import { VoltagesService } from '../voltages.service';

@Component({
  selector: 'app-list-voltages',
  templateUrl: './list-voltages.component.html',
  styleUrls: ['./list-voltages.component.css']
})
export class ListVoltagesComponent implements OnInit {

  constructor(private ainputService: VoltagesService) {}

  ngOnInit() {
  }
}