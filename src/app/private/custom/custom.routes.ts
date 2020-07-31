import{CustomComponent} from './custom.component';
import{HighchartsChartComponent} from './highcharts-chart.component';
import{PrivateComponent} from '../private.component';
import{AuthenticationGuard} from '../../common/guards/authentication.guard';

export const customRoutes = [
	//  Components in private component
    { 
    	path: ':projectId/custom', 
    	component: PrivateComponent,
 		canActivate:[AuthenticationGuard],
    	children: [
    		{ path: '', redirectTo: 'custom', pathMatch: 'full' },
    		{ path: 'custom', component: CustomComponent }
    	]
	},
];