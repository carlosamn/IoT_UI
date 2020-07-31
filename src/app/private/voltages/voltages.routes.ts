import { ListVoltagesComponent } from './list-voltages/list-voltages.component';
import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const voltagesRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/voltages', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
    		{ path: 'list', component: ListVoltagesComponent }
    	]
	},
];