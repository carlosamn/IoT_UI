import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PRIVATE_ROUTES } from './private.routes';
import { FormsModule }   from '@angular/forms';
import { PrivateComponent } from './private.component';

//  Shared
import { HeaderComponent } from './shared/header/header.component';
import { ShortCutComponent } from './shared/shortcut/shortcut.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { PopUpAlarmInfoComponent } from './shared/sidebar/popup-alarm-info/popup-alarm-info.component';
import { NotificationIconComponent } from './shared/sidebar/notification-icon/notification-icon.component';
import { MainListComponent } from './shared/sidebar/main-list/main-list.component';

//  Private Modules
import { HomeModule } from './home';
import { UsersModule } from './users';
import { DevicesModule } from './devices';
import { ProjectsModule } from './projects';
import { ClientsModule } from './clients';
import { VideosModule } from './videos';
import { VideoModule } from './video';
import { LogsModule } from './logs';
import { AinputsModule } from './ainputs';
import { CompaniesModule } from './companies';
import { DinputsModule } from './dinputs';
import { DoutputsModule } from './doutputs';
import { FtpsModule } from './ftps';
import { VoltagesModule } from './voltages';
import { ContainersModule } from './containers';
import { FL3Module } from './fl3';
import { QsoModule } from './qso';
import { GraphModule } from './graph';
import { CustomModule } from './custom';
import { PicturesModule } from './pictures';
import { OhdModule } from './ohd';
import { Sensor1Module } from './sensor1';
import { LocationsModule } from './locations'
import { AlarmsModule } from './alarms';
import { WebEventsModule } from './webEvents';
import { PitModule } from './pit';
import { Pit2Module } from './pit-2'
import { SidebarModule} from './shared/sidebar';


// Services
import { ScriptService } from '../common/services/script-injection.service';
import { SensorHeaderComponent } from './pit/sensor-header/sensor-header.component';


@NgModule({
  imports: [
    HomeModule,
  	UsersModule,
    DevicesModule,
  	ProjectsModule,
    ClientsModule,
    VideosModule,
    LogsModule,
    AinputsModule,
    CompaniesModule,
    DinputsModule,
    DoutputsModule,
    FtpsModule,
    VoltagesModule,
    ContainersModule,
    FL3Module,
    FormsModule,
    CommonModule,
    VideoModule,
    GraphModule,
    CustomModule,
    PicturesModule,
    OhdModule,
    Sensor1Module,
    AlarmsModule,
    LocationsModule,
    QsoModule,
    WebEventsModule,
    PitModule,
    Pit2Module,
    //SidebarModule,
    RouterModule.forRoot(PRIVATE_ROUTES, { useHash: false })
  ],
  providers: [ScriptService],
  exports: [ShortCutComponent, HeaderComponent, SidebarComponent,MainListComponent, PopUpAlarmInfoComponent,NotificationIconComponent],
  declarations: [PrivateComponent, ShortCutComponent, HeaderComponent, SidebarComponent, LoadingComponent, MainListComponent,  PopUpAlarmInfoComponent,NotificationIconComponent]
})
export class PrivateModule { }
