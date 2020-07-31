import {MainComponent} from './main/main.component';
import {NotesComponent} from './notes/notes.component';
import {EfmComponent} from './efm/efm.component';
import {SettingsComponent} from './settings/settings.component';
import {StatusComponent} from './status/status.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
export const PitRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/pit2', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'mainPit2', pathMatch: 'full' },
    		{ path: 'mainPit2', component: MainComponent },
			{ path: 'notesPit2', component: NotesComponent },
			{ path: 'pit2', component: EfmComponent },
			{ path: 'settingsPit2', component: SettingsComponent },
            { path: 'statusPit2', component: StatusComponent }
    	]
	},
];