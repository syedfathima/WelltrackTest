import { Component, OnInit } from "@angular/core";
import { Course } from "../../models/course";
import { ApiService } from "../../lib/api.service";
import { ModalService } from "../../lib/modal.service";
import { LogService } from "../../lib/log.service";
import { CourseAdminEditComponent } from "../../components/admin/course-admin-edit/course-admin-edit.component";

@Component({
	selector: "admin-course-listing",
	templateUrl: "admin-course-listing.component.html",
	styleUrls: ["./admin-course-listing.component.scss"],
})
export class AdminCourseListingPage implements OnInit {
	isLoaded: boolean = false;
	courses: Course[] = [];

	public constructor(
		private api: ApiService,
		private modalService: ModalService,
		private logService: LogService
	) {}

	ngOnInit() {
		this.api.get("course/courselisting").subscribe(
			(result: any) => {
				if (result.data) {
					const resCourses = result.data;
					for (var key in resCourses) {
						this.courses.push(
							new Course({
								id: resCourses[key].ID,
								label: resCourses[key].Label,
								key:  resCourses[key].Key,
							})
							// new Course(resCourses[key])
						);
					}
				}
				this.isLoaded = true;
			},
			(error: any) => {
				this.logService.debug(
					"Error getting courses. " + error.message
				);
				this.isLoaded = true;
			}
		);
	}

	doCreate() {
		this.modalService.setCloseOnClickAway(false);
		this.modalService.showComponent(CourseAdminEditComponent, null);
	}

	onEdit(id) {
		this.modalService.setCloseOnClickAway(false);
		const modal = this.modalService.showComponent(CourseAdminEditComponent, id);
		modal.beforeClosed().subscribe((data:any) => {
			if(data){
				const index = this.courses.findIndex((course: Course) => course.id === id);
				if(index !== -1) {
					this.courses[index] = {...this.courses[index], ...data};
				}
			}
		});
	}
}
