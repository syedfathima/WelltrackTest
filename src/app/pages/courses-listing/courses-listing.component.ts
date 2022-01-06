import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogService } from '../../lib/log.service';
import { ApiService } from '../../lib/api.service';
import { Course } from '../../models/course';
import { User } from '../../models/user';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { ModalService } from '../../lib/modal.service';
import { CourseCompleteFeedbackComponent } from '../../components/course-complete-feedback/course-complete-feedback.component';

@Component({
	selector: 'app-courses-listing',
	templateUrl: './courses-listing.component.html',
	styleUrls: ['./courses-listing.component.scss']
})
export class CoursesListingComponent implements OnInit, OnDestroy {
	path: string;
	private sub: Subscription;
	modules: string[];
	courses: any[];
	title: string;
	subtitle: string;
	cssModule: string;
	backLink: string;
	isLoaded: boolean;
	backText: string;
	translateTitles: string[];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private log: LogService,
		private api: ApiService,
		private modalService: ModalService,
		private translate: TranslateService
	) {
		this.backText = 'Back to List';
		this.courses = [];
		this.subtitle = '';
		this.backLink = '/app/theory/';
		this.modules = ['anxiety', 'depression', 'phobia', 'addiction', 'disaster', 'resilience', 'sleep', 'wellbeing', 'purpose', 'mindfulness', 'beyondnormal'];
		this.translateTitles = [];
	}

	ngOnInit() {

		this.translate.stream('courseListing').subscribe((res: any) => {
			this.backText = res.back;
			this.translateTitles = res.title;
			this.setTitle();
		});

		this.sub = this.activatedRoute.params.subscribe(params => {
			this.path = params['theory'];
			if (!this.modules.includes(this.path)) {
				this.router.navigateByUrl('/app/theory');
			} else {
				this.api.get('courses/' + this.path).subscribe(
					(result: any) => {
						this.courses = Course.initializeArray(result.data);
						this.checkForCurrent();
						this.setFocus();
					},
					(error: any) => {
						this.log.error('Error getting course data. ' + error.message);
					},
					() => {
						this.isLoaded = true;
					}
				);
				this.cssModule = this.path;
			}
			this.setTitle();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	setTitle() {
		if (this.path === 'anxiety') {
			this.title = this.translateTitles[0];
		}
		if (this.path === 'depression') {
			this.title = this.translateTitles[1];
		}
		if (this.path === 'phobia') {
			this.title = this.translateTitles[2];
		}
		if (this.path === 'disaster') {
			this.title = this.translateTitles[3];
		}
		if (this.path === 'resilience') {
			this.title = this.translateTitles[4];
		}
		if (this.path === 'sleep') {
			this.title = this.translateTitles[5];
		}
		if (this.path === 'wellbeing') {
			this.title = this.translateTitles[6];
		}
		if (this.path === 'purpose') {
			this.title = this.translateTitles[7];
		}
		if (this.path === 'mindfulness') {
			this.title = this.translateTitles[8];
		}
		if (this.path === 'beyondnormal') {
			this.title = this.translateTitles[9];
		}
	}

	checkForCurrent() {
		let first = true;
		for (let i = 0; i < this.courses.length; i++) {
			if (this.courses[i].isCompleted === false && first) {
				this.courses[i].isCurrent = true;
				first = false;
			} else {
				this.courses[i].isCurrent = false;
			}
		}
	}

	setFocus() {
		setTimeout(function () {
			jQuery('.course-name').eq(0).focus();
		}, 500);
	}

	onRate(course) {
		this.modalService.setCloseonClick(false);
		this.modalService.showComponent(CourseCompleteFeedbackComponent, course);
	}

}
