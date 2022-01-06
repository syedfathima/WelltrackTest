import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { MatChip, MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from '../../../lib/api.service';
import { User } from '../../../models/user';
import { LogService } from '../../../lib/log.service';
import { UserService } from '../../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment'
import * as _ from 'lodash';

@Component({
    selector: 'user-selection-single-component',
    templateUrl: 'user-selection-single.component.html',
    styleUrls: ['./user-selection-single.component.scss'],
})

export class UserSelectionSingleComponent {


    @Input() users: User[];
    @Output() userFilterChange = new EventEmitter<Object>();
    @Output() selectedUser = new EventEmitter<Object>();
    userId: number;

    constructor(
        private api: ApiService,
        private translate: TranslateService,
        private logService: LogService,
        private userService: UserService
    ) {

    }

    onSelectUser(id:number){
        if(id){
            let matchedUser = this.users.find(user => user.id === id);
            this.selectedUser.emit(matchedUser);
        }
        else{
            this.selectedUser.emit(null);
        }
        
    }
}
