import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../../app/lib/api.service';
import { LogService } from '../../../../app/lib/log.service';

@Component({
	selector: 'app-zen-room',
	templateUrl: './zen-room.component.html',
	styleUrls: ['./zen-room.component.scss']
})
export class ZenRoomPage implements OnInit, OnDestroy {

	playing = false;
	backgroundVolume = 50;
	voiceVolume = 50;
	backgroundVolumeRounded = 5;
	voiceVolumeRounded = 5;
	backgroundTrack: HTMLAudioElement;
	voiceTrack: HTMLAudioElement;
	ambianceType: string;
	voiceType: string;
	mute: boolean = false;
	duration: number; //play time in seconds
	playTime: string; //user facing time format of the duration
	timer: any;
	backLink: string;
	title: string;
	midTitle: string;
	back: string;
	playText: string;
	pauseText: string;
	language: string;
	waves_track: string;
	organic_track: string;
	splash_track: string;
	breathing_track: string;
	color_track: string;
	getting_started_track: string;
	forest_track: string;
	awareness_track: string;
	beach_track: string;
	relaxing_phrases_track: string;
	sort_boxes_track: string;
	thoughts_cloud_track: string;
	thoughts_leaves_track: string;
	CourseIds: any = {
		'waves': { 'id': 203, 'completed': false },
		'splash': { 'id': 204, 'completed': false },
		'organic': { 'id': 205, 'completed': false },
		'traditional': { 'id': 208, 'completed': false },
		'alternative': { 'id': 209, 'completed': false },
		'forest': { 'id': 10014, 'completed': false },
		'awareness': { 'id': 10015, 'completed': false },
		'beach': { 'id': 10018, 'completed': false },
		'relaxing_phrases': { 'id': 10019, 'completed': false },
		'sort_boxes': { 'id': 10020, 'completed': false },
		'thoughts_clouds': { 'id': 10021, 'completed': false },
		'thoughts_leaves': { 'id': 10022, 'completed': false },
		'getting_started': { 'id': 10023, 'completed': false }
	};

	infoText: string = 'This is opened.';
	helpOpen: boolean = false;

	constructor(
		private translate: TranslateService,
		private api: ApiService,
		private log: LogService
	) {
		this.backLink = '/app/practice';
	}

	ngOnInit() {

		this.language = this.translate.currentLang;
		this.getting_started_track = '/assets/audio/zen-room/getting_started.mp3';
		this.waves_track = '/assets/audio/zen-room/bg_waves.m4a';
		this.organic_track = '/assets/audio/zen-room/bg_organic.m4a';
		this.splash_track = '/assets/audio/zen-room/bg_splash.m4a';
		this.breathing_track = '/assets/audio/zen-room/voice_breathing_' + this.language + '.mp3';
		this.color_track = '/assets/audio/zen-room/voice_color_' + this.language + '.mp3';
		this.breathing_track = '/assets/audio/zen-room/voice_breathing_' + this.language + '.mp3';
		this.forest_track = '/assets/audio/zen-room/forest.mp3';
		this.awareness_track = '/assets/audio/zen-room/awareness.mp3';
		this.beach_track = '/assets/audio/zen-room/beach.mp3';
		this.relaxing_phrases_track = '/assets/audio/zen-room/relaxing_phrases.mp3';
		this.sort_boxes_track = '/assets/audio/zen-room/sort_boxes.mp3';
		this.thoughts_cloud_track = '/assets/audio/zen-room/thoughts_clouds.mp3';
		this.thoughts_leaves_track = '/assets/audio/zen-room/thoughts_leaves.mp3';

		this.api.get('course/zenroom').subscribe(
			(result: any) => {
				let audioEndpoints = result;

				this.waves_track = audioEndpoints.background.wave;
				this.organic_track = audioEndpoints.background.organic;
				this.splash_track = audioEndpoints.background.splash;

				this.getting_started_track = audioEndpoints.voice.getting_started;
				this.breathing_track = audioEndpoints.voice.breathing;
				this.color_track = audioEndpoints.voice.color;
				this.forest_track = audioEndpoints.voice.forest;
				this.awareness_track = audioEndpoints.voice.awareness;
				this.beach_track = audioEndpoints.voice.beach;
				this.relaxing_phrases_track = audioEndpoints.voice.relaxing_phrases;
				this.sort_boxes_track = audioEndpoints.voice.sort_boxes;
				this.thoughts_cloud_track = audioEndpoints.voice.thoughts_clouds;
				this.thoughts_leaves_track = audioEndpoints.voice.thoughts_leaves;

				this.onChooseBackgroundTrack(this.waves_track, 'waves');
				if (this.language === 'en') {
					this.onChooseVoiceTrack(this.getting_started_track, 'getting_started');
				} else {
					this.onChooseVoiceTrack(this.breathing_track, 'traditional');
				}

				this.duration = 0;
			},
			(error: any) => {
				this.log.error('Error getting Audio Tracks. ' + error.message);
			},
			() => {

			}
		);

		this.duration = 0;
		this.translate.stream('zenRoom').subscribe((res: any) => {
			this.title = res.title;
			this.midTitle = res.subtitle;
			this.back = res.back;
			this.playText = res.play;
			this.pauseText = res.pause;
		});
	}

