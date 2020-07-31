import { Sensor1Component } from './sensor1.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const sensor1routes = [
	//  Components in private component
    { 
    	path: ':projectId/sensor1', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'sensor1', pathMatch: 'full' },
    		{ path: 'sensor1', component: Sensor1Component }
    	] 
	}
];