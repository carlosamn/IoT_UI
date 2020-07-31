import { ListAinputsComponent } from './list-ainputs/list-ainputs.component';
import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const ainputsRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/ainputs', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
    		{ path: 'list', component: ListAinputsComponent }
    	]
	},
];