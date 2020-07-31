//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { OhdComponent } from './ohd.component';

//  Routes
import { ohdroutes } from './ohd.routes';


@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(ohdroutes, { useHash: false })
  ],
  providers: [],
  exports: [],
  declarations: [OhdComponent]
})
export class OhdModule { }