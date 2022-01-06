

export class UserPermissions {

	dashboard: boolean;
	moodcheck: boolean;
	userDetails: boolean;
	userShare: boolean;
	theory: boolean;
	practice: boolean;
	assessment: boolean;
	challenges: boolean;
	orgDetails: boolean;
	userListing: boolean;
	inviteSubscribe: boolean;
	orgListing: boolean;
	scheduleUsers: boolean;
	aggregateView: boolean;
	activity: boolean;
	calendar:boolean;
	videohost: boolean;


	constructor(data?: any) {
		if (data) {
			this.dashboard = data.dashboard;
			this.moodcheck = data.moodcheck;
			this.userDetails = data.userDetails;
			this.userShare = data.userShare;
			this.theory = data.theory;
			this.practice = data.practice;
			this.assessment = data.assessment;
			this.challenges = data.challenges;
			this.orgDetails = data.orgDetails;
			this.userListing = data.userListing;
			this.inviteSubscribe = data.inviteSubscribe;
			this.orgListing = data.orgListing;
			this.scheduleUsers = data.scheduleUsers;
			this.aggregateView = data.aggregateView;
			this.activity = data.activity;
			this.calendar = data.calendar;
			this.videohost = data.videohost;
		}
	}
}
