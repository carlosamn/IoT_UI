//  Components
import { ClientAddOrEditComponent } from './client-add-edit/client-add-edit.component';
import { ListClientsComponent } from './list-clients/list-clients.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const clientsRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/clients', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
    		{ path: 'list', component: ListClientsComponent },
    		{ path: 'add', component: ClientAddOrEditComponent },
            { path: 'edit/:clientId', component: ClientAddOrEditComponent }
    	] 
	}
];