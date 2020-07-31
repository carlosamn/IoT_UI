import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { AddProjectComponent } from './add-project/add-project.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const projectsRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/projects', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'list', pathMatch: 'full' },
    		{ path: 'list', component: ListProjectsComponent },
    		{ path: 'add', component: AddProjectComponent }
    	] 
	},
	//  Free components without a layout
	{
		path: 'projects',
		canActivate: [AuthenticationGuard],
		children: [
			{ path: '', redirectTo: 'choose', pathMatch: 'full' },
        	{ path: 'choose', component: ChooseProjectComponent }
    	] 
	}
];