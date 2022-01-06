import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { LogService } from '../../lib/log.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../lib/modal.service';
import { Appointment } from '../../models/appointment';
import { UserService } from "../../lib/user.service";
import { User } from "../../models/user";
import * as OT from '@opentok/client';
import { VideoChatService } from "../../lib/videochat.service";

import * as jQuery from 'jquery';

@Component({
  selector: 'video-share',
  templateUrl: 'video-share.component.html',
  styleUrls: ['video-share.component.scss']
})
export class VideoShareComponent implements OnInit {
  @ViewChild('subscriberDiv', {static: true}) subscriberDiv: ElementRef;
  @ViewChild('publisherDiv', {static: true}) publisherDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;
  streams: Array<OT.Stream> = [];

  publisher: OT.Publisher;
  publishing: Boolean;

  isLoaded: boolean = false;
  sessionId = "";
  token = "";
  id: string;
  appointment: Appointment;
  title: string;
  backLink: string;
  back: string;
  isNew: boolean = false;
  link: string;
  showEmail: boolean = false;
  email: string;
  url: string;
  user: User;
  host: boolean;
  mode: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    private modalService: ModalService,
    private log: LogService,
    private translate: TranslateService,
    private location: Location,
    private userService: UserService,
    private videoService: VideoChatService
  ) {

    this.title = "Video appointment";
    this.backLink = '/app/calendar';

    this.url = this.router.url;

    this.activatedRoute.params.subscribe(params => {
      if (params['id'] == 'new') {
        this.isNew = true;
        return;
      }

      this.id = params['id'];
    });
    this.user = this.userService.getUser();
    this.host = this.user.permissions.videohost;

    this.translate.stream('videoSharing').subscribe((res: any) => {
			this.back = res.endSession;
		});
  }

  ngOnInit() {
    if (this.url.search('session') != -1) {
      this.mode = "session";
      this.api.get('videos/join', { AppointmentID: this.id }).subscribe(
        (result: any) => {
          this.log.debug(result);
          this.appointment = new Appointment(result.data);
          let obj = result.data[0];
          this.sessionId = obj['sessionId'];
          this.token = obj['token'];
          this.isLoaded = true;
          this.initVideo();

        },
        (error: any) => {
          this.modalService.showAlert('Error', error.message);
          this.isLoaded = false;
        },
        () => {

        });
    }
    else {
      this.mode = "open";
      this.api.get('videos/open', { ID: this.id }).subscribe(
        (result: any) => {
          //guid
          let obj = result.data[0];
          this.sessionId = obj['sessionId'];
          this.token = obj['token'];
          this.isLoaded = true;
          if (!this.id) {
            this.location.go('app/videoshare/open/' + obj['guid']);
          }
          this.initVideo();
          this.link = document.location.origin + '/app/videoshare/open/' + obj['guid'];
        }
      );
    }

  }

  initVideo() {
    this.videoService.initSession(this.sessionId).then((session: OT.Session) => {
      this.session = session;
      this.session.on('streamCreated', (event) => {
        this.streams.push(event.stream);
      });
      this.session.on('streamDestroyed', (event) => {
        const idx = this.streams.indexOf(event.stream);
        if (idx > -1) {
          this.streams.splice(idx, 1);
        }
      });
    })
    .then(() => this.videoService.connect(this.token))
    .catch((err) => {

      alert('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
    });
  }

  onSend() {
    this.api.post('video/sendsession', {
      Email: this.email
    }).subscribe(
      (result: any) => {
        //this.modalService.showAlert(this.popupsEmail.success, this.popupsEmail.inbox);
        this.log.event('accesscode_emailed');
      },
      (error: any) => {
        //this.modalService.showAlert(this.popupsEmail.error, error.message);
        this.log.error('Error emailing invite. ' + error.message);
      }
      );
  }



  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  onResize(event?){
    let width = jQuery('#video-section').width();
    let height = jQuery('#video-section').height();
    jQuery('.OT_subscriber').width(width);
    jQuery('.OT_subscriber').height(height);
    jQuery('.OT_publisher').width(200);
    jQuery('.OT_publisher').height(200);
  }




}
