import { CompanyAddComponent } from './company-add/company-add.component';
import { ListCompaniesComponent } from './list-companies/list-companies.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
 
export const companiesRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/companies', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'add', pathMatch: 'full' },
    		{ path: 'add', component: CompanyAddComponent },
    		{ path: 'list', component: ListCompaniesComponent }
    	] 
	}
];