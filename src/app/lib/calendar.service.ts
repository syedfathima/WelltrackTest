import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilityService } from './utility.service';
import 'rxjs/Rx';
import { Subject } from 'rxjs';



import * as _ from 'lodash';

@Injectable()
export class CalendarService {

    refresh = new Subject();
    inviteClose = new Subject();

    constructor(

    ) {

    }

    triggerRefresh() {
        this.refresh.next();
    }

    triggerInviteClose() {
        this.inviteClose.next();
    }


}
