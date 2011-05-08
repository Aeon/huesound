$(function(){
	coverHack = {
		allColors: ['#000000', '#CC3333', '#FF3333', '#FF6633', '#FF9933', '#FFCC66', '#FFFF33', '#CCCC33', '#99CC33', '#33CC33', '#009933', '#006633', '#33CC99', '#33CCFF', '#3366CC', '#333399', '#000066', '#663399', '#990099', '#990066', '#FF0066', '#CCCC99', '#996666', '#996633', '#663333', '#CC9966', '#996633', '#663300', '#333300', '#330000', '#333333', '#666666'],
		fetchCovers: function(color) {
			color = color.replace('#', '');
			console.log('GET covers from MB for color ' + color);
			$.ajax({
				url: "http://musicbrainz.homeip.net/coverarthack/images.html?c=" + color + "&n=50",
				//&ts"+(+new Date()),
				success: function(data, textStatus, jqXHR) {
					console.log(data[0]);
					console.log($.parseJSON(data));
					coverHack.showCovers(data);
				}
			});
		},
		view: {
			showCovers: function() {
				console.log(data);
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
