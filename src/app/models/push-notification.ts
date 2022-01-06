import { Organization } from './organization';

/*
day: "Tuesday"
orgIds: Array(2)
0: 2518
1: 2513
length: 2
__proto__: Array(0)
pushTypeSelected: "organization"
recurring: true
revisions: Array(1)
0: {title: "asfda", body: "afdaa", languagePrefix: "en"}
length: 1
__proto__: Array(0)
scheduledDate: Fri May 14 2021 18:50:32 GMT-0300 (Atlantic Daylight Time)
__proto__: Object
time: "1:00 PM"
url: ""
*/
import * as _ from 'lodash';
import { User } from './user';
import * as moment from 'moment';

export class PushNotification {
    id: number;
    scheduledDate: Date;
    recurring: boolean;
    day: string;
    time: string;
    status: number;
    type: string;
    revisions: PushNotificationRevision[] = [];
    orgIds: Array<number>;
    organizations: Organization[] = [];
    isGlobal: boolean;
    orgNames: string;
    user: User; 

    constructor(data: any) {
        if (data) {
            this.id = data.ID || data.id;
            this.scheduledDate = data.ScheduledDate || data.scheduledDate;
            this.recurring = data.Recurring || data.recurring || false;
            this.day = data.Day || data.day || "";
            this.time = data.Time || data.time || "";
            this.status = data.Status || data.status || 0;
            this.orgIds = data.orgIds || data.OrgIds;
            this.isGlobal = data.IsGlobal || data.isGlobal;
            this.type = data.type || data.Type;
            this.user = data.user || data.User;
            this.initializeOrganizations(data.Organizations || data.organizations);
            this.initializeRevisions(data.Revisions || data.revisions);
            this.orgNames = this.organizationNames();
        }
    }
    public initializeRevisions(objects?: any) {
        if (objects && objects.length) {
            for (let i = 0; i < objects.length; i++) {
                let obj = new PushNotificationRevision(objects[i]);
                this.revisions.push(obj);
            }
        }
        else {
            let obj = new PushNotificationRevision();
            this.revisions.push(obj);
        }
    }

    public initializeOrganizations(objects?: any) {
        if (objects && objects.length) {
            for (let i = 0; i < objects.length; i++) {
                let obj = new Organization(objects[i]);
                this.organizations.push(obj);
            }
        }
    }

    public organizationNames() {
        if (this.organizations) {
            const names = _.map(this.organizations, 'name');
            const listNames = _.join(names, ',');
            return listNames;
        }
        else {
            return 'None';
        }
    }

    public static initializeArray(objects: any): PushNotification[] {
        let results: PushNotification[] = [];
        for (let i = 0; i < objects.length; i++) {
            let obj = new PushNotification(objects[i]);
            results.push(obj);
        }
        return results;
    }

    public static forAPI(pushNotification: PushNotification) {
        return {
            ID: pushNotification.id,
            ScheduledDate: pushNotification.scheduledDate,
            Recurring: pushNotification.recurring,
            Day: pushNotification.day,
            Time: pushNotification.time,
            Status: pushNotification.status,
            Revisions: pushNotification.revisions,
            Type: pushNotification.type,
            OrgIds: pushNotification.orgIds
        };
    }
}
export class PushNotificationRevision {
    id: number;
    title: string;
    body: string;
    url: string;
    languagePrefix: string;
    constructor(data?: any) {
        if (data) {
            this.id = data.ID || data.id;
            this.title = data.Title || data.title;
            this.body = data.Body || data.body;
            this.url = data.ul || data.Url;
            this.languagePrefix = data.LanguagePrefix || data.languagePrefix;
        }
        else {
            this.title = '';
            this.body = '';
            this.languagePrefix = 'en';
        }
    }
}
