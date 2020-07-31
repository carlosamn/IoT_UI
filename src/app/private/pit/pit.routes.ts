import {MainComponent} from './main/main.component';
import {NotesComponent} from './notes/notes.component';
import {PitComponent} from './pit/pit.component';
import {SettingsComponent} from './settings/settings.component';
import {StatusComponent} from './status/status.component';

import { PrivateComponent } from '../private.component';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
export const PitRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/pit', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'mainPit', pathMatch: 'full' },
    		{ path: 'mainPit', component: MainComponent },
			{ path: 'notesPit', component: NotesComponent },
			{ path: 'pit', component: PitComponent },
			{ path: 'settingsPit', component: SettingsComponent },
            { path: 'statusPit', component: StatusComponent }
    	]
	},
];