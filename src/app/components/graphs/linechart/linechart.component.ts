import { Component, OnInit, Input } from '@angular/core';
import { Chart, ChartData, ChartConfiguration } from 'chart.js';

import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { GraphService } from '../../../lib/graph.service';

@Component({
    selector: 'linechart',
    templateUrl: 'linechart.component.html',
    styleUrls: ['./linechart.component.scss']
})

export class LineChartComponent implements OnInit {

    @Input() id: string;
    @Input() graphData: any;
    @Input() header: string;
    @Input() subheader: string;
    @Input() legend: Array<string>;
    @Input() titles: Array<string>;
    @Input() colors: Array<string>;
    @Input() info: string;
    @Input() graphStyles: any;

    chart: Chart;

    constructor(
        private log: LogService,
        private graphService: GraphService
    ) {

        this.graphService.refresh.subscribe((graphData: any) => {
            this.graphData = graphData;
            this.chart.data = this.formatData();
            this.chart.update();
            this.chart.resize();
        });
    }

    renderGraph(canvas: HTMLCanvasElement) {
		type ModeType = "nearest" | "label" | "y" | "point" | "single" | "index" | "x-axis" | "dataset" | "x";
		type DistributionType = "linear" | "series";
		type SourceType = "auto" | "data" | "labels";
        let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        let gridLines = {
            display: false,
            drawBorder: false
        };

        let options = {
            hover: {
                mode: 'nearest' as ModeType,
                intersect: true
            },
            responsive: true,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: 'rgba(0,0,0,0.5)',
                        fontStyle: 'bold',
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        padding: 20
                    },
                    gridLines: gridLines
                }],
                xAxes: [{
                    type: 'time',
                    distribution: 'series' as DistributionType,
                    position: 'bottom',
                    fontSize: 10,
                    maxRotation: 0,
                    unit: 'day',
                    ticks: {
                        source: 'data' as SourceType,
                        maxRotation: 45,
                        callback: function (value) {
                            return value.substring(0, 6);
                        },
                    },
                    time: {
                        tooltipFormat: 'DD MMM'
                    },
                    gridLines: { display: false },
                }],
            }
        };

        //let data = this.formatData();
        let data = this.graphData;

        let params: ChartConfiguration = {
            type: 'line',
            data: data,
            options: options
        };
        this.chart = new Chart(ctx, params);
    }


    ngOnInit() {
        let canvas = <HTMLCanvasElement>document.getElementById(this.id);
        if (canvas == null) {
            let newCanvas = document.createElement('canvas');
            let container: any = document.getElementById('graph-container');
            newCanvas.id = this.id
            newCanvas.className = this.graphStyles['className']
            newCanvas.style.width = this.graphStyles['width']
            newCanvas.style.height = this.graphStyles['height']
            container.replaceWith(newCanvas);
            this.renderGraph(newCanvas);
        } else {
            this.renderGraph(canvas);
        }
    }

    resize() {
        this.chart.resize();
    }

    formatData() {
        let datasets = [];
        let i = 0;

        Object.keys(this.graphData).forEach(key => {
            let data = [];

            this.graphData[key].forEach(obj => {
                data.push({ x: new Date(obj.created), y: obj.count });
            });

            datasets.push({
                label: this.titles[i],
                borderColor: this.colors[i],
                pointBorderColor: this.colors[i],
                pointBackgroundColor: this.colors[i],
                pointHoverBackgroundColor: this.colors[i],
                pointHoverBorderColor: this.colors[i],
                pointBorderWidth: 3,
                pointHoverRadius: 3,
                pointHoverBorderWidth: 1,
                pointRadius: 2,
                fill: false,
                borderWidth: 2,
                data: data
            });
            i++;
        });

        return {
            datasets: datasets
        };

    }

}
