import { Component, OnInit, Input } from '@angular/core';
import { Chart, ChartData, ChartConfiguration } from 'chart.js';

import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ApiService } from '../../../lib/api.service';
import { LogService } from '../../../lib/log.service';
import { GraphService } from '../../../lib/graph.service';

@Component({
    selector: 'barchart',
    templateUrl: 'barchart.component.html',
    styleUrls: ['./barchart.component.scss']
})

export class BarChartComponent implements OnInit {

    @Input() id: string;
    @Input() graphData: any;
    @Input() header: string;
    @Input() subheader: string;
    @Input() legend: Array<string>;
    @Input() titles: Array<string>;
    @Input() colors: Array<string>;
    @Input() info: string;

    chart: Chart;

    constructor(
        private log: LogService,
        private graphService: GraphService
    ) {

        this.graphService.refresh.subscribe((graphData: any) => {
            this.log.debug('data received');
            this.log.debug(graphData);
            this.graphData = graphData;
            this.chart.data = this.formatData();
            this.chart.update();
            this.chart.resize();
        });
    }

    renderGraph() {
        this.log.debug(this.id);
        let canvas = <HTMLCanvasElement>document.getElementById('barchart');
        let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        let gridLines = {
            display: false,
            drawBorder: false
        };

        let options = {
            maxBarThickness: 30,
            barThickness: 30,
            legend: {
                display: false,
            },
            scales: {
              
                yAxes: [{
                    ticks: {
                        fontColor: 'rgba(0,0,0,0.5)',
                        fontStyle: 'bold',
                        beginAtZero: true,
                        padding: 20,
                        callback: function (value, index, values) {
                            if (Math.floor(value) === value) {
                                return value;
                            }
                        }
                    },
                    gridLines: gridLines
                }],
                xAxes: [{
                    maxBarThickness: 30,
                    position: 'bottom',
                    fontSize: 0,
                    gridLines: { display: false },
                    ticks: {
                        maxRotation: 90,
                        autoSkip: true,
                        maxTicksLimit: 20,
                        callback: function (value) {
                            return moment(value).format('DD MMM');
                        },
                    },
                    time: {
                        tooltipFormat: 'DD MMM',
                    },
                }],
            }
        };

        let params: ChartConfiguration = {
            type: 'bar',
            data: this.formatData(),
            options: options
        };
        this.chart = new Chart(ctx, params);
        this.resize();
    }


    ngOnInit() {
        this.renderGraph();
    }

    resize(){
        this.chart.resize();
    }

    formatData() {
        let datasets = [];
        let i = 0;
        let labels = [];

        if (this.graphData) {
            Object.keys(this.graphData).forEach(key => {
                let arrTmp = _.map(this.graphData[key], 'created');
                labels = _.merge(labels, arrTmp);
            });
            labels = labels.sort(function (a, b) {
                return new Date(a).getTime() - new Date(b).getTime()
            });
            labels = _.uniq(labels);

            Object.keys(this.graphData).forEach(key => {
      

                let data = [];
                labels.forEach(date => {
                   
                    let count;
                    let obj = _.find(this.graphData[key], { created: date });

                    if (obj) {
                        count = obj['count'];
                    }
                    else {
                        count = 0;
                    }
                    data.push(count);
                });

                datasets.push({
                    label: this.titles[i],
                    backgroundColor: this.colors[i],
                    hoverBackgroundColor: this.colors[i],
                    borderColor: 'rgba(255,255,255,1)',
                    borderWidth: 0,
                    data: data
                });
                i++;
            });
        }

        return {
            labels: labels,
            datasets: datasets
        };
    }
}