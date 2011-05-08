$(function(){
	coverHack = {
		allColors: ['#000000', '#CC3333', '#FF3333', '#FF6633', '#FF9933', '#FFCC66', '#FFFF33', '#CCCC33', '#99CC33', '#33CC33', '#009933', '#006633', '#33CC99', '#33CCFF', '#3366CC', '#333399', '#000066', '#663399', '#990099', '#990066', '#FF0066', '#CCCC99', '#996666', '#996633', '#663333', '#CC9966', '#996633', '#663300', '#333300', '#330000', '#333333', '#666666'],
		fetchCovers: function(color) {
			coverHack.view.changeBG(color);
			color = color.replace('#', '');

			console.log('GET covers from MB for color ' + color);
			$.ajax({
				url: "/images.json?ts"+(+new Date()),
				//url: "http://musicbrainz.homeip.net/coverarthack/images.html?c=" + color + "&n=50",
				//&ts"+(+new Date()),
				success: function(data, textStatus, jqXHR) {
					coverHack.showCovers(data);
				}
			});
		},
		util: {
			// http://stackoverflow.com/questions/1507931/generate-lighter-darker-color-in-css-using-javascript
			color: {
				pad: function(num, totalChars) {
				    var pad = '0';
				    num = num + '';
				    while (num.length < totalChars) {
				        num = pad + num;
				    }
				    return num;
				},

				// Ratio is between 0 and 1
				changeColor: function(color, ratio, darker) {
				    var difference = Math.round(ratio * 255) * (darker ? -1 : 1),
				        minmax     = darker ? Math.max : Math.min,
				        decimal    = color.replace(
				            /^#?([a-z0-9][a-z0-9])([a-z0-9][a-z0-9])([a-z0-9][a-z0-9])/i,
				            function() {
				                return parseInt(arguments[1], 16) + ',' +
				                    parseInt(arguments[2], 16) + ',' +
				                    parseInt(arguments[3], 16);
				            }
				        ).split(/,/);
				    return [
				        '#',
				        coverHack.util.color.pad(minmax(parseInt(decimal[0], 10) + difference, 0).toString(16), 2),
				        coverHack.util.color.pad(minmax(parseInt(decimal[1], 10) + difference, 0).toString(16), 2),
				        coverHack.util.color.pad(minmax(parseInt(decimal[2], 10) + difference, 0).toString(16), 2)
				    ].join('');
				},
				lighterColor: function(color, ratio) {
				    return coverHack.util.color.changeColor(color, ratio, false);
				},
				darkerColor: function(color, ratio) {
				    return coverHack.util.color.changeColor(color, ratio, true);
				}
			}
		},
		view: {
			showCovers: function() {
				console.log(data);
			},
			changeBG: function(color) {
				color = coverHack.util.color.darkerColor(color, .3);
				$('body').animate( { backgroundColor: color }, 1000);
			}
		},
		init: function() {
			var r = Raphael("holder");
			var pie = r.g.piechart(350, 300, 150, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], {colors: coverHack.allColors});
			pie.hover(function () {
				this.sector.stop();
				this.sector.scale(1.1, 1.1, this.cx, this.cy);
				if (this.label) {
					this.label[0].stop();
					this.label[0].scale(1.5);
					this.label[1].attr({"font-weight": 800});
				}
			}, function () {
				this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
				if (this.label) {
					this.label[0].animate({scale: 1}, 500, "bounce");
					this.label[1].attr({"font-weight": 400});
				}
			});
			pie.click(function() {
				coverHack.fetchCovers(this.sector.attrs.fill);
			});
		}
	};
	coverHack.init();	
});
