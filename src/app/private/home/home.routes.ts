import { EtdDashboardComponent } from './etd-dashboard/etd-dashboard.component';
import { FL3DashboardComponent } from './fl3-dashboard/fl3-dashboard.component';
import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const homeRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/etd_dashboard', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', component: EtdDashboardComponent }
    	]
	},
	{
    	path: ':projectId/fl3_dashboard',
    	component: PrivateComponent,
    	canActivate: [AuthenticationGuard],
    	children: [
    		{ path: '', component: FL3DashboardComponent }
    	]
	}
];