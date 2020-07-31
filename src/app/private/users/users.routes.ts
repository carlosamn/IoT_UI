import { EtdDashboardComponent}  from '../home/etd-dashboard/etd-dashboard.component';
import { UsersPasswordComponent } from './users-password/users-password-form.component';
import { UsersCreateOrUpdateComponent } from './user-create-update/user-create-update.component';
import { UsersAdminComponent } from './users-admin/users-admin.component';
import { UsersMasterComponent } from './users-master/users-master.component';
import { UserInviteComponent } from './user-invite/user-invite.component';

import { UserCreateOrUpdate2Component } from './users-create-update2/users-create-update2.component';


import { PrivateComponent } from '../private.component';
import { AuthenticationGuard, AdminRoleGuard } from '../../common/guards/authentication.guard';

export const usersRoutes = [
    { 
    	path: ':projectId/users', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
        	{ path: '', redirectTo: 'add', pathMatch: 'full' },
            
            { path: 'create2/:userType', component: UserCreateOrUpdate2Component },
            { path: 'edit2/:userType/:userId', component: UserCreateOrUpdate2Component },

        	{ path: 'password', component: UsersPasswordComponent },
            { path: 'create/:userType', component: UsersCreateOrUpdateComponent },
			{ path: 'edit/:userType/:userId', component: UsersCreateOrUpdateComponent },
            { path: 'admin', component: UsersAdminComponent },
			{ path: 'master', component: UsersMasterComponent },
			{ path: 'dashboard', component: EtdDashboardComponent },
			{ path: 'invite', component: UserInviteComponent, canActivate: [AdminRoleGuard] }
        	// Routes here
    	] 
	}
];