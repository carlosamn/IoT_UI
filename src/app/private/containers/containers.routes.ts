import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const containersRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/containers', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    	] 
	}
];