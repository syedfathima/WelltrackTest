import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/lib/user.service';
import { LogService } from '../../../app/lib/log.service';
import { CrisisHotline, LocationService } from '../../../app/lib/location.service';
import { ModalService } from '../../lib/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../lib/api.service';
import { Organization } from '../../../app/models/organization';
import { StorageService } from '../../lib/storage.service';

declare var window;

@Component({
	selector: 'emergency-contact',
	templateUrl: 'emergency-contact.component.html',
	styleUrls: ['./emergency-contact.component.scss']
})
export class EmergencyContactComponent implements OnInit {

	hotline: CrisisHotline;
	dialing: boolean;
	@Input() user: User;
	popupText: any;
	emergencyContact: string;
	organization: Organization;
	isloaded: boolean = false;
	contactGroupTelephone: string;
	showOther: boolean;

	constructor(
		private userService: UserService,
		private log: LogService,
		private modalService: ModalService,
		private locationService: LocationService,
		private translate: TranslateService,
		private api: ApiService,
		private storage: StorageService
	) {
		this.dialing = false;
	}

	ngOnInit() {
		this.log.screen('Emergency Help');
		this.log.event('emergency_help');

		this.translate.get('contact').subscribe((res: any) => {
			this.popupText = res;

		});
		this.locationService.getLocation().subscribe(
			(data: any) => {
				this.hotline = this.locationService.getHelpline(data.country_name, data.zip_code);
			}
		);

		let orgId;
		if (this.storage.get('orgselect')) {
			orgId = this.storage.get('orgselect')
		} else {
			if (this.user.primaryOrganization) {
				orgId = this.user.primaryOrganization.id;
			}
		}

		if (orgId) {
			this.api.get('organizations/' + orgId).subscribe(
				(result: any) => {
					this.organization = new Organization(result.data);
					if (this.organization.contactGroup.telephone) {
						this.contactGroupTelephone = this.organization.contactGroup.telephone;
					} else if (this.organization.emergencyContact) {
						this.emergencyContact = this.organization.emergencyContact;
					} else {
						this.showOther = true;
					}
				},
				(error: any) => {
					this.log.error('Error getting organization. ' + error.message);
				},
				() => {
					this.isloaded = true;
				});
		}
	}

	onHotline(event: MouseEvent) {
		this.log.event('hotline_called');
	}

	on911(event: MouseEvent) {
		if (this.dialing) {
			this.dialing = false;
		} else {
			event.preventDefault();
			this.modalService.showConfirmation(this.popupText.popTitle, this.popupText.popup911).afterClosed().subscribe(result => {
				if (result) {
					this.log.event('911_called');
					this.dialing = true;
					event.target.dispatchEvent(new MouseEvent('click'));
				}
			}
			);
		}
	}

	onCallContact(event: MouseEvent) {
		if (this.dialing) {
			this.dialing = false;
		} else {
			event.preventDefault();
			const hotLineText = (this.user.primaryOrganization && this.user.primaryOrganization.settings['assessment'] === 'resilience') ? this.popupText.popupEmergencyTextVeteran : this.popupText.popupEmergencyHotline;
			this.modalService.showConfirmation(this.popupText.popTitle, hotLineText).afterClosed().subscribe(result => {
				if (result) {
					this.log.event('protocall_number_called');

					this.api.post('analytics/supportlineclick', { phoneNumber: this.contactGroupTelephone }).subscribe(
						(result: any) => {
							this.log.debug('Activity logged');
						},
						(error: any) => {
							this.log.debug('Something went wrong with the activity logger.');
						}
					);

					this.dialing = true;
					event.target.dispatchEvent(new MouseEvent('click'));
				}
			}
			);
		}
	}

}
