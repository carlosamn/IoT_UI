//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { VideoComponent } from './video/video.component';

//  Routes
import { videoRoutes } from './video.routes';

//  Services
import { VideoService } from './video.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(videoRoutes, { useHash: false })
  ],
  providers: [VideoService],
  exports: [],
  declarations: [VideoComponent]
})
export class VideoModule { }