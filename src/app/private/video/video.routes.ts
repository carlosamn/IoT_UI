import { VideoComponent } from './video/video.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const videoRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/video', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'video', pathMatch: 'full' },
    		{ path: 'video', component: VideoComponent }
    	] 
	}
];