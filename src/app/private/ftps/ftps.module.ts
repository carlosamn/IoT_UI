//  Core modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { ListFtpsComponent } from './list-ftps/list-ftps.component';
//  Routes
import { ftpsRoutes } from './ftps.routes';

//  Services
import { FtpsService } from './ftps.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(ftpsRoutes, { useHash: false })
  ],
  providers: [FtpsService],
  exports: [],
  declarations: [ListFtpsComponent]
})
export class FtpsModule { }
