import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../lib/auth.service';
import { UserService } from '../lib/user.service';

@Injectable()
export class AssociatedGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router, 
		private userService: UserService) {

	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = state.url;
		let user = this.userService.getUser();

		if (!user.primaryOrganization && user.userType === 'user') {
			this.router.navigate(['/access-code']);
			return true;
		}
		return true;
	}

}