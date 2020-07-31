import { OhdComponent } from './ohd.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const ohdroutes = [
	//  Components in private component
    { 
    	path: ':projectId/ohd', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'ohd', pathMatch: 'full' },
    		{ path: 'ohd', component: OhdComponent }
    	] 
	}
];