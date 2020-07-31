import { QsoMainDashboardComponent } from './qso-maindashboard/qso-maindashboard.component';
import { QsoFracviewComponent } from './qso-fracview/qso-fracview.component';
import { QsoRealtimeComponent } from './qso-realtime/qso-realtime.component';
import { QsoJoboverviewComponent} from './qso-joboverview/qso-joboverview.component';
import {QsoSettingsComponent} from './qso-settings/qso-settings.component';


import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const QsoRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/qso', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'maindashboard', pathMatch: 'full' },
    		{ path: 'maindashboard', component: QsoMainDashboardComponent },
			{ path: 'fracview', component: QsoFracviewComponent },
			{ path: 'realtime', component: QsoRealtimeComponent },
			{ path: 'joboverview', component: QsoJoboverviewComponent },
            { path: 'settings', component: QsoSettingsComponent }
    	]
	},
];