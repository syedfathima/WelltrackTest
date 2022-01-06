import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../lib/auth.service';
import { UserService } from '../lib/user.service';

@Injectable()
export class AclGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router, private userService: UserService) {

	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = state.url;
		let roles = route.data["role"];
	
		let user = this.userService.getUser();

		if (roles) {
			if (((user.primaryOrganization && roles.indexOf(user.userType) !== -1 ) || user.userType == 'admin' || user.userType == 'superadmin')) {
				return true
			}
			else {
				this.router.navigate(['/app']);
				return false
			}
		}
		else {
			return true
		}

	}

}
