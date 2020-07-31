import { EtdDashboardComponent}  from '../../home/etd-dashboard/etd-dashboard.component';
import { MainListComponent } from './main-list/main-list.component'

import { PrivateComponent } from '../../private.component';
import { AuthenticationGuard, AdminRoleGuard } from '../../../common/guards/authentication.guard';

export const SidebarRoutes = [

     
   { 
    	path: ':projectId/etd_dashboard', 
    	component: PrivateComponent,
    	children: [
    		{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        	{ path: 'dashboard', component: EtdDashboardComponent }
    	]
	}
];