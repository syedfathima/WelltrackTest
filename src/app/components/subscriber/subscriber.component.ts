import { Component, ElementRef, AfterViewInit, ViewChild, Input,Output,EventEmitter } from '@angular/core';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})

export class SubscriberComponent implements AfterViewInit {
  @ViewChild('subscriberDiv') subscriberDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;
  @Output() subscriberLoaded = new EventEmitter<any>();
  subscriber: any;


  constructor() { }

  ngAfterViewInit() {
    this.subscriber = this.session.subscribe(this.stream, this.subscriberDiv.nativeElement, { insertMode: 'append' }, (err) => {
      this.subscriberLoaded.emit();
      let width = jQuery('#video-section').width();
      let height = jQuery('#video-section').height();
      jQuery('.OT_subscriber').width(width);
      jQuery('.OT_subscriber').height(height);
    });
  }

  ngOnDestroy() {
    this.session.unsubscribe(this.subscriber)
  }


}
