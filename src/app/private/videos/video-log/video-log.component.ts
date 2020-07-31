import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { transformYoutubeUrl } from '../../../common/filters/youtube-url-transform';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-log',
  templateUrl: './video-log.component.html',
  styleUrls: ['./video-log.component.css']
})
export class VideoLogComponent implements OnInit {
	public safeUrl;
	
	constructor(private _sanitizer: DomSanitizer) {
/*		let youtubeUrl = 'https://www.youtube.com/watch?v=ISOdW2yx14w';
		youtubeUrl = transformYoutubeUrl(youtubeUrl);
		this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(youtubeUrl);*/
	}

	ngOnInit() {}

}