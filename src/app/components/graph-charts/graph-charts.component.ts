import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { ApiService } from '../../lib/api.service';
import { StorageService } from '../../lib/storage.service';
import { User } from '../../models/user';
import { UserService } from '../../lib/user.service';
import { LogService } from '../../lib/log.service';
import { LineChartComponent } from '../graphs/linechart/linechart.component';
import { BarChartComponent } from '../graphs/barchart/barchart.component';
import { DonutChartComponent } from '../graphs/donutchart/donutchart.component';
import { GraphService } from '../../lib/graph.service';

enum GraphType {
	Line = 'Line',
	Bar = 'Bar',
	Pie = 'Pie'
}

@Component({
	selector: 'graphcharts',
	templateUrl: 'graph-charts.component.html',
	styleUrls: ['./graph-charts.component.scss']
})

export class GraphChartsComponent implements OnInit {
	@Input() graphId: string;
	@Input() graphType: GraphType;
	@Input() graphConfig: any;

	graphStyles: any;

	constructor(
		private api: ApiService,
		private userService: UserService,
		private log: LogService,
		private storage: StorageService) {

	}

	ngOnInit() {
		this.graphStyles = {
			className: this.graphConfig['className'],
			height: this.graphConfig['height'],
			width: this.graphConfig['width']
		}
	}

}
