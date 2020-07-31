//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { Sensor1Component } from './sensor1.component';

//  Routes
import { sensor1routes } from './sensor1.routes';


@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(sensor1routes, { useHash: false })
  ],
  providers: [],
  exports: [],
  declarations: [Sensor1Component]
})
export class Sensor1Module { }