import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../public/authentication/authentication.service';
import { AppSharedService } from '../../app.shared-service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  	let isLogged = this.authService.isLoggedIn();
    if(isLogged) return true;
    else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    }
    return false;
  }
}

@Injectable()
export class AdminRoleGuard implements CanActivate {

  constructor(private router: Router,  private sharedService: AppSharedService) {}

  canActivate() {
  	let activate;
    this.sharedService.currentUserObject.subscribe(user => {
    	let userRole = user['userType'];
    	if(userRole === 'webmaster' || userRole === 'admin' || userRole === 'sysadmin') activate = true;
    	else activate = false;
    });

    if(activate) return true;
	else {
		this.router.navigate(['/projects/choose']);
		return false;
	}
  }
}
