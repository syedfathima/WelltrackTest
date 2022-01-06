import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../../lib/log.service';
import { ApiService } from '../../lib/api.service';
import { UserService } from '../../lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { CourseFeedbackComponent } from '../../components/course-feedback/course-feedback.component';
import { CourseCompleteFeedbackComponent } from '../../components/course-complete-feedback/course-complete-feedback.component';
import { ModalService } from '../../lib/modal.service';
import { VideoService } from '../../lib/video.service';
import { Course } from '../../models/course';
import { User } from '../../models/user';

import * as _ from 'lodash';

@Component({
	selector: 'app-podcasts',
	templateUrl: './podcasts.html',
	styleUrls: ['./podcasts.scss']
})
export class PodcastsPage implements OnInit {

	isLoaded: boolean;
	chapterContents: any[] = [];
	module: string;
	chapterTitle: string;
	chapterDesc: string;
	course: Course;
	cssModule: string;
	backText: string;

	currentTrack: HTMLAudioElement;
	currentVideoId: number;

	mute: boolean = false;
	language: string;
	playText: string;
	pauseText: string;

	playing = false;
	duration: number; //play time in seconds
	playTime: string; //user facing time format of the duration
	timer: any;

	//When all content is present, holds an array of chapterContents arrays
	moduleContents: any[];
	isCompleted: boolean = false;
	filter: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private log: LogService,
		private api: ApiService,
		private modalService: ModalService,
		private userService: UserService,
		private videoService: VideoService,
		private translate: TranslateService) {
		this.isLoaded = false;
		this.chapterContents = [];
		this.cssModule = 'podcasts';
		this.backText = 'Back';
	}

	ngOnInit() {

		this.api.get('podcasts').subscribe(
			(result: any) => {
				let data = result.data;
				for (var key in data) {
					this.chapterContents.push(data[key]);
				}
				// console.log('chapter contents');
				// console.log(this.chapterContents);
				this.isLoaded = true;
			},
			(error: any) => {
				this.log.error('Error getting course data. ' + error.message);
			},
			() => {
				this.isLoaded = true;
			}
		);
			this.getCourse();
	}

	getCourse() {
		this.api.get('course/' + 123).subscribe(
			(result: any) => {
				let data = result.data;
				this.course = new Course(result.data);
				this.module = data.Name;
				this.chapterTitle = data.Label;
				this.chapterDesc = data.Description;
			},
			(error: any) => {
				this.log.error('Error getting course data. ' + error.message);
			}
		);
	}

	onRate(video) {
		this.modalService.setCloseonClick(false);
		this.modalService.showComponent(CourseFeedbackComponent, { video: video });
	}

	ngOnDestroy() {
		this.stop();
		if (this.currentTrack) {
			this.currentTrack.remove();
			this.currentTrack = null;
		}
	}

	onTimeUpdate(e: Event) {
		if (this.playing && this.currentTrack.currentTime > 0) {
			let completed = this.currentTrack.duration > 0 ? Math.trunc(this.currentTrack.currentTime / this.currentTrack.duration * 100) / 100 : 0;
			this.log.debug(completed);
			if (completed >= 0.2 && !this.isCompleted) {
				this.api.post('course/complete', { id: this.currentVideoId }).subscribe(
					(result: any) => {
						this.log.debug('Course progress saved successfully.');
						this.isCompleted = true;
					},
					(error: any) => {
						this.log.error('Error issuing callback. ');
					}

				);
			}
		}
	}

	play() {
		this.timer = setInterval(() => { this.tick() }, 1000);
		if (this.currentTrack) {
			this.currentTrack.play();
		}
	}

	pause() {
		clearInterval(this.timer);

		if (this.currentTrack) {
			this.currentTrack.pause();
		}
	}

	stop() {
		this.pause();
		this.duration = 0;
		this.setPlayTime();

		if (this.currentTrack) {
			this.currentTrack.currentTime = 0;
		}

	}

	onToggle() {
		if (this.mute) {
			this.mute = false;
			this.currentTrack.muted = false;
		}
		else {
			this.mute = true;
			this.currentTrack.muted = true;
		}
	}

	tick() {
		this.duration++;
		this.setPlayTime();
	}

	setPlayTime() {
		let date = new Date(null);
		date.setSeconds(this.duration);
		this.playTime = date.toISOString().substr(11, 8);
	}

	onPlay() {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}

		this.playing = !this.playing;
	}

	onStop() {
		this.playing = false;
		this.stop();
	}

	toggleVideo(video: any, play: boolean) {
		if (!this.currentTrack) {
			this.currentTrack = new Audio();
			this.currentTrack.addEventListener("timeupdate", (e) => { this.onTimeUpdate(e); }, false);
		}
		if (video.videoFile === this.currentTrack.src) {
			this.onPlay();
		} else {

			//this.stop();
			this.currentTrack.src = video.videoFile;
			this.currentTrack.loop = false;
			this.currentTrack.volume = 1;
			this.currentTrack.load();
			this.currentVideoId = video.id;
			this.isCompleted = false;
			this.duration = 0;
			this.setPlayTime();
			if (play) {
				this.onPlay();
			}
		}
	}

}
