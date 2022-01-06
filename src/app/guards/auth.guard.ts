import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../lib/auth.service';
import { UserService } from '../lib/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private userService: UserService) {

	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = state.url;
		return this.checkLogin(url);
	}

	checkLogin(url: string): boolean {
		if (this.authService.isAuthenticated()) {
			let user = this.userService.getUser();
			if (user.userType && user.userType === 'user' && user.forceAssessment && url !== '/app' && url.search('assessment') === -1) {
				this.router.navigate(['/']);
				return false;
			} else {
				return true;
			}
		}
		//this.authService.redirectUrl = url;
		// Navigate to the login page with extras
		this.router.navigate(['/'], { queryParams: { redirect: url } });
		return false;
	}
}
