//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { EtdDashboardComponent } from './etd-dashboard/etd-dashboard.component';
import { FL3DashboardComponent } from './fl3-dashboard/fl3-dashboard.component';

//  Routes
import { homeRoutes } from './home.routes';

//  Services
import { EtdService } from './etd.service';
import { FL3Service } from './fl3.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(homeRoutes, { useHash: false })
  ],
  providers: [EtdService, FL3Service],
  exports: [],
  declarations: [EtdDashboardComponent, FL3DashboardComponent]
})

export class HomeModule { }
