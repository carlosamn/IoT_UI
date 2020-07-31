import { VideoLogComponent } from './video-log/video-log.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const videosRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/videos', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'video-log', pathMatch: 'full' },
    		{ path: 'video-log', component: VideoLogComponent }
    	] 
	}
];