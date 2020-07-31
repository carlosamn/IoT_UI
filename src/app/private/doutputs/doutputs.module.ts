//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { ListDoutputsComponent } from './list-doutputs/list-doutputs.component';
//  Routes
import { doutputsRoutes } from './doutputs.routes';

//  Services
import { DoutputsService } from './doutputs.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(doutputsRoutes, { useHash: false })
  ],
  providers: [DoutputsService],
  exports: [],
  declarations: [ListDoutputsComponent]
})
export class DoutputsModule { }
