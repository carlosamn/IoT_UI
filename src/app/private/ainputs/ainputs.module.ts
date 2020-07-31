//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { ListAinputsComponent } from './list-ainputs/list-ainputs.component';
//  Routes
import { ainputsRoutes } from './ainputs.routes';

//  Services
import { AinputsService } from './ainputs.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(ainputsRoutes, { useHash: false })
  ],
  providers: [AinputsService],
  exports: [],
  declarations: [ListAinputsComponent]
})
export class AinputsModule { }
