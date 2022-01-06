import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilityService } from './utility.service';
import 'rxjs/Rx';
import { Subject } from 'rxjs';

import * as _ from 'lodash';

@Injectable()
export class GraphService {

    refresh = new Subject();
    graphData: any; 

    constructor(

    ) {

    }

    setGraphData(graphData){
        this.graphData = graphData; 
    }

    triggerRefresh() {
        this.refresh.next(this.graphData);
    }

    onRefresh(){
        this.triggerRefresh(); 
    }


}