import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import{PicturesComponent} from './pictures.component'

//route
import{picturesRoutes} from './pictures.routes';

@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(picturesRoutes, { useHash: false })
  ],
  providers: [],
  exports: [],
  declarations: [PicturesComponent]
})
export class PicturesModule { }