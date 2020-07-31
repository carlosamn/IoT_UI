import { GraphComponent } from './graph/graph.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const graphRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/graph', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'graph', pathMatch: 'full' },
    		{ path: 'graph', component: GraphComponent }
    	] 
	}
];