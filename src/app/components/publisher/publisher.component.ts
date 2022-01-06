import { Component, ElementRef, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { VideoChatService } from '../../lib/videochat.service';

const publish = () => {

};

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})

export class PublisherComponent implements AfterViewInit {
  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  publisher: OT.Publisher;
  publishing: Boolean;
  @Output() publishLoaded = new EventEmitter<any>();

  constructor(private opentokService: VideoChatService) {
    this.publishing = false;
  }

  ngAfterViewInit() {
    const OT = this.opentokService.getOT();

    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
      insertMode: 'append',
      width: 200,
      height: 200
    });

    if (this.session) {
      if (this.session['isConnected']()) {
        this.publish();
      }
      this.session.on('sessionConnected', () => this.publish());
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
        jQuery('.OT_publisher').width(200);
        jQuery('.OT_publisher').height(200);
      }
    });
  }

  ngOnDestroy(){
    this.session.disconnect();
  }

}
