import{PicturesComponent} from './pictures.component';
import{PrivateComponent} from '../private.component';
import{AuthenticationGuard} from '../../common/guards/authentication.guard';

export const picturesRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/pictures', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'pictures', pathMatch: 'full' },
    		{ path: 'pictures', component: PicturesComponent }
    	]
	},
];