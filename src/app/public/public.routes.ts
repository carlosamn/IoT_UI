import { Routes, RouterModule } from '@angular/router';


export const PUBLIC_ROUTES: Routes = [
	{ path: 'authentication', loadChildren: 'app/public/authentication#AuthenticationModule' }
];