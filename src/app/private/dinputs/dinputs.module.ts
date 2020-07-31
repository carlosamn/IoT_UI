//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { ListDinputsComponent } from './list-dinputs/list-dinputs.component';
//  Routes
import { dinputsRoutes } from './dinputs.routes';

//  Services
import { DinputsService } from './dinputs.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(dinputsRoutes, { useHash: false })
  ],
  providers: [DinputsService],
  exports: [],
  declarations: [ListDinputsComponent]
})
export class DinputsModule { }
