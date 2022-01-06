import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../../lib/log.service';
import { ApiService } from '../../lib/api.service';
import { UserService } from '../../../app/lib/user.service';
import { TranslateService } from '@ngx-translate/core';
import { CourseFeedbackComponent } from '../../components/course-feedback/course-feedback.component';
import { CourseCompleteFeedbackComponent } from '../../components/course-complete-feedback/course-complete-feedback.component';
import { ModalService } from '../../lib/modal.service';
import { VideoService } from '../../lib/video.service';
import { Course } from '../../../app/models/course';
import { User } from '../..//models/user';

import * as _ from 'lodash';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
	sub: any;
	backLink: string;
	isLoaded: boolean;

	courseId: number;
	course: Course;

	module: string;
	moduleTitle: string;
	modules: string[];
	cssModule: string;

	chapters: string[];
	chapterTitle: string;
	numOfChapters: number;

	chapterDesc: string;
	chapterDescriptions: string[];
	chapterContents: any[] = [];
	chapterContentsFlattened: any[] = [];

	backText: string;
	callbackUrl: string;

	//When all content is present, holds an array of chapterContents arrays
	moduleContents: any[];
	emailCopy: Array<string>;
	filter: any;
	user: User;
	favourite: boolean;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private log: LogService,
		private api: ApiService,
		private modalService: ModalService,
		private userService: UserService,
		private videoService: VideoService,
		private translate: TranslateService) {

		this.chapterDescriptions = [];
		this.backText = 'Back to List';
		this.backLink = '/app/courses-listing/'
		this.cssModule = 'anxiety';

		this.modules = ['anxiety', 'depression', 'phobia', 'disaster', 'resilience', 'sleep', 'wellbeing', 'mindfulness', 'purpose', 'work'];
		this.chapters = ['1. Introduction', '2. Relaxation', '3. Unhelpful Thinking', '4. Changing Thoughts', '5. Changing Behaviour'];
		this.numOfChapters = this.chapters.length;
		this.callbackUrl = 'course/complete';
		this.user = this.userService.getUser();

		
	}

	ngOnInit() {
		let lang = this.translate.currentLang;
		this.translate.stream('courseListing').subscribe((res: any) => {
			this.backText = res.back;
		});
		

		this.activatedRoute.queryParams.subscribe(params => {
			this.filter = params['type'] ? params['type'] : '';
			this.favourite = params['favourite'] ? params['favourite'] : '';
		});

		this.sub = this.activatedRoute.params.subscribe(params => {
			this.module = params['theory'];
			this.courseId = params['course'];
			if (!this.modules.includes(this.module)) {
				//this.router.navigateByUrl('/app/theory');
			} else {
				this.cssModule = this.module;
				this.setModuleTitle();
				this.backLink += this.module;
				if(this.favourite){
					this.backLink = '/app/favourites';	
				}else if (this.backLink === '/app/courses-listing/phobia') {
					this.backLink = '/app/theory';
				}
			}

			this.getCourse();

			this.api.get('coursesmenu2/' + this.courseId).subscribe(
				(result: any) => {
					let data = result.data;
					for (var key in data) {
						if (this.filter == 'relaxation') {
							if (key !== '3201') {
								this.chapterContents.push(data[key]);
							}
							if (key === '3203') {
								if (lang === 'fr') {
									data[key].step = 'Techniques de relaxation';
								} else {
									data[key].step = 'Relaxation Techniques';
								}
							}
						} else {
							this.chapterContents.push(data[key]);
						}

					}
					this.chapterContents.forEach(chapter => {
						if (chapter.videos) {
							chapter.videos.forEach(video => {
								this.chapterContentsFlattened.push(video);
							}
							);
						}
					});
	
					if (this.chapterContents.length < 1) {
						this.router.navigateByUrl('/app/courses-listing/' + this.module);
					}
				},
				(error: any) => {
					this.log.error('Error getting course data. ' + error.message);
				},
				() => {
					this.isLoaded = true;
				}
			);


		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}


	getCourse() {
		this.api.get('course/' + this.courseId).subscribe(
			(result: any) => {
				let data = result.data;
				this.course = new Course(result.data);
				this.module = data.Name;
				this.chapterTitle = data.Label;
				this.chapterDesc = data.Description;
				this.setBackLink(data.ChapterCount);
			},
			(error: any) => {
				this.log.error('Error getting course data. ' + error.message);
			}
		);
	}

	setBackLink(chapterCount: number){
		if(this.favourite){
			this.backLink = '/app/favourites';	
		}
		else if(chapterCount === 1){
			this.backLink = '/app/theory';
			this.chapterTitle = ''; 
		}
	}


	setModuleTitle() {
		this.translate.stream('courseListing').subscribe((res: any) => {
			const index = _.indexOf(this.modules, this.module);
			this.moduleTitle = res.title[index];
		});
	}

	showCourseFeedback(video) {
		if (this.user.primaryOrganization && this.user.primaryOrganization.settings['assessment'] === 'resilience') {
			let index = _.findIndex(this.chapterContentsFlattened, { id: video.id });
			let showNext = false;
			let last = false; 

			if (this.chapterContentsFlattened[index + 1] !== undefined) {
				showNext = true;
				last = false; 
			}
			else{
				last = true; 
			}

			this.getCourse();
			let showComplete = false; 
			if (this.course.isCompleted && last) {
				showComplete = true; 
			}

			this.modalService.showComponent(CourseFeedbackComponent, { video: video, showSuccess: !showComplete  /*, showNext: showNext */ })
			.afterClosed().subscribe(data => {

				if (data && data.action == 'playNext') {
					this.playNext(data.video);
				}
		
				if (showComplete) {
					this.modalService.showComponent(CourseCompleteFeedbackComponent,  this.course);
				}
			});

		}
	}

	onRate(video) {
		this.modalService.setCloseonClick(false);
		this.modalService.showComponent(CourseFeedbackComponent, { video: video});
	}

	playNext(video) {
		let index = _.findIndex(this.chapterContentsFlattened, { id: video.id });

		if (this.chapterContentsFlattened[index + 1] !== undefined) {
			let nextVideo = this.chapterContentsFlattened[index + 1];
			this.videoService.setVideo(nextVideo);
		}

	}

	onClick(attachment){
		
		if(attachment.FullFilePath){
			window.open(attachment.FullFilePath, "_blank");
			this.api.post('analytics/courseattachmentclick', {
				attachment: attachment
			}).subscribe(
				(result: any) => {
					//do nothing
				},
				(error: any) => {
					this.log.error('Error logging link click');
				}
			);
		}
		else{
			this.modalService.showAlert('Error', 'Could not load this link. Please contact info@welltrack.com');
		}
	
	
	}

}
