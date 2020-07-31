import { Component, OnInit } from '@angular/core';
import { AppSharedService } from '../../../app.shared-service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  public status: boolean = false;
  constructor(private appSharedService: AppSharedService) {
    this.appSharedService.currentLoaderStatus.subscribe(status => this.status = status);
  }
}
