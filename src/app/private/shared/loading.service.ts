import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppSharedService } from '../../app.shared-service';

@Injectable()
export class LoadingService {
	constructor(private appSharedService: AppSharedService) {}

	show() {
		 this.appSharedService.setLoadingVisibility(true);
	}

	hide() {
		this.appSharedService.setLoadingVisibility(false);
	}
}
