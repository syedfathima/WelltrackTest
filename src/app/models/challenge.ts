
import { UtilityService } from '../lib/utility.service';
import * as moment from 'moment'

export class Challenge {

	id: number;
	type: number = 1;
	challengeType: number = 1; //moodcheck default
	start: any;
	end: any;
	name: string = '';
	description: string = '';
	rewards: string = '';
	subdomain: string = '';
	code: string = '';
	displayActive: boolean = true;
	notifyUsers: boolean = true;
	notifyCounselors: boolean = true;
	upcomingEmailUser: string = '';
	startEmailUser: string = '';
	midEmailUser: string = '';
	endEmailUser: string = '';
	upcomingEmailCounselor: string = '';
	startEmailCounselor: string = '';
	midEmailCounselor: string = '';
	endEmailCounselor: string = '';
	randomlyAssigned: boolean;
	orgId: number;
	created: Date;
	teams: Team[];
	winningTeams: Team[];
	status: string;
	timezone: string = '';
	duration: string;
	totalMoodchecks:number;
	totalScore: number;
	showTeams: boolean;
	isPart: boolean;
	scores: Array<number>;
	checkIns: Array<number>;

	constructor(data?: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.type = data.ChallengeTypeID || data.type; //team type
			this.challengeType = data.ChallengeType;  // challenge type
			this.name = data.Name || data.name;
			this.description = data.Description || data.description;
			this.displayActive = data.displayActive;
			this.notifyUsers = data.notifyUsers;
			this.notifyCounselors = data.notifyCounselors;
			this.upcomingEmailUser = data.upcomingEmailUser;
			this.startEmailUser = data.startEmailUser;
			this.midEmailUser = data.midEmailUser;
			this.endEmailUser = data.endEmailUser;
			this.upcomingEmailCounselor = data.upcomingEmailCounselor;
			this.startEmailCounselor = data.startEmailCounselor;
			this.midEmailCounselor = data.midEmailCounselor;
			this.endEmailCounselor = data.endEmailCounselor;
			this.randomlyAssigned = data.randomlyAssigned;
			this.status = data.status;
			this.start = data.start.date? moment.parseZone(data.start.date).format('YYYY MM DD'): data.start;
			this.end = data.end.date? moment.parseZone(data.end.date).format('YYYY MM DD'): data.end;
			this.timezone = data.timezone;
			this.orgId = data.orgId;
			this.showTeams = data.showGraph;
			this.scores = data.scoresArr;
			this.checkIns = data.checkInsArr;

			this.duration = moment.parseZone(data.start.date).format('MMM Do, YYYY') + ' - ' + moment.parseZone(data.end.date).format('MMM Do, YYYY');

			let total = 0;
			for (let property in data.checkIns) {
				if (data.checkIns.hasOwnProperty(property)) {
					total += data.checkIns[property];
				}
			}
			this.totalMoodchecks = total;
			this.totalScore = data.totalScore;
			let flat = [];
			let max = 5;


			if (data.teams) {
				this.teams = Team.initializeArray(data.teams);
			}

			if (data.winningTeams) {
				this.winningTeams = Team.initializeArray(data.winningTeams);

			}

			this.isPart = data.isPart;
			//this.created = UtilityService.convertToDate(data.Created || data.created);
		}
	}

	public static initializeArray(objects: any): Challenge[] {

		let results: Challenge[] = [];

		for (let i = 0; i < objects.length; i++) {
		  let obj = new Challenge(objects[i]);
		  results.push(obj);
		}

		return results;
	  }

	public addTeam(team?: any) {
		let newTeam;
		if (team) {
			newTeam = new Team(team);
		}
		else {
			newTeam = new Team(null);
		}

		this.teams = this.teams || [];
		this.teams.push(newTeam);
	}

	public static forApi(challenge: Challenge) {
		return {
			ID: challenge.id,
			Type: challenge.type,
			Name: challenge.name,
			Description: challenge.description,
			Subdomain: challenge.subdomain,
			StartDateUtc: challenge.start,
			EndDateUtc: challenge.end,
			Timezone: challenge.timezone,
			displayActive: challenge.displayActive,
			NotifyUsers: challenge.notifyUsers,
			NotifyCounselors: challenge.notifyCounselors,
			UpcomingEmailUser: challenge.upcomingEmailUser,
			StartEmailUser: challenge.startEmailUser,
			MidEmailUser: challenge.midEmailUser,
			EndEmailUser: challenge.endEmailUser,
			UpcomingEmailCounselor: challenge.upcomingEmailCounselor,
			StartEmailCounselor: challenge.startEmailCounselor,
			MidEmailCounselor: challenge.midEmailCounselor,
			EndEmailCounselor: challenge.endEmailCounselor,
			randomlyAssigned: challenge.randomlyAssigned,
			OrgID: challenge.orgId,
			teams: JSON.stringify(challenge.teams)
		}
	}
}


export class Team {
	id: number;
	challengeId: number;
	orgId: number = null;
	name: string = '';
	description: string = '';
	avg: number = 0;
	participants: number = 0;
	score: number = 0;
	created: Date;
	updated: Date;

	constructor(data?: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.orgId = data.OrgID || data.orgId;
			this.name = data.Name || data.name;
			this.description = data.Description || data.description;
			this.avg =  data.avg;
			this.participants = data.participants;
			this.score = data.score;
		}
	}

	public static initializeArray(objects: any): Team[] {

		let results: Team[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new Team(objects[i]);
			results.push(obj);
		}

		return results;
	}



}
