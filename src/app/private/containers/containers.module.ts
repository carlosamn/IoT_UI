import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Routes
import { containersRoutes } from './containers.routes';

//  Services
import { ContainersService } from './containers.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(containersRoutes, { useHash: false })
  ],
  providers: [ContainersService],
  exports: [],
  declarations: []
})
export class ContainersModule { }