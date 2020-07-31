import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';

import { ISensorQSO } from './../lib/models/ISensorQSO';
import { SensorLimitPipe } from '../lib/pipes/sensor.limits.pipe';
import { colors } from '../../../common/utilities/colors';

import { QSOStreamingService } from './../qso.service.streaming';
import { QSOSidebarMenuService } from './../qso.service.ui.sidebar.menu';
import { QSONotificationService } from './../qso.service.notifications';
import { QSOStageService } from './../qso.service.ui.stages';

@Component({
  selector: 'app-qso-sidebar-menu',
  templateUrl: './qso-sidebar-menu.component.html',
  styleUrls: ['./qso-sidebar-menu.component.less']
})
export class QsoSidebarMenuComponent implements OnInit {


  public UI = {
    visibility: false,
    isEnableAudibleAlarm: false,
    stages: [],
    stage: ''
  };

  public SUBS = {
    sidebar: <any>{},
    stages: <any>{}
  };


  constructor(private qsoStreamingService: QSOStreamingService,
    private qsoUISidebarMenuService: QSOSidebarMenuService,
    private qsoStageService: QSOStageService,
    private qsoNotificationService: QSONotificationService) { }


  ngOnInit(): void {
    this.SUBS.sidebar = this.qsoUISidebarMenuService.syncQSOSidebarMenu().subscribe(visibility => this.UI.visibility = visibility);
    this.SUBS.stages = this.qsoStageService.syncStages().subscribe(stages => this.UI.stages = stages);
  }

  ngOnDestroy(): void {
    this.SUBS.sidebar.unsubscribe();
    this.SUBS.stages.unsubscribe();
  }

  onStageSelect(stage) {
    this.qsoStageService.setStage(<number>+stage);
  }


  onToogleAlarmAudible() {
    if (!this.UI.isEnableAudibleAlarm) {
      this.UI.isEnableAudibleAlarm = true;
      this.qsoNotificationService.setEnableAudibleAlarm();
    } else {
      this.UI.isEnableAudibleAlarm = false;
      this.qsoNotificationService.setDisableAudibleAlarm();
    }

  }


}
