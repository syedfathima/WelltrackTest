import { Component, OnInit } from '@angular/core';
import { UserService } from '../../lib/user.service';
import { OrganizationService } from '../../lib/organization.service';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';
import { User } from '../../models/user';
import { Organization, OrganizationCourse } from '../../models/organization';


@Component({
  selector: 'app-theory',
  templateUrl: './theory.component.html',
  styleUrls: ['./theory.component.scss']
})
export class TheoryComponent implements OnInit {

  user: User;
  organization: any;
  access: any;
  loaded: boolean;
  enabledCourses: OrganizationCourse[];
  defaultCourses: OrganizationCourse[];

  constructor(
    private userService: UserService,
    private api: ApiService,
    private logService: LogService,
    private organizationService: OrganizationService
  ) {
    this.loaded = false;
    this.access = {
      'anxiety': true,
      'depression': true,
      'publicspeaking': true,
      'disaster': true,
      'purpose': true,
      'mindfulness': true,
      'sleep': false,
      'work': false,
      'additionalInformation': false
    };
  }

  ngOnInit() {
    this.defaultCourses = [];
    this.user = this.userService.getUser();
    this.api.get('course/courselisting/defaults').subscribe(
      (result: any) => {
        if (result.data) {
          const resCourses = result.data;
          result.data.forEach(course => {
            this.defaultCourses.push(new OrganizationCourse({
              id: course.ID,
              courseId: course.ID,
              name: course.Name,
              enabled: course.DefaultCourse,
            })
            );
          }
          );

        }
      },
      (error: any) => {
        this.logService.error('Error getting courses. ' + error.message);
      });

    if (this.user.primaryOrganization && this.user.primaryOrganization.id) {
      this.api.get('organizations/' + this.user.primaryOrganization.id).subscribe(
        (result: any) => {
          this.logService.debug('organization detected');
          this.organization = new Organization(result.data, 'full');
          this.enabledCourses = this.organization.courses;
          this.unlock();
        },
        (error: any) => {
          this.logService.error('Error getting organizations. ' + error.message);
        });
    }
    else {
      this.unlock();
    }

    /*
    this.api.get('organizations/courses').subscribe(
      (result: any) => {
        if (result.data) {
          this.organization = new Organization(result.data, 'full');
          this.unlock();
        }
        this.loaded = true;
      },
      (error: any) => {
        this.logService.debug('Error getting organization course. ' + error.message);
        this.loaded = true;
      }
    );
    */


  }

  unlock() {
    this.logService.debug('enabled courses');
    this.logService.debug(this.enabledCourses);
    this.logService.debug('default courses');
    this.logService.debug(this.defaultCourses);
    if (this.enabledCourses && this.enabledCourses.length > 0) {
      this.setCoursePermissions(this.enabledCourses);
    }
    else {
      this.setCoursePermissions(this.defaultCourses);
    }
  }

  setCoursePermissions(courses) {
    this.access.anxiety = this.organizationService.hasCourseAccess(courses, 'Anxiety');
    this.access.depression = this.organizationService.hasCourseAccess(courses, 'Depression');
    this.access.publicspeaking = this.organizationService.hasCourseAccess(courses, 'Public Speaking');
    this.access.disaster = this.organizationService.hasCourseAccess(courses, 'Resiliency');
    this.access.mindfulness = this.organizationService.hasCourseAccess(courses, 'Mindfulness');
    this.access.purpose = this.organizationService.hasCourseAccess(courses, 'Purpose');
    this.access.sleep = this.organizationService.hasCourseAccess(courses, 'Sleep');
    this.access.work = this.organizationService.hasCourseAccess(courses, 'Work');
    this.access.additionalInformation =  this.organizationService.hasCourseAccess(courses, 'Additional Information');
    this.loaded = true;
  }

  onAdditionalInfo() {

  }

}
