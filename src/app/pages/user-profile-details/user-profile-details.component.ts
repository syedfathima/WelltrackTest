import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../lib/api.service';
import { ModalService } from '../../lib/modal.service';
import { LogService } from '../../lib/log.service';
import { User } from '../../models/user';
import { Activity } from '../../models/activity';
import { UserService } from '../../lib/user.service';
import { UserEditComponent } from '../../components/admin/user-edit/user-edit.component';


@Component({
	selector: 'app-user-profile-details',
	templateUrl: './user-profile-details.component.html',
	styleUrls: ['./user-profile-details.component.scss']
})
export class UserProfileDetailsComponent implements OnInit {

	user: User;
	id: number;
	isloaded: boolean = false;
	offset: number = 0;
	activity: Activity[] = [];
	paramsSub: any;
	showMoreLink: boolean = true;

	constructor(
		private api: ApiService,
		private modalService: ModalService,
		private log: LogService,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
	) { }

	ngOnInit() {
		this.paramsSub = this.activatedRoute.params.subscribe(params => this.id = parseInt(params['id'], 10));
		this.user = this.userService.getUser();

		this.getUserDetails(this.id);
		this.getActivity();
	}

	getUserDetails(id: number){
		this.api.get('users/' + id, {
		}).subscribe(
			(result: any) => {
				this.user = new User(result.data);
				this.log.debug('fetched');
				this.log.debug(this.user);

				this.isloaded = true;
			},
			(error: any) => {
				this.log.error('Error fetching user. ' + error.message);
			}
		);
	}

	showMore() {
		this.offset = this.activity.length;
		this.getActivity();
	}

	getActivity() {

		this.api.post('users/activity', {
			UserID: this.id,
			Limit: 20,
			Offset: this.offset,
		}).subscribe(
			(result: any) => {
				if (result.data.length > 0) {
					for (let i = 0; i < result.data.length; i++) {
						this.activity.push(new Activity(result.data[i]));
					}
				} else {
					this.showMoreLink = false;
				}

			},
			(error: any) => {
				this.log.error('Error fetching activity. ' + error.message);
			}
		);
	}

	onEdit() {
		this.modalService
			.showComponent(UserEditComponent, this.user.id)
			.beforeClosed()
			.subscribe(() => {
				this.getUserDetails(this.user.id);
			});
	}

	onResendWelcome() {

		this.api.post('users/resendwelcome', {
			UserID: this.id,
		}).subscribe(
			(result: any) => {
				this.modalService.showAlert('Success', 'Welcome email has been sent');
			},
			(error: any) => {
				this.modalService.showAlert('Error', 'Something went wrong. Please try again.');
			}
		);

	}

	onResendConfirmation() {

		this.api.post('users/resendconfirmation', {
			UserID: this.id,
		}).subscribe(
			(result: any) => {
				this.modalService.showAlert('Success', 'Confirmation email has been sent');
			},
			(error: any) => {
				this.modalService.showAlert('Error', 'Something went wrong. Please try again.');
			}
		);

	}

	onDelete() {
		this.modalService.showConfirmation("Delete", "Are you sure you want to delete this account?").afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('users/' + this.id).subscribe(
					(result: any) => {
						this.modalService.showAlert('Success', 'User has been deleted');
					},
					(error: any) => {
						this.modalService.showAlert('Error', 'Something went wrong. Please try again.');
					}
				);
			}
		});

	}

	makeZoomAccount(){
		this.modalService.showConfirmation("Create Zoom Account", "Are you sure you want to create a zoom account for this account?").afterClosed().subscribe(result => {
			if (result) {
				this.api.post('zoom/user',
				{
				 email :this.user.email
				}
			  ).subscribe(
				(data: any) => {
				  this.modalService.showAlert('Success', 'User has been sent an invitation to join zoom under this email address.');
				  this.user.zoomPersonalMeetingUrl = "testurl";
				},
				(error: any) => {
				  this.modalService.showAlert('Error', error.message);
				  this.user.zoomPersonalMeetingUrl = "testurl";
				}
			  );
			}
		});
	}

	deleteZoomAccount(){
		this.modalService.showConfirmation("Delete", "Are you sure you want to delete the zoom account for this account?").afterClosed().subscribe(result => {
			if (result) {
				this.api.delete('zoom/user',
				{
				 email :this.user.email
				}
			  ).subscribe(
				(data: any) => {
				  this.modalService.showAlert('Success', 'The zoom account has been deleted successfully.');
				},
				(error: any) => {
				  this.modalService.showAlert('Error', error.message);
				}
			  );
			}
		});
	}

}
