import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { ModalService } from '../../../lib/modal.service';
import { Organization } from '../../../models/organization';
import { User } from '../../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as _ from 'lodash';

@Component({
  selector: 'counselor-user-associations',
  templateUrl: './counselor-user-associations.html',
  styleUrls: ['./counselor-user-associations.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CounselorUserAssociations implements OnInit {
  isloaded = false;
  associations: any;
  organizations: Organization[] = [];
  userEmail: string = '';
  counselorEmail: string = '';
  confirmed: boolean = false; 
  organizationIds: any;

  constructor(
    private api: ApiService,
    private log: LogService,
    private modalService: ModalService,
    private translate: TranslateService) {

  }

  ngOnInit() {
    //this.loadListing(); 

    this.api.get('admin/organizations').subscribe(
      (results: any) => {
        this.organizations = Organization.initializeArray(results.data);
        this.isloaded = true;
      },
      (error: any) => {

        this.log.error('Error loading. ' + error.message);
      }
    );

    this.api.get('admin/counselorpairings').subscribe(
      (results: any) => {
        this.associations = results.data;
      },
      (error: any) => {

        this.log.error('Error loading. ' + error.message);
      }
    );
  }

  loadListing() {
    this.api.get('admin/counselorpairings', 
    { userEmail: this.userEmail, 
      counselorEmail: this.counselorEmail, 
      confirmed: this.confirmed,
      organizationIds: this.organizationIds
    }).subscribe(
      (results: any) => {
        this.associations = results.data;
      },
      (error: any) => {

        this.log.error('Error loading. ' + error.message);
      }
    );
  }

  onApprove(id: number) {
		this.api.post(`counselors/approveassociation/${id}`, {}).subscribe(
			(result: any) => {
				// let index = _.findIndex(this.associations, { 'id': id });
				this.modalService.showAlert(
					"Success",
					"Successfully approved the association!"
				);
			},
			(error: any) => {
				this.modalService.showAlert("Error", "Something went wrong!");
			}
		);
		// this.api.post('admin/counselorpairingapprove', {}).subscribe(
		//   (results: any) => {

		//   },
		//   (error: any) => {

		//     this.log.error('Error loading. ' + error.message);
		//   }
		// );
	}

	onRemove(id: number) {
		this.modalService
			.showConfirmation(
				"Delete",
				"Are you sure you want to remove the association?"
			)
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.api
						.post(`counselors/removeassociation/${id}`, {})
						.subscribe(
							(result: any) => {
								// let index = _.findIndex(this.associations, { 'id': id });
								this.modalService.showAlert(
									"Success",
									"Successfully approved the association!"
								);
							},
							(error: any) => {
								this.modalService.showAlert(
									"Error",
									"Something went wrong!"
								);
							}
						);
				}
			});
		// this.api.post('admin/counselorpairingremove', {}).subscribe(
		//   (results: any) => {

		//   },
		//   (error: any) => {

		//     this.log.error('Error loading. ' + error.message);
		//   }
		// );
	}
}
