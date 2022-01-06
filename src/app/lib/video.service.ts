import { Injectable } from '@angular/core';
// import 'rxjs/Rx';
import { Subject } from "rxjs";

@Injectable()
export class VideoService {
    setWatcher = new Subject();
    fullScreenWatcher  = new Subject();

    setVideo(video: any){
        this.setWatcher.next(video);
    }

    endFullScreen(video:any){
        this.fullScreenWatcher.next(video);
    }

}
