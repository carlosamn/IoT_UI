//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { AlarmsComponent } from './alarms.component';

//  Routes

//  Services
import { AlarmsService } from './alarms.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    CommonModule
  ],
  providers: [AlarmsService],
  exports: [],
  declarations: [AlarmsComponent]
})

export class AlarmsModule { }
