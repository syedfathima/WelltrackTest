import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilityService } from './utility.service';
import 'rxjs/Rx';
import { Subject } from 'rxjs';
import { User } from '../models/user';

import * as _ from 'lodash';

@Injectable()

export class PermissionsService {

    user:User; 

    constructor(
        private storage: StorageService,
        private utilService: UtilityService
    ) {
    }

    setUser(user: User){
        this.user = user; 
    }

    isExecutive(){
        if(this.user.permissions.aggregateView){
            return true; 
        }
        else{
            return false; 
        }
    }

    isAdmin(){
        return this.user.userType === 'admin';
    }

    hasFullAccess(){
        return this.user.isFullAccess;
    }

    canViewScheduler(){
        if( this.user.primaryOrganization){
            if(this.user.primaryOrganization.settings.enableBuddyScheduling && this.user.permissions.scheduleUsers){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false; 
        }
    }

    canViewOldExecutiveDashboard(){
        if( this.user.primaryOrganization){
            if(this.user.primaryOrganization.settings.showOldDashboard){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false; 
        }
    }
    



}