	ngOnDestroy() {
		this.stop();

		if (this.backgroundTrack) {
			this.backgroundTrack.remove();
			this.backgroundTrack = null;
		}

		if (this.voiceTrack) {
			this.voiceTrack.remove();
			this.voiceTrack = null;
		}
	}

	onChangeBackgroundVolume(value: number) {
		this.backgroundVolume = value;
		this.backgroundVolumeRounded = Math.floor(this.backgroundVolume / 10);

		if (this.backgroundTrack) {
			this.backgroundTrack.volume = value / 100;
		}
	}



	onChooseBackgroundTrack(track, type = null) {
		this.ambianceType = type;
		if (!track) {
			if (this.backgroundTrack) {
				this.backgroundTrack.pause();
				this.backgroundTrack = null;
			}
			return;
		}

		if (!this.backgroundTrack) {
			this.backgroundTrack = new Audio();
		}

		//this.stop();
		this.backgroundTrack.src = track;
		this.backgroundTrack.loop = true;
		this.backgroundTrack.volume = this.backgroundVolume / 100;
		this.backgroundTrack.load();

		if (this.playing) {
			this.backgroundTrack.play();
			this.track();
		}

	}

	onChangeVoiceVolume(value: number) {
		this.voiceVolume = value;
		this.voiceVolumeRounded = Math.floor(this.voiceVolume / 10);

		if (this.voiceTrack) {
			this.voiceTrack.volume = value / 100;
		}
	}

	onChooseVoiceTrack(track, type) {
		this.voiceType = type;
		if (!track) {
			if (this.voiceTrack) {
				this.voiceTrack.pause();
				this.voiceTrack = null;
			}

			return;
		}

		if (!this.voiceTrack) {
			this.voiceTrack = new Audio();
		}

		//this.stop();
		this.voiceTrack.src = track;
		this.voiceTrack.volume = this.voiceVolume / 100;
		this.voiceTrack.load();

		if (this.playing) {
			this.voiceTrack.play();
			this.track();
		}

	}

	onValueChangeBackground(value) {


		value = parseInt(value);
		if (value) {
			if (value > 10) {
				value = 10;
			}
			if (value < 0) {
				value = 0;
			}
			this.backgroundVolume = value * 10;
			this.backgroundVolumeRounded = value;
		}


	}

	onValueChangeVoice(value) {
		value = parseInt(value);
		if (value) {
			if (value > 10) {
				value = 10;
			}
			if (value < 0) {
				value = 0;
			}
			this.voiceVolume = value * 10;
			this.voiceVolumeRounded = value;
		}
	}

	play() {
		this.timer = setInterval(() => { this.tick() }, 1000);

		if (this.backgroundTrack) {
			this.backgroundTrack.play();
		}

		if (this.voiceTrack) {
			this.voiceTrack.play();
		}
	}

	pause() {
		clearInterval(this.timer);

		if (this.backgroundTrack) {
			this.backgroundTrack.pause();
		}

		if (this.voiceTrack) {
			this.voiceTrack.pause();
		}
	}

	stop() {
		this.pause();
		this.duration = 0;
		this.setPlayTime();

		if (this.backgroundTrack) {
			this.backgroundTrack.currentTime = 0;
		}

		if (this.voiceTrack) {
			this.voiceTrack.currentTime = 0;
		}
	}

	onToggle() {
		if (this.mute) {
			this.mute = false;
			this.voiceTrack.muted = false;
			this.backgroundTrack.muted = false;
		}
		else {
			this.mute = true;
			this.voiceTrack.muted = true;
			this.backgroundTrack.muted = true;
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

	track() {
		this.onTimeUpdate(this.ambianceType);
		this.onTimeUpdate(this.voiceType);
	}

	onTimeUpdate(track) {
		if (!this.CourseIds[track].completed) {
			this.api.post('course/complete', { id: this.CourseIds[track].id }).subscribe(
				(result: any) => {

					this.CourseIds[track].completed = true
				},
				(error: any) => {

				}

			);
		}
	}

	onToggleText() {
		this.helpOpen = !this.helpOpen;
	}


}
