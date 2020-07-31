import { DeviceAddOrEditComponent } from './device-add-edit/device-add-edit.component';
import { DeviceMapComponent } from './device-map/device-map.component';
import { DeviceSetupComponent } from './device-setup/device-setup.component';

import { DeviceListComponent } from './device-list/device-list.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';

export const devicesRoutes = [
	//  Components in private component
    {
    	path: ':projectId/devices',
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: DeviceListComponent },
    		{ path: 'add', component: DeviceAddOrEditComponent },
            { path: 'edit/:deviceId', component: DeviceAddOrEditComponent },
    		{ path: 'map', component: DeviceMapComponent },
            { path: 'device-setup', component: DeviceSetupComponent }
        ]
	}
];