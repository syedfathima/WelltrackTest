import { Organization } from './organization';
import { UserPreferences } from './user-preferences';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UtilityService } from '../lib/utility.service';


import * as _ from 'lodash';

export class Achievement {
	id: number;
	userActivityID: number;
	date: Date;
	happinessBefore: number;
	happinessAfter: number;
	funBefore: number;
	funAfter: number;
	achievementBefore: number;
	achievementAfter: number;
	activity: string;
	observation: string;
	userId: number; 
	

	public static forApi(acheivements: Achievement[]) {
		let results = [];

		for (let i = 0; i < acheivements.length; i++) {
			let acheivement = acheivements[i];

			results.push({
				Activity: acheivement.activity,
				Date: acheivement.date,
				HappinessBefore: acheivement.happinessBefore,
				HappinessAfter: acheivement.happinessAfter,
				FunBefore: acheivement.funBefore,
				FunAfter: acheivement.funAfter,
				AchievementBefore: acheivement.achievementBefore,
				AchievementAfter: acheivement.achievementAfter, 
				Observation: acheivement.observation
			});
		}

		return results;
	}

	constructor(data: any) {
		if (!data) {
			return;
		}

		this.id = data.ID || data.id;
		this.userId = data.UserID || data.userID;
		this.userActivityID = data.UserActivityID || data.userActivityID;
		this.activity = data.Activity || data.activity;
		this.observation = data.Observation || data.observation;
		this.happinessBefore = data.HappinessBefore || data.happinessBefore || 0;
		this.happinessAfter = data.HappinessAfter || data.happinessAfter || 0;
		this.funBefore = data.FunBefore || data.funBefore || 0;
		this.funAfter = data.FunAfter || data.funAfter || 0;
		this.achievementBefore = data.AchievementBefore || data.achievementBefore || 0;
		this.achievementAfter = data.AchievementAfter || data.achievementAfter || 0;
	}	
}

export class FunAchievement {

	id: number;
	status: string;
	achievements: Achievement[];
	primaryAchievement: Achievement;
	createdOn: Date;
	updatedOn: Date;
	date: Date; 
	userId: number; 

	public static initializeArray(objects: any): FunAchievement[] {
		let results: FunAchievement[] = [];

		for (let i = 0; i < objects.length; i++) {
			let ac = new FunAchievement(objects[i]);
			results.push(ac);
		}

		return results;
	}

	constructor(data: any) {

		if (!data) {
			this.achievements = [];
			this.primaryAchievement = new Achievement(null);
			this.achievements.push(this.primaryAchievement);
			return;
		}

		this.id = data.ID || data.id;
		this.status = data.Status || data.status;
		this.createdOn = UtilityService.convertToDate(data.Created || data.createdOn);
		this.updatedOn = UtilityService.convertToDate(data.Updated || data.updatedOn);
		this.date = UtilityService.convertToDate(data.Date || data.date);
		this.userId = data.UserID || data.userID; 

		//this.achievement = new Achievement(data.Achievement || data.achievement);
		this.primaryAchievement = new Achievement(null);

		//entries
		this.setAchievements(data.Achievements || data.achievements);
	}

	public setAchievements(achievements: any) {
		//reset
		this.achievements = [];

		if (achievements) {
			for (let i = 0; i < achievements.length; i++) {
				this.achievements.push(new Achievement(achievements[i]));
			}

			this.primaryAchievement = this.achievements[0];
		}
	}

	public addAchievement() {
		let achievement = new Achievement(null);
		this.achievements.push(achievement);
	}

	public happinessDiff() {
		return this.primaryAchievement.happinessAfter - this.primaryAchievement.happinessBefore;
	}
	
	public funDiff() {
		return this.primaryAchievement.funAfter - this.primaryAchievement.funBefore;
	}
	
	public achievementDiff() {
		return this.primaryAchievement.achievementAfter - this.primaryAchievement.achievementBefore;
	}

	public forApi() {
		return {
			Status: this.status,
			Data: JSON.stringify(Achievement.forApi(this.achievements)),
			UserActivityID: this.primaryAchievement.userActivityID
		}
	}
}
