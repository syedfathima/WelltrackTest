import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { MatChip, MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from '../../../lib/api.service';
import { User } from '../../../models/user';
import { LogService } from '../../../lib/log.service';
import { UserService } from '../../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment'
import * as _ from 'lodash';

@Component({
    selector: 'user-selection-component',
    templateUrl: 'user-selection.component.html',
    styleUrls: ['./user-selection.component.scss'],
})

export class UserSelectionComponent implements OnInit {
    displayedColumns: string[] = [ 'fullName', 'email', 'id'];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    multiple = true;
    tableRows: Array<Object> = [];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() users: User[];
    activeUsers: User[];
    selectUsers: User[];
    userSelected: number;
    @Output() userFilterChange = new EventEmitter<Object>();
    @Output() selectedUser = new EventEmitter<Object>();

    constructor(
        private api: ApiService,
        private translate: TranslateService,
        private logService: LogService,
        private userService: UserService
    ) {

    }

    ngOnInit() {
        this.activeUsers = this.users;
        this.activeUsers.forEach(user => {
            user.selected = true;
            this.tableRows.push(
                {
                    'fullName': user.fullName,
                    'email': user.email,
                    'id': user.id,
                }
            );
        });
    }

    onChipClick(activeUser) {
        const index = this.activeUsers.indexOf(activeUser);
        this.activeUsers[index].selected = !this.activeUsers[index].selected;
        this.updateUsers();
    }


    remove(activeUser: User): void {
        const index = this.activeUsers.indexOf(activeUser);

        if (index >= 0) {
            this.activeUsers.splice(index, 1);
        }

        this.updateUsers();
    }

    resetList() {
        this.users.forEach(user => {

        });
    }

    updateUsers() {
        let activeUsers = _.filter(this.activeUsers, { 'selected': true });
        this.userFilterChange.emit(activeUsers);
    }

    onSelectUser(id){
        this.selectedUser.emit({id: id});
    }
}
