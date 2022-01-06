import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilityService } from './utility.service';
import 'rxjs/Rx';
import { Subject } from 'rxjs';
import { Moodcheck } from '../models/moodcheck';


import * as _ from 'lodash';

@Injectable()
export class MoodcheckService {

	updates = new Subject();
	refresh = new Subject();
	moodcheck: Moodcheck;

	constructor(private storage: StorageService, private utilService: UtilityService) {
		this.moodcheck = new Moodcheck();
	}

	triggerRefresh() {
		this.refresh.next();
	}

	setMoodValue(val) {
		console.log('Inside set mood value---',val)
		this.moodcheck.value = val;
		this.onUpdate();
	}

	addEmotion(val) {
		if (this.moodcheck.moods.indexOf(val) < 0) {
			this.moodcheck.moods.push(val);
		}
	}

	removeEmotion(val) {
		let index = this.moodcheck.moods.indexOf(val);

		if (index >= 0) {
			this.moodcheck.moods.splice(index, 1);
		}
	}

	setActivity(val) {
		this.moodcheck.activity = val;
		this.onUpdate();
	}

	setPeople(val) {
		this.moodcheck.people = val;
	}

	setPlace(val) {
		this.moodcheck.place = val;
	}

	setNote(val) {
		this.moodcheck.notes = val;
	}

	onUpdate() {
		let isValid = false;
		//check if moodcheck is valid and can be saved
		if (this.moodcheck.activity && this.moodcheck.value) {
			isValid = true;
		}

		this.updates.next(isValid);
	}

	getMoodcheck() {
		return this.moodcheck;
	}

	reset() {
		this.moodcheck = new Moodcheck();
	}

	lastDate(moodchecks: Moodcheck[]) {
		let lastMoodcheck = _.maxBy(moodchecks, function (o) { return o.created.getTime(); });
		let lastDate = new Date(lastMoodcheck.created);
		return lastDate;
	}

	private flattenData(moodchecks: Moodcheck[], to: Date) {
		let results = [];
		let lastDate = to;
		lastDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

		moodchecks.forEach(mc => {
			let mcDate = new Date(mc.created.getFullYear(), mc.created.getMonth(), mc.created.getDate());
			let daysFromLast = Math.ceil(Math.abs(lastDate.getTime() - mcDate.getTime()) / (1000 * 3600 * 24));
			if (daysFromLast === 0) {

			}

			results.push({
				value: (mc.value + 1),
				day: 30 - daysFromLast,
				time: mc.created.getHours(),
				id: mc.id
			});
		});

		return results;
	}

	getHeatmapData(moodchecks: Moodcheck[], mode = 'all', to: Date) {
		let data = {
			datasets: []
		};

		let moodValues = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; //Good to Bad
		let colors = ['#f9a287', '#f8c17b', '#f6db72', '#dbe982', '#b9eb9e', '#96e5bf', '#80c7dc', '#6dadf5', '#8f7cc2', '#ba4d82'];

		let flatData = this.flattenData(moodchecks, to);

		for (let i = 0; i < moodValues.length; i++) {
			let moodData = [];
			let moods = _.filter(flatData, { 'value': moodValues[i] });

			if (mode === 'good' && moodValues[i] < 6) {
				moods = [];
			} else if (mode === 'bad' && moodValues[i] > 4) {
				moods = [];
			}

			if (moods.length) {

				for (let j = 0; j < moods.length; j++) {
					moodData.push({
						x: moods[j].day,
						y: moods[j].time,
						r: 4,
						id: moods[j].id
					});
				}

				data.datasets.push({
					label: moodValues[i],
					data: moodData,
					backgroundColor: colors[i],
					hoverBackgroundColor: colors[i],
					borderColor: 'rgba(255,255,255,0)',
					borderWidth: 0
				});
			}
		}

		return data;
	}

	getMoodcheckCountData(moodchecks: Moodcheck[], mode = 'all', to: Date) {
		let data = [];
		let flatData = this.flattenData(moodchecks, to);
		let totalCount = 0;
		let totalDays = 0;

		for (let i = 1; i <= 30; i++) {
			let matches = _.filter(flatData, { 'day': i });

			totalCount += matches.length;
			totalDays += matches.length ? 1 : 0;

			data.push({
				day: i,
				count: matches.length
			});
		}

		if (!totalDays) {
			totalDays = 1;
		}

		return {
			data: data,
			total: totalCount,
			average: Math.round(totalCount / totalDays)
		};
	}

	getMoodcheckPercentageData(moodchecks: Moodcheck[], mode = 'good') {
		let totalCount = 0;
		let modeCount = 0;

		let categories = {
			activities: [],
			people: [],
			places: []
		}

		moodchecks.forEach(element => {
			let track = false;
			if (mode === 'good' && element.value > 5) {
				track = true;
			} else if (mode === 'bad' && element.value < 5) {
				track = true;
			}

			if (track) {
				modeCount++;

				if (element.activity) {
					let match = _.find(categories.activities, { 'name': element.activity });
					if (match) {
						match.count++;
					} else {
						categories.activities.push({
							name: this.utilService.capitalizeFirstLetter(element.activity),
							count: 1
						});
					}
				}

				if (element.people) {
					let match = _.find(categories.people, { 'name': element.people });
					if (match) {
						match.count++;
					} else {
						categories.people.push({
							name: this.utilService.capitalizeFirstLetter(element.people),
							count: 1
						});
					}
				}

				if (element.place) {
					let match = _.find(categories.places, { 'name': element.place });
					if (match) {
						match.count++;
					} else {
						categories.places.push({
							name: this.utilService.capitalizeFirstLetter(element.place),
							count: 1
						});
					}
				}
			}

			totalCount++;
		});

		categories.activities = _.sortBy(categories.activities, [function (o) { return o.count * -1; }, 'name']);
		categories.activities = categories.activities.slice(0, 3);

		categories.people = _.sortBy(categories.people, [function (o) { return o.count * -1; }, 'name']);
		categories.people = categories.people.slice(0, 3);

		categories.places = _.sortBy(categories.places, [function (o) { return o.count * -1; }, 'name']);
		categories.places = categories.places.slice(0, 3);

		let categoryStrings = {
			activities: _.map(categories.activities, 'name').join(', '),
			people: _.map(categories.people, 'name').join(', '),
			places: _.map(categories.places, 'name').join(', ')
		};

		if (!totalCount) {
			totalCount = 1;
		}

		return {
			percentage: Math.round(modeCount / totalCount * 100),
			categories: categoryStrings
		};
	}
}
