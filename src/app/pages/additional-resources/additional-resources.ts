import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../lib/api.service';
import { LogService } from '../../lib/log.service';

@Component({
  selector: 'app-additional-resources',
  templateUrl: './additional-resources.html',
  styleUrls: ['./additional-resources.scss']
})
export class AdditionalResourcesPage implements OnInit {

  backLink: string;
  backText: string;
  cssClass: string;
  headerText: string;

  constructor(
    private apiService: ApiService,
    private logService: LogService,
  ) { }

  ngOnInit(): void {
    this.backLink = '/app/theory';
    this.backText = 'Back';
    this.cssClass = 'additional-resources';
    this.headerText = 'Additional Resources';
  }

  goToResource(link: string) {
    window.open(link);
    this.apiService.post('analytics/additionalresources', {
      link: link
    }).subscribe(
      (result: any) => {
        window.open(link);
      },
      (error: any) => {
        this.logService.error('Error logging link click');
      }
    );
  }

}
