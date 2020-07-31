import { Component, OnInit, Input, Output } from '@angular/core';

import { ISensorQSO } from '../lib/models/ISensorQSO';
import { IComlinkNotification } from './../lib/models/IComlinkNotification';

import { SensorLimitPipe } from '../lib/pipes/sensor.limits.pipe';
import { colors } from '../../../common/utilities/colors';
import { AlarmsService } from "../../alarms/alarms.service";

import { QSOStreamingService } from './../qso.service.streaming';
import { QSOSidebarMenuService } from './../qso.service.ui.sidebar.menu';
import { QSONotificationService } from './../qso.service.notifications';
import { C } from '@angular/core/src/render3';

@Component({
  selector: 'app-qso-sidebar-notifications',
  templateUrl: './qso-sidebar-notifications.component.html',
  styleUrls: ['./qso-sidebar-notifications.component.less']
})
export class QsoSidebarNotificationsComponent implements OnInit {

  public DATA = {
    comlink: <IComlinkNotification[]>[],
    alarms: [
    ]
  };


  public UI = {
    visibility: false

  };

  public SUBS = {
    visibility: <any>{},
    notifications: <any>{}
  };

  constructor(private qsoStreamingService: QSOStreamingService,
    private qsoUISidebarMenuService: QSOSidebarMenuService,
    private alarmsService: AlarmsService,
    private qsoNotificationService: QSONotificationService) { }

  async ngOnInit() {
    this.SUBS.visibility = this.qsoNotificationService.syncQSONotificationEnable()
      .subscribe(visibility => this.UI.visibility = visibility);
    this.SUBS.notifications = this.qsoNotificationService.syncQSONotifications()
      .subscribe(notifications => this.DATA.comlink = notifications);


    const initAlarms = <any[]>await this.alarmsService.updateAlarms();
    initAlarms.map(alarm => {
      if (alarm.type === 'COMSTATUS') {

        const comlinkNotification = <IComlinkNotification>{
          location: alarm.location,
          project: alarm.project,
          uid: alarm.uid,
          timestamp: alarm.timestamp,
          message: alarm.message,
          type: 'COMSTATUS'
        }


        const currentProjectId = JSON.parse(localStorage.getItem('currentProject')).id;
        if (comlinkNotification.project == currentProjectId) {
          const isNewNotification = !this.qsoNotificationService.isANewNotificationByLocationId(comlinkNotification.location.id);
          if (isNewNotification) {
            this.qsoNotificationService.addNotification(comlinkNotification);
          }


        }
      }
    });

  }

  ngOnDestroy(): void {
    this.SUBS.visibility.unsubscribe();
    this.SUBS.notifications.unsubscribe();
  }

}
