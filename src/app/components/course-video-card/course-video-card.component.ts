import {
	Component,
	OnInit,
	Inject,
	Input,
	Output,
	EventEmitter,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "app/lib/api.service";
import { LogService } from "app/lib/log.service";
import { ModalService } from "app/lib/modal.service";
import { Video } from "../../models/course";
@Component({
	selector: "course-video-card",
	templateUrl: "course-video-card.component.html",
	styleUrls: ["./course-video-card.component.scss"],
})
export class CourseVideoCardComponent implements OnInit {
	@Input() video: any;
	@Input() callbackUrl: string;

	@Output() onVideoCompleted = new EventEmitter();
	@Output() onVideoEnded = new EventEmitter();
	@Output() onRate = new EventEmitter();
	@Output() onClickAttachment = new EventEmitter<any>();
	favouriteText:any;
	constructor(private api: ApiService,
		private log: LogService,
		private modalService: ModalService,
		private translate: TranslateService,) {
			this.translate.stream('favourite').subscribe((res: any) => {
				this.favouriteText = res;
			});
		}

	ngOnInit() {
		
	}

	videoCompleted(){
		this.onVideoCompleted.emit();
	}

	videoEnded(){
		this.onVideoEnded.emit();
	}

	onRateItem(){
		this.onRate.emit();
	}

	attachmentClicked(attachment: any){
		this.onClickAttachment.emit(attachment);
	}

	/**
	 * Set Favourite
	 */
	 setFavourite(videoDetails){
		this.api.post('favorite/' + videoDetails.id,{type: 'course',status : videoDetails.isFavorite ? 0 : 1}).subscribe(
			(result: any) => {
				this.video.isFavorite = !videoDetails.isFavorite;
				this.modalService.showAlert(this.favouriteText.success, result.message);
			},
			(error: any) => {
				this.modalService.showAlert(this.favouriteText.error, error.message);
			}
		);
	 }
}
