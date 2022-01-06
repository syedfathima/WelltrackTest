import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { UserService } from '../../../lib/user.service';

@Component({
    selector: 'challenge-selector',
    templateUrl: 'challenge-selector.component.html',
    styleUrls: ['./challenge-selector.component.scss']
})
export class ChallengeSelectorComponent implements OnInit {

    title: string;
    back: string;
    alerts: string;
    user: User;
    teamId: number = -1;
    @Input() challengeId: number;
    @Input() teams: any;
    @Input() challengeType: number;
    @Output() onSelected = new EventEmitter<any>();

    showPtsd: boolean = false;

    constructor(private api: ApiService,
        private log: LogService,
        private storage: StorageService,
        private translate: TranslateService,
        private modalService: ModalService,
        private userService: UserService
    ) {
        this.user = this.userService.getUser(); 
    }

    ngOnInit() {
     
    }

    onSubmit() {
        if (this.challengeType == 3 && this.teamId == -1) {
            this.modalService.showAlert('Error', 'Please choose a team');
            return;
        }

        this.api.post('challenges/selectteam', {
            TeamID: this.teamId,
            OrgID: this.user.primaryOrganization.id,
            ChallengeID: this.challengeId
        }).subscribe(
            (result: any) => {
                this.modalService.showAlert('Success', result.message);
                this.onSelected.emit();
            },

            (error: any) => {
                this.modalService.showAlert('Error', error.message);
            },
            () => {

            }
        );
    }

}
