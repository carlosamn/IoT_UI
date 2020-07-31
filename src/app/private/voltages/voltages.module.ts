//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { ListVoltagesComponent } from './list-voltages/list-voltages.component';
//  Routes
import { voltagesRoutes } from './voltages.routes';

//  Services
import { VoltagesService } from './voltages.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(voltagesRoutes, { useHash: false })
  ],
  providers: [VoltagesService],
  exports: [],
  declarations: [ListVoltagesComponent]
})
export class VoltagesModule { }
