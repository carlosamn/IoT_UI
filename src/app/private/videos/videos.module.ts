//  Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Components
import { VideoLogComponent } from './video-log/video-log.component';

//  Routes
import { videosRoutes } from './videos.routes';

//  Services
import { VideosService } from './videos.service';
@NgModule({
  imports: [
  	BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(videosRoutes, { useHash: false })
  ],
  providers: [VideosService],
  exports: [],
  declarations: [VideoLogComponent]
})
export class VideosModule { }