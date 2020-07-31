import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';

import { DinputsService } from '../dinputs.service';

@Component({
  selector: 'app-list-dinputs',
  templateUrl: './list-dinputs.component.html',
  styleUrls: ['./list-dinputs.component.css']
})
export class ListDinputsComponent implements OnInit {

  constructor(private ainputService: DinputsService) {}

  ngOnInit() {
  }
}