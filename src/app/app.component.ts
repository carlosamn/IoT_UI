import { Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSharedService } from './app.shared-service';
import { AuthenticationService } from './public/authentication/authentication.service';
import { Title } from '@angular/platform-browser';
import * as helpers from './common/filters/text-transform';
import { AlarmsService } from "./private/alarms/alarms.service";
import { WebEventsService } from "./private/webEvents/webEvents.service";
import { LocationsService } from './private/locations/locations.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthenticationService,
    private router: Router,
    private titleService: Title,
    private alarmsService: AlarmsService,
    private webEventsService: WebEventsService,
    private deviceService: DeviceDetectorService,
    private sharedService: AppSharedService) {
  }


  private deviceInfo;

  public setTitle(newTitle: string, role: string) {
    if (newTitle == 'undefined' || role == 'undefined') this.titleService.setTitle('eTrackdata');
    else this.titleService.setTitle(`${helpers.capitalize(newTitle)} - ${helpers.capitalize(role)}`);
  }

  async ngOnInit() {

    let token = this.authService.getToken();
    if (token) {
      let user = await this.me();
    }
    else {
      this.router.navigate(['/login']);
    }


    let initAlarms = await this.alarmsService.updateAlarms();
    this.sharedService.setCurrentAlarms(initAlarms)
    await this.delayTimer();

    this.alarmsService.startAlarmsService();
    this.webEventsService.startWebEventService();


  }

  async ngOnDestroy() {
    this.alarmsService.closeAlarmsService();
    this.webEventsService.closeWebEventService();
  }

  public delayTimer() {
    return new Promise((resolve, reject) => {
      setTimeout(x => {
        resolve("Timmer is Over, Go Next Step")
      }, 100);
    });
  }

  me() {
    return new Promise<any>(resolve => {
      this.authService.me()
        .subscribe(user => {
          resolve(user);
        }, err => {
          this.logout();
          resolve('');
        });
    });
  }

  logout() {
    this.authService
      .logout()
      .subscribe(res => {
        this.router.navigate(['/login']);
      }, err => {
        this.authService.removeToken();
        this.router.navigate(['/login']);
      });
  }

}
