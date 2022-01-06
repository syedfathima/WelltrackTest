import { Organization } from './organization';
import { UserPreferences } from './user-preferences';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UtilityService } from '../lib/utility.service';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

export class ThinkingStyle {
	value: string;
	text: string;
	info: string;
	isSelected: boolean;

	public static forApi(styles: ThinkingStyle[]): string {
		let selected: string[] = [];

		for (let i = 0; i < styles.length; i++) {
			if (styles[i].isSelected) {
				selected.push(styles[i].value);
			}
		}

		return selected.join(',');
	}

	public static selectFromString(styles: ThinkingStyle[], selectStr: string): ThinkingStyle[] {
		let selected: string[] = selectStr.split(',');

		for (let i = 0; i < styles.length; i++) {
			if (selected.indexOf(styles[i].value) >= 0) {
				styles[i].isSelected = true;
			}
		}

		return styles;
	}

	constructor(value: string, text: string, info: string) {
		this.value = value;
		this.text = text;
		this.info = info;
	}
}
// tslint:disable:max-line-length


export const DefaultThinkingStyles = [
	new ThinkingStyle('catastrophising', 'Catastrophising', 'Exaggerating a situation, or focusing on an unlikely worst-case scenario'),
	new ThinkingStyle('blackandwhite', 'Black and White Thinking', 'Thinking in terms of false dilemmas, assuming things can only be one of two ways, (e.g. perfect or failure) with no inbetween'),
	new ThinkingStyle('overgeneralization', 'Overgeneralization', 'Thinking that something is true based on how you are feeling. E.g, "I feel stupid, so I must be stupid."'),
	new ThinkingStyle('jumping', 'Jumping to Conclusions', 'Deciding an outcome with little or no evidence. Assuming you know what someone is thinking, or how a future event will play out.'),
	new ThinkingStyle('emotional', 'Emotional Reasoning', 'Making a broad conclusion based on scanty evidence, basing patterns on only one or two events.'),
	new ThinkingStyle('personalization', 'Personalization', 'Discounting positive events ("That doesn\'t count"), or filtering out many positive experiences while focusing on fewer negative ones'),
	new ThinkingStyle('ignoring', 'Ignoring Positives', 'Assuming that what others do or say is directly in reaction to you, even if there are better explanations for their actions.')
];


export class Thought {
	id: number;
	userActivityID: number;
	event: string;
	plan: string;

	constructor(data: any) {
		if (!data) {
			return;
		}

		this.id = data.ID || data.id;
		this.userActivityID = data.UserActivityID || data.userActivityID;
		this.event = data.Event || data.event;
		this.plan = data.Plan || data.plan;
	}
}

export class ThoughtDiaryEntry {
	id: number;
	userActivityThoughtID: number;
	feeling: string;
	intensity: number;
	thought: string;
	belief: number;
	thinkingStyles: ThinkingStyle[];
	challenge: string;

	public static forApi(entries: ThoughtDiaryEntry[]) {
		let results = [];

		for (let i = 0; i < entries.length; i++) {
			let entry = entries[i];

			results.push({
				Feeling: entry.feeling,
				Intensity: entry.intensity,
				Thought: entry.thought,
				Belief: entry.belief,
				ThinkingStyles: ThinkingStyle.forApi(entry.thinkingStyles),
				Challenge: entry.challenge
			});
		}

		return results;
	}

	constructor(data: any) {
		if (!data) {
			return;
		}

		this.id = data.ID || data.id;
		this.userActivityThoughtID = data.UserActivityThoughtID || data.userActivityThoughtID;
		this.feeling = data.Feeling || data.feeling;
		this.intensity = data.Intensity || data.intensity;
		this.thought = data.Thought || data.thought;
		this.belief = data.Belief || data.belief;
		this.challenge = data.Challenge || data.challenge;


		//Thinking styles...
		this.thinkingStyles = _.cloneDeep(DefaultThinkingStyles);

		if (data.ThinkingStyles) {
			this.thinkingStyles = ThinkingStyle.selectFromString(this.thinkingStyles, data.ThinkingStyles);
		} else if (data.thinkingStyles) {
			this.thinkingStyles = data.thinkingStyles;
		}
	}

	hasThinkingStyle(): boolean {
		for (let i = 0; i < this.thinkingStyles.length; i++) {
			let style = this.thinkingStyles[i];

			if (style.isSelected) {
				return true;
			}
		}

		return false;
	}

}

export class ThoughtDiary {

	id: number;
	status: string;
	thought: Thought;
	entries: ThoughtDiaryEntry[];
	createdOn: Date;
	updatedOn: Date;
	userId: number; 

	public static initializeArray(objects: any): ThoughtDiary[] {
		let results: ThoughtDiary[] = [];

		for (let i = 0; i < objects.length; i++) {
			let td = new ThoughtDiary(objects[i]);
			results.push(td);
		}

		return results;
	}

	constructor(data: any) {

		if (!data) {
			this.thought = new Thought(null);
			this.entries = [];
			return;
		}

		this.id = data.ID || data.id;
		this.status = data.Status || data.status;
		this.createdOn = UtilityService.convertToDate(data.Created || data.createdOn);
		this.updatedOn = UtilityService.convertToDate(data.Updated || data.updatedOn);
		this.userId = data.UserID || data.userID;

		this.thought = new Thought(data.Thought || data.thought);

		//entries
		this.setEntries(data.Entries || data.entries);
	}

	public setEntries(entries: any) {
		//reset
		this.entries = [];

		if (entries) {
			for (let i = 0; i < entries.length; i++) {
				this.entries.push(new ThoughtDiaryEntry(entries[i]));
			}
		}
	}

	public addFeeling() {
		let entry = new ThoughtDiaryEntry(null);
		entry.thinkingStyles = _.cloneDeep(DefaultThinkingStyles);

		this.entries.push(entry);
	}

	public forApi() {
		return {
			Event: this.thought.event,
			Plan: this.thought.plan || '',
			Status: this.status,
			Data: JSON.stringify(ThoughtDiaryEntry.forApi(this.entries)),
			UserActivityID: this.thought.userActivityID
		}
	}
}
