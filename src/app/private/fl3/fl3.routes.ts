import { FL3GraphsComponent } from './fl3-graphs/fl3-graphs.component';
import { FL3ReportsComponent } from './fl3-reports/fl3-reports.component';
import { FL3SettingsComponent } from './fl3-settings/fl3-settings.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const fl3Routes = [
	//  Components in private component
    { 
    	path: ':projectId/fl3', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'graphs', pathMatch: 'full' },
    		{ path: 'graphs', component: FL3GraphsComponent },
    		{ path: 'reports', component: FL3ReportsComponent },
    		{ path: 'settings', component: FL3SettingsComponent }
    	]
	},
];