import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../lib/auth.service';
import { UserService } from '../lib/user.service';
import { UtilityService} from '../lib/utility.service';

@Injectable()
export class OrgConfigGuard implements CanActivate {
	demoMode: boolean; 
	constructor(
		private authService: AuthService,
		private router: Router,
		private userService: UserService,
		private utilityService: UtilityService
	) {
		this.demoMode = this.utilityService.isDemoMode(); 
	}
	/*
	* This should contain all organization configuration business rules
	*/
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = state.url;

		return this.executeRedirects(url);
	}

	executeRedirects(url) {

		let user = this.userService.getUser();
		/*
		*	Change to fullAccess instead of primary org
		*   Add demographic modal
		*/
		return true;
		//org specific rules can go here but assessment force rules have changed
		//TBD..
	}

}
