import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';

import { DoutputsService } from '../doutputs.service';

@Component({
  selector: 'app-list-doutputs',
  templateUrl: './list-doutputs.component.html',
  styleUrls: ['./list-doutputs.component.css']
})
export class ListDoutputsComponent implements OnInit {

  constructor(private ainputService: DoutputsService) {}

  ngOnInit() {
  }
}