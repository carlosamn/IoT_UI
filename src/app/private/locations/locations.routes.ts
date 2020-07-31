import { LocationsAddEditComponent } from './locations-add-edit/locations-add-edit.component';
import { LocationsSetupComponent } from './locations-setup/locations-setup.component';
import { LocationsListComponent } from './locations-list/locations-list.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';

export const LocationsRoutes = [
	//  Components in private component
    {
    	path: ':projectId/locations',
    	component: PrivateComponent,
 		  canActivate:[AuthenticationGuard],
    	children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: LocationsListComponent },
          { path: 'add', component: LocationsAddEditComponent },
          { path: 'edit/:locationId', component: LocationsAddEditComponent },
          { path: 'locations-setup', component: LocationsSetupComponent }
    	]
	}
];
