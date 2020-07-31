//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { DeviceAddOrEditComponent } from './device-add-edit/device-add-edit.component';
import { DeviceMapComponent } from './device-map/device-map.component';
import { DeviceSetupComponent } from './device-setup/device-setup.component';
import { DeviceSetup2Component } from './device-setup2/device-setup2.component';
import { MobileLocationsCard } from './device-setup/mobile-locations-card/mobile-locations-card.component';
import { MobileAnalogsCard } from './device-setup/mobile-analogs-card/mobile-analogs-card.component';
import { DeviceListComponent } from './device-list/device-list.component';
//  Routes
import { devicesRoutes } from './devices.routes';

//  Services
import { DevicesService } from './devices.service';

//  Third party module
import { DataTablesModule } from 'angular-datatables';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { LaInputMaskModule } from 'la-input-mask';


@NgModule({
  imports: [
    DataTablesModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    LaInputMaskModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(devicesRoutes, { useHash: false })
  ],
  providers: [DevicesService],
  exports: [],
  declarations: [DeviceAddOrEditComponent,
    DeviceMapComponent,
    MobileLocationsCard,
    MobileAnalogsCard, DeviceSetupComponent, DeviceListComponent, DeviceSetup2Component]
})

export class DevicesModule { }
