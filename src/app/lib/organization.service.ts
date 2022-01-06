import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { ApiService } from './api.service';
import { Organization } from '../models/organization';

@Injectable()
export class OrganizationService {

    constructor(
        private apiService: ApiService
    ) {

    }

    hasCourseAccess(courses, name) {

        const course = _.find(courses, { 'name': name })

        if (course && course['enabled']) {
            return course['enabled'];
        }
        else {
            return false;
        }

    }

    orgSelectorValues() {
        return new Promise(resolve => {
            this.apiService.get('admin/organizations').subscribe(
                (result: any) => {
                    resolve(result);
                }
            );
        }).then((result: any) => {
            return Organization.initializeArray(result.data);
        });
    }

}