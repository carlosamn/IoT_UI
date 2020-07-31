import { ListDoutputsComponent } from './list-doutputs/list-doutputs.component';
import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const doutputsRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/doutputs', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
    		{ path: 'list', component: ListDoutputsComponent }
    	]
	},
];