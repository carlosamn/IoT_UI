import { LogsDataComponent } from './log-data/log-data.component';
import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const logsRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/logs', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'data', pathMatch: 'full' },
    		{ path: 'data', component: LogsDataComponent }
    	]
	},
];