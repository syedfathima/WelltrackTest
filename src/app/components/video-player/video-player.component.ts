import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { VideoService } from '../../lib/video.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'wt-video',
	templateUrl: './video-player.component.html',
	styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
	api: VgApiService;
	showControls = false;
	hasCompleted = false;
	lang: string = 'en';
	video: Object;
	videoId: number;

	@Input() mediaUrl: string;
	@Input() mediaType = 'video/mp4';
	@Input() thumbnailUrl: string;
	@Input() captionUrl: string;
	@Input() callbackUrl = '';
	@Input() callbackArgs: Object = {};

	@Output() onPlay = new EventEmitter<any>();
	@Output() onPause = new EventEmitter<any>();
	@Output() onCompleted = new EventEmitter<any>();
	@Output() onEnded = new EventEmitter<any>();

	constructor(
		private log: LogService,
		private apiservice: ApiService,
		private translate: TranslateService,
		private videoService: VideoService
	) {
		this.lang = this.translate.currentLang;
		this.videoService.setWatcher.subscribe(video => {
			if(video['id'] === this.videoId){
				this.play();
			}
		});

		this.video = {
			id: this.videoId,
			mediaUrl: this.mediaUrl,
			mediaType: this.mediaType,
			thumbnailUrl: this.thumbnailUrl,
			captionUrl: this.captionUrl,
		};

	}

	onPlayerReady(api: VgApiService) {
		this.api = api;

		this.api.getDefaultMedia().subscriptions.playing.subscribe(
			() => {
				this.log.debug('Playing started.');
				this.showControls = true;
				this.onPlay.emit();
			}
		);

		this.api.getDefaultMedia().subscriptions.pause.subscribe(
			() => {
				this.log.debug('Playing pause.');
				//this.showControls = false;
				this.onPause.emit();
			}
		);

		this.api.getDefaultMedia().subscriptions.ended.subscribe(
			() => {
				if(this.api.fsAPI.isFullscreen && this.api.fsAPI.isAvailable){
					this.api.fsAPI.toggleFullscreen();
				}
				this.log.debug('Playing end.');
				this.showControls = true;
				this.onEnded.emit(this.video);
			}
		);
		this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
			() => {
				this.log.debug('Progress called.');
				if (this.hasCompleted) {
					return;
				}

				let time = this.api.time;
				//Trigger completion if 10% is played
				if (time.current / time.total > 0.10) {
					if (this.callbackUrl !== '' && this.hasCompleted == false) {
						this.apiservice.post(this.callbackUrl, this.callbackArgs).subscribe(
							(result: any) => {
								this.log.debug('Course progress saved successfully.');
								//this.log.debug(this.diaries);
							},
							(error: any) => {
								this.log.error('Error issuing callback. ');
							}

						);
					}
					this.hasCompleted = true;
					this.onCompleted.emit(this.hasCompleted);
				}
			}
		)
	}

	play(){
		this.api.play();
	}

	ngOnInit() {

	}

}
