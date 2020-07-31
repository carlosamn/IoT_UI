import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { PublicComponent } from '../public.component';

export const authRoutes = [
    { 
    	path: '', component: PublicComponent, children: [
    		{ path: '', redirectTo: 'login', pathMatch: 'full' },
        	{ path: 'login', component: LoginComponent }
    	] 
	}
];