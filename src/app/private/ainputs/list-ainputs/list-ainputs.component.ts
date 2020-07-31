import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';

import { AinputsService } from '../ainputs.service';

@Component({
  selector: 'app-list-ainputs',
  templateUrl: './list-ainputs.component.html',
  styleUrls: ['./list-ainputs.component.css']
})
export class ListAinputsComponent implements OnInit {

  constructor(private ainputService: AinputsService) {}

  ngOnInit() {
  }
}