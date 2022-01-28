import { Challenge } from './challenge';
import { Organization } from './organization';
import { UserPreferences } from './user-preferences';
import { UserPermissions } from './user-permissions';

export class User {

	id: number = null;
	firstName: string = '';
	lastName: string = '';
	fullName: string = '';
	email: string = '';
	userType: string = '';
	roleId: number = null;
	roleName: string = '';
	status: string = 'approved';
	avatarUrl: string = '';
	createdOn: string = '';
	updatedOn: string = '';
	loginOn: string = '';
	alerts: number = null;
	alertsCount: number = null;
	assessmentCount: number = null;
	resilienceCount:number = null; 
	forceAssessment: boolean = false;
	showDemographic: boolean = false;
	demographicCount: number = 0;
	demographic: Object = null; 
	appointmentCount: number = null;
	eventCount: number = null;
	avgMoodcheck: number = null;
	organizations: Organization[];
	primaryOrganization: Organization;
	organizationStr: string;
	preferences: UserPreferences;
	permissions: UserPermissions;
	subscriptionExists: boolean = false;
	webSubscriptionExists: boolean = false;
	iosSubscriptionExists: boolean = false;
	androidSubscriptionExists: boolean = false;
	paidUntil: number;
	lockedRole: boolean;
	isFullAccess: boolean = false;
	noticeOn: boolean = false;
	trial: boolean = false;
	trialDays: number = 0;
	activeChallengesCount: number = null;
	totalChallengesCount: number = 0;
	activeChallenges: Challenge[];
	selected: boolean = false;
	zoomPersonalMeetingUrl: string;
	hasContent: boolean = false;
	isFirstTimeLogin:any;
	isWebSubscriptionEnabled:any;

	//subscriptionExists: User has a paid subscription
	//isFullAccess: User is associated or has a paid subscription or is in trial
	//isTrial: User is in the trial period

	constructor(data?: any, includeOrg: boolean = false) {
		if (data) {
			this.id = data.ID || data.id;
			this.firstName = data.FirstName || data.firstName;
			this.lastName = data.LastName || data.lastName;
			this.fullName = data.Name || data.fullName;
			this.email = data.Email || data.email;
			this.userType = data.UserType || data.userType;
			this.roleId = data.roleId || data.RoleID;
			this.roleName = data.roleName || data.RoleName;
			this.status = data.Status || data.status;
			this.avatarUrl = data.Avatar || data.avatarUrl;
			this.alerts = data.Alerts || data.alerts;
			this.alertsCount = data.alertsCount || 0;
			this.assessmentCount = data.assessmentCount || 0;
			this.resilienceCount = data.resilienceCount || 0;
			this.forceAssessment = data.forceAssessment || false;
			this.showDemographic = data.showDemographic || false;
			this.demographic = data.demographic; 
			this.demographicCount = data.demographicCount || 0;
			this.activeChallengesCount = data.activeChallengesCount || 0;
			this.totalChallengesCount = data.totalChallengesCount || 0;
			this.appointmentCount = data.appointmentCount || 0;
			this.eventCount = data.appointmentCount || 0;
			this.avgMoodcheck = data.avgMoodcheck;
			this.loginOn = data.LoginOnUtc || data.loginOnUtc;
			this.paidUntil = data.paidUntil || data.PaidUntil;
			this.zoomPersonalMeetingUrl = data.zoomPersonalMeetingUrl;
			this.createdOn = data.CreatedOnUtc || data.createdOnUtc;
			this.updatedOn = data.UpdatedOnUtc || data.updatedOnUtc;

			this.webSubscriptionExists = data.webSubscriptionExists || false;
			this.iosSubscriptionExists = data.iosSubscriptionExists || false;
			this.androidSubscriptionExists = data.androidSubscriptionExists || false;
			this.subscriptionExists = (this.webSubscriptionExists || this.iosSubscriptionExists || this.androidSubscriptionExists);
			this.hasContent = data.HasContent || data.hasContent;
            this.isFirstTimeLogin = data.firsttimelogin || 0;
			this.isWebSubscriptionEnabled = data.webnotificationSubscribed || 0;
			if (this.fullName && !this.firstName) {
				//parse first and last names
				this.parseFullName();
			}

			//organizations
			this.organizations = [];
			if (data.organizations) {
				this.setOrganizations(data.organizations, includeOrg);
			} else {
				this.primaryOrganization = null;
			}

			this.preferences = new UserPreferences(data.preferences);
			this.permissions = new UserPermissions(data.permissions);
			this.lockedRole = data.lockedRole;

			//challenges
			this.activeChallenges = [];
			/*
				if (data.activeChallenges) {
					for (let i = 0; i < data.activeChallenges.length; i++) {
						this.activeChallenges.push(new Challenge(data.activeChallenges[i]));
					}
				} else {
					this.activeChallenges = null;
				}
			*/

			if ((this.primaryOrganization && this.primaryOrganization.active) || this.subscriptionExists) {
				this.isFullAccess = true;
			} else {
				this.trial = data.trial;
				if (this.trial) {
					this.isFullAccess = true;
					this.noticeOn = true;
				} else {
					this.noticeOn = false;
				}
				this.trialDays = data.trialDays;
			}
		} else {
			this.preferences = new UserPreferences();
			this.permissions = new UserPermissions();
		}

	}

	public static initializeArray(objects: any): User[] {


		let results: User[] = [];
		/*
		* When initializing a user array, always include org even when not active
		*/
		for (let i = 0; i < objects.length; i++) {
			let obj = new User(objects[i], true);
			results.push(obj);
		}

		return results;
	}

	public static forApi(user: User) {
		return {
			fullName: user.fullName,
			Email: user.email
		}
	}

	public parseFullName() {
		let name = this.fullName.split(/\s+/);
		this.firstName = name.slice(0, -1).join(' ');
		this.lastName = name.pop();
		return;
	}

	public setOrganizations(organizations: any, includeOrg: boolean = false) {
		//reset
		this.primaryOrganization = null;
		this.organizations = [];

		if (organizations) {
			let names = [];
			for (let i = 0; i < organizations.length; i++) {
				this.organizations.push(new Organization(organizations[i]));
				names.push(this.organizations[i].name);
			}
			this.organizationStr = names.join(',');
		}

		//primary organization
		if (this.organizations && this.organizations.length > 0) {
			this.primaryOrganization = new Organization(this.organizations[0]);
		}

	}

	public removeOrganizations() {
		this.setOrganizations([]);
	}

	getAvatarUrl(width: number = 164, height?: number) {
		height = height || width;
		return `${this.avatarUrl}?width=${width}&height=${height}`
	}

}
