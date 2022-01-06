import { Component, OnInit, Input } from '@angular/core';

//import { AboutPage } from '../about/about';


import { Chart, ChartData, ChartConfiguration } from 'chart.js';

import * as jQuery from 'jquery';
import * as _ from 'lodash';

import { ApiService } from '../../../lib/api.service';


@Component({
    selector: 'donutchart',
    templateUrl: 'donutchart.component.html',
    styleUrls: ['./donutchart.component.scss']
})

export class DonutChartComponent implements OnInit {

    @Input() id: number;
    @Input() data: any;
    percent: string; 
    text: string;
    sidetext: string; 
    sidetextStrong: string;

    draw() {
        let canvas = <HTMLCanvasElement>document.getElementById('mood-percentage');
        let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);

        gradient.addColorStop(0, '#FFB576');
        gradient.addColorStop(1, '#F5E75E');


        /*
        this.log.debug(mcData.categories);
        this.moodPercentage = mcData.percentage;
        this.moodCategories = mcData.categories;

        let data: ChartData = {
            labels: [],
            datasets: [
                {
                    data: [this.moodPercentage, 100 - this.moodPercentage],
                    borderWidth: 0,
                    backgroundColor: [
                        gradient,
                        'rgba(240,240,240,1)'
                    ]
                }]
        };
        */
    }

    ngOnInit() {

    }
}