import { ListFtpsComponent } from './list-ftps/list-ftps.component';
import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const ftpsRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/ftps', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
    		{ path: 'list', component: ListFtpsComponent }
    	]
	},
];