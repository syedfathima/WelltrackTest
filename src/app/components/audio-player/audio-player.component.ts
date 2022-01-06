import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';

@Component({
	selector: 'wt-audio',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
	api: VgApiService;
	showControls = false;
	hasCompleted = false;

	@Input() mediaType = 'video/mp4';
	@Input() mediaUrl: string;
	@Input() thumbnailUrl: string;
	@Input() callbackUrl: string = '';

	@Output() onPlay = new EventEmitter<any>();
	@Output() onPause = new EventEmitter<any>();
	@Output() onCompleted = new EventEmitter<any>();
	@Output() onEnded = new EventEmitter<any>();

	constructor() { }

	onPlayerReady(api: VgApiService) {
		this.api = api;

		this.api.getDefaultMedia().subscriptions.playing.subscribe(
			() => {

				this.showControls = true;
				this.onPlay.emit();
			}
		);

		this.api.getDefaultMedia().subscriptions.pause.subscribe(
			() => {

				this.showControls = false;
				this.onPause.emit();
			}
		);

		this.api.getDefaultMedia().subscriptions.ended.subscribe(
			() => {

				this.showControls = false;
				this.onEnded.emit();
			}
		);

		this.api.getDefaultMedia().subscriptions.progress.subscribe(
			() => {

				if (this.hasCompleted) {
					return;
				}

				let time = this.api.time;

				//Trigger completion if 10% is played
				if (time.current / time.total > 0.10) {


					this.onCompleted.emit();
				}
			}
		);
	}

	ngOnInit() {
	}

}
