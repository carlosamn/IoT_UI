import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../public/authentication/authentication.service';
import { AppSharedService } from '../../../app.shared-service';

import { FtpsService } from '../ftps.service';

@Component({
  selector: 'app-list-ftps',
  templateUrl: './list-ftps.component.html',
  styleUrls: ['./list-ftps.component.css']
})
export class ListFtpsComponent implements OnInit {

  constructor(private ftpService: FtpsService) {}

  ngOnInit() {
  }
}