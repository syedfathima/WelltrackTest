import { Component, OnInit } from '@angular/core';


declare var G_vmlCanvasManager;
/**
 * http://stackoverflow.com/questions/35713405/css-how-to-fit-a-circular-progress-bar-according-to-screen-size-mobile
 */
@Component({
	selector: 'wt-progress',
	templateUrl: 'wt-progress.html'
})
export class WtProgress implements OnInit {

	constructor() {

	}

	ngOnInit() {
		let el = document.getElementById('graph'); // get canvas

		let options = {
			percent: parseFloat(el.getAttribute('data-percent')) || 25,
			size: parseFloat(el.getAttribute('data-size')) || (screen.width - 5),
			lineWidth: parseFloat(el.getAttribute('data-line')) || 50,
			rotate: parseFloat(el.getAttribute('data-rotate')) || 0
		}

		//retina support
		options.size = options.size * 2;
		options.lineWidth = options.lineWidth * 2;

		let canvas = document.createElement('canvas');
		let span = document.createElement('span');
		span.textContent = options.percent + '%';

		if (typeof (G_vmlCanvasManager) !== 'undefined') {
			G_vmlCanvasManager.initElement(canvas);
		}

		let ctx = canvas.getContext('2d');

		let gradient = ctx.createLinearGradient(0, 0, 0, 150);
		gradient.addColorStop(0, '#f6d365');  // #f6d365, #fda085
		gradient.addColorStop(1, '#fda085');

		canvas.width = canvas.height = options.size;

		el.appendChild(span);
		el.appendChild(canvas);

		ctx.translate(options.size / 2, options.size / 2); // change center
		ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

		//imd = ctx.getImageData(0, 0, 240, 240);
		let radius = (options.size - options.lineWidth) / 2;

		let drawCircle = function (color, lineWidth, percent) {
			percent = Math.min(Math.max(0, percent || 1), 1);
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
			ctx.strokeStyle = color;
			ctx.lineCap = 'round'; // butt, round or square
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		};

		drawCircle('#f6f6f6', options.lineWidth, 100 / 100);
		drawCircle(gradient, options.lineWidth, options.percent / 100);
	}

}
