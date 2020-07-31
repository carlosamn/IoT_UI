//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { WebEventsComponent } from './webEvents.component';

//  Routes

//  Services
import { WebEventsService } from './webEvents.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    CommonModule
  ],
  providers: [WebEventsService],
  exports: [],
  declarations: [WebEventsComponent]
})

export class WebEventsModule { }
