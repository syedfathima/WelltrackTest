import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { StorageService } from '../../../lib/storage.service';
import { LogService } from '../../../lib/log.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { Challenge } from '../../../models/challenge';
import { User } from '../../../models/user';
import { UserService } from '../../../lib/user.service';
import { ChallengesEditComponent} from '../../../components/admin/challenges-edit/challenges-edit.component';

@Component({
	selector: 'page-challenge-listing-admin',
	templateUrl: 'challenge-listing-admin.component.html',
	styleUrls: ['./challenge-listing-admin.component.scss']
})
export class ChallengeListingAdminPage implements OnInit {

	title: string;
	back: string;
	user: User;
	challenges: Challenge[];
	isLoaded: boolean = false;

	constructor(private api: ApiService,
		private log: LogService,
		private storage: StorageService,
		private translate: TranslateService,
		private userService: UserService,
		private modalService: ModalService
	) {
		this.user = this.userService.getUser();
	}

	ngOnInit() {
		this.api.get('admin/challenges').subscribe(
			(result: any) => {
				this.challenges = Challenge.initializeArray(result.data);
				this.isLoaded = true;
			},
			(error: any) => {
				this.isLoaded = true;
			}
			);
	}

	onCreate(){
		this.modalService.setCloseonClick(false);
		const modal = this.modalService.showComponent(ChallengesEditComponent, null);

		modal.beforeClosed().subscribe((data:any) => {
			if(data){
				this.challenges = [data, ...this.challenges];
			}
		});
	}

	onEdit(id: number) {
		this.modalService.setCloseonClick(false);
		const modal = this.modalService.showComponent(ChallengesEditComponent, id);

		modal.beforeClosed().subscribe((data:any) => {
			if(data){
				const index = this.challenges.findIndex((challenge: Challenge) => challenge.id === id);
				if(index !== -1) {
					this.challenges[index] = {...this.challenges[index], ...data};
				}
			}
		});
	}

	onDelete(id) {
		this.api.delete('challenges/delete/' + id).subscribe(
			(result: any) => {
				this.challenges = this.challenges.filter((challenge) => challenge.id !== id );
			},
			(error: any) => {
				this.isLoaded = true;
			}
			);
		
	}
}
