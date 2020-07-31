import { ListDinputsComponent } from './list-dinputs/list-dinputs.component';
import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const dinputsRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/dinputs', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
    		{ path: 'list', component: ListDinputsComponent }
    	]
	},
];