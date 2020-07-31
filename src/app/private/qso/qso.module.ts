//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { QsoMainDashboardComponent } from './qso-maindashboard/qso-maindashboard.component';
import { QsoMainDashboardControllerComponent } from './qso-maindashboard/qso-maindashboard-controller/qso-maindashboard-controller.component';

import { QsoFracviewComponent } from './qso-fracview/qso-fracview.component';
import { QsoRealtimeComponent } from './qso-realtime/qso-realtime.component';
import { QsoJoboverviewComponent } from './qso-joboverview/qso-joboverview.component';
import { QsoSettingsComponent } from './qso-settings/qso-settings.component';

import { QsoControllerComponent } from './qso-controller/qso-controller.component';
import { QsoSidebarMenuComponent} from './qso-sidebar-menu/qso-sidebar-menu.component';
import { QsoSidebarNotificationsComponent} from './qso-sidebar-notifications/qso-sidebar-notifications.component';

//  Pipes
import { SensorLimitPipe } from './lib/pipes/sensor.limits.pipe'; // import our pipe here
import { MathcesCategoryPipe} from './lib/pipes/sensor.list.pipe'; // import our pipe here

//  Routes

import { QsoRoutes } from './qso.routes';
//  Services

import { LoadingService } from '../shared/loading.service';
import { DevicesService } from '../devices/devices.service';
import { EtdService } from '../home/etd.service';
import { QSOService } from './qso.service';
import { QSOStreamingService } from './qso.service.streaming';
import { QSONotificationService } from './qso.service.notifications';
import { QSOSidebarMenuService } from './qso.service.ui.sidebar.menu';
import { QSOStageService } from './qso.service.ui.stages';
import { QSOChartService } from './qso.service.ui.charts';

//  Third Party Modules
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    CommonModule,
    SweetAlert2Module,
    DragulaModule.forRoot(),
    RouterModule.forRoot(QsoRoutes, { useHash: false })
  ],
  providers: [LoadingService, DevicesService, EtdService, QSOService,
              QSOStreamingService, QSOStageService, QSOChartService,
              QSONotificationService, QSOSidebarMenuService ],
  exports: [QsoSidebarMenuComponent, QsoSidebarNotificationsComponent],
  declarations: [
    QsoControllerComponent,
    QsoMainDashboardComponent,
    QsoMainDashboardControllerComponent,
    QsoFracviewComponent,
    QsoRealtimeComponent,
    QsoJoboverviewComponent,
    QsoSettingsComponent,
    QsoSidebarMenuComponent,
    QsoSidebarNotificationsComponent,
    SensorLimitPipe,
    MathcesCategoryPipe
  ]
})
export class QsoModule {}
