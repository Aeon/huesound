$(function(){
	mbalbums = function(data) {
		coverHack.processCovers(data);
	};
	coverHack = {
		allColors: ['#000000', '#CC3333', '#FF3333', '#FF6633', '#FF9933', '#FFCC66', '#FFFF33', '#CCCC33', '#99CC33', '#33CC33', '#009933', '#006633', '#33CC99', '#33CCFF', '#3366CC', '#333399', '#000066', '#663399', '#990099', '#990066', '#FF0066', '#CCCC99', '#996666', '#996633', '#663333', '#CC9966', '#996633', '#663300', '#333300', '#330000', '#333333', '#666666'],
		// 30 gives us a 6x5 grid, looks nice
		albumCount: 30,
		firstRun: true,
		processing: false,
		local: false,
		imgUrlBase: "",
		albumAPI: "",
		echoNestAPI: "http://developer.echonest.com/api/v4/song/profile?api_key=0QEJCQCJIBTN2U6UG&format=jsonp&bucket=id:rdio-us-streaming&bucket=id:rdio-us-streaming",
		// http://developer.echonest.com/api/v4/track/profile?api_key=0QEJCQCJIBTN2U6UG&format=json&id=musicbrainz:track:%id%&bucket=audio_summary
		rdioPlayer: "http://embedtacular.appspot.com/",
		data: null,
		fetchCovers: function(color) {
			if(coverHack.firstRun) {
				$( "#instructions_txt" ).toggle( 'puff', {}, 500, function() {
					$( "#albumsContainer" ).show();
				} );
				coverHack.firstRun = false;
			} else if(!coverHack.processing) {
				coverHack.view.hideAlbums();
			} else {
				return;
			}
			coverHack.view.changeBG(color);
			color = color.replace('#', '');
			coverHack.processing = true;
			$.ajax({
				url: coverHack.albumAPI.replace(/%color%/, color),
				timeout: 5000,
				dataType: "jsonp",
				jsonp: false,
				jsonpCallback: "mbalbums",
				cache: false
			});
		},
		processCovers: function(data) {
			coverHack.processing = false;
			coverHack.data = data;
			coverHack.view.showAlbums();
			coverHack.resolveTracks();
		},
		resolveTracks: function() {
			var tracks = [],
				i,
				j = 0;
			for(i = 0; i < coverHack.data.length; i++) {
				// if(j%10 === 0) {
				// 	tracks.push([]);
				// }
				// tracks[Math.floor(j/10)].push("id=musicbrainz:song:" + coverHack.data[i].tracks[0]);
				// j++;

				if(coverHack.data[i].embed_url) {
					coverHack.view.showPlay(i);
				}

				// coverHack.fetchTrack(coverHack.data[i].tracks[0], i, 0);

				// for(j = 0; j < coverHack.data[i].tracks.length; j++) {
				// 	coverHack.fetchTrack(coverHack.data[i].tracks[j], i, j);
				// 	tracks.push("id=musicbrainz:song:" + coverHack.data[i].tracks[j]);
				// }
			}
			// for(i = 0; i < tracks.length; i++) {
			// 	tracks[i] = tracks[i].join('&');				
			// }

		},
		/*
		fetchTrack: function(trackMBID, albumIndex, trackIndex) {
			$.ajax({
				url: coverHack.echoNestAPI + "&id=musicbrainz:song:" + trackMBID,
				timeout: 5000,
				dataType: "jsonp",
				cache: true,
				success: function(data) {
					console.log("response for " + albumIndex + " : " + trackIndex);
					if(data.response.status.code === 0 && data.response.songs.length > 0) {
						song = data.response.songs[0];
					 	if(typeof(song.foreign_ids) !== 'undefined') {
							console.log('found playable song!');
							coverHack.data[albumIndex].rdio = song.foreign_ids[0].foreign_id.replace('rdio-us-streaming:song:', '');
							coverHack.view.showPlay(albumIndex);
							console.log(coverHack.data[albumIndex]);
						}
					} else {
						console.log('album unplayable :(');
					}
				}
			});
		},
		*/
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
				    // Trim trailing/leading whitespace
				    color = color.replace(/^\s*|\s*$/, '');

				    // Expand three-digit hex
				    color = color.replace(
				        /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
				        '#$1$1$2$2$3$3'
				    );

				    // Calculate ratio
				    var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
				        // Determine if input is RGB(A)
				        rgb = color.match(new RegExp('^rgba?\\(\\s*' +
				            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
				            '\\s*,\\s*' +
				            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
				            '\\s*,\\s*' +
				            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
				            '(?:\\s*,\\s*' +
				            '(0|1|0?\\.\\d+))?' +
				            '\\s*\\)$', 'i')),
				        alpha = !!rgb && rgb[4] !== null ? rgb[4] : null,

				        // Convert hex to decimal
				        decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
				            /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
				            function() {
				                return parseInt(arguments[1], 16) + ',' +
				                    parseInt(arguments[2], 16) + ',' +
				                    parseInt(arguments[3], 16);
				            }
				        ).split(/,/),
				        returnValue;

				    // Return RGB(A)
				    return !!rgb ?
				        'rgb' + (alpha !== null ? 'a' : '') + '(' +
				            Math[darker ? 'max' : 'min'](
				                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
				            ) + ', ' +
				            Math[darker ? 'max' : 'min'](
				                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
				            ) + ', ' +
				            Math[darker ? 'max' : 'min'](
				                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
				            ) +
				            (alpha !== null ? ', ' + alpha : '') +
				            ')' :
				        // Return hex
				        [
				            '#',
				            coverHack.util.color.pad(Math[darker ? 'max' : 'min'](
				                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
				            ).toString(16), 2),
				            coverHack.util.color.pad(Math[darker ? 'max' : 'min'](
				                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
				            ).toString(16), 2),
				            coverHack.util.color.pad(Math[darker ? 'max' : 'min'](
				                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
				            ).toString(16), 2)
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
			albumTpl: '<li id="%i%" data-album="%id%"><img src="%icon_url%"></li>',
			showAlbums: function() {
				$("#progress" ).hide();
				var i,
					album,
					tpl,
					albumsHTML = [];
				for(i = 0; i < coverHack.data.length; i++) {
					album = coverHack.data[i];
					tpl = coverHack.view.albumTpl;
					tpl = tpl.replace(/%icon_url%/g, album.icon_url);
					tpl = tpl.replace(/%i%/g, i);
					tpl = tpl.replace(/%id%/g, album.release);
					albumsHTML.push(tpl);
				}
				// insert albums into page
				$('#albums').html(albumsHTML.join(''));

				// // show all the covers
				// $('#albums li').toggle('puff', {}, 100);
			},
			hideAlbums: function() {
				$("#progress").show();
				// loop through albums and hide them all, one after another
				$('#albums li').each( function(i, album) {
					$(album).remove();
				});
			},
			changeBG: function(color) {
				color = coverHack.util.color.lighterColor(color, 0.6);
				$('body').animate( { backgroundColor: color }, 1000);
			},
			showPlay: function(albumIndex) {
				var albumCover = $('#albums #' + albumIndex);
				albumCover.data('rdio', coverHack.data[albumIndex].embed_url);
				albumCover.addClass('play');
				albumCover.append('<div class="playbtn"></div>');
				$('.playbtn', albumCover).fadeIn(500);
			},
			createColorWheel: function() {
				var r = Raphael("color-wheel");
				var pie = r.g.piechart(250, 310, 150, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], {colors: coverHack.allColors});
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
		},
		init: function() {
			coverHack.view.createColorWheel();
			coverHack.albumAPI = coverHack.local ? 
				"/images.json" :
				"http://huesound.org:5555/%color%/" + coverHack.albumCount + "/j";
				// + "?ts"+(+new Date());
			// hook up the play buttons
			$('.play', $('#albums')).live( "click", function(e) {
				$('#play').attr("src", $(this).data('rdio'));
				$('#large-album').css("background-image", 'url("' + $(this).attr('src') + '")');  
			});
			$('#play').attr("src", "");
		}
	};
	coverHack.init();
});
