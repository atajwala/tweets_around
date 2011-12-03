  var coordinates = [];
  var tweets = [];
  var markers = [];
  var iterator = 0;
  var map, usa, center;
  var SLOW = 200;
  var FAST = 75;

  function initialize() {
	usa = new google.maps.LatLng(38, -97);
	center = new google.maps.LatLng(0, 0);
	
    var myOptions = {
      zoom: 2,
      center: center,
	  scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"),
          myOptions);
  }

  function cleanup(){
	if (markers) {	 
	  for (i in markers) {
	    markers[i].setMap(null);	
	  }
	  iterator = 0; 
	  tweets = [];
	  coordinates = [];
	  markers = [];
	}
  }

  function drop() {
	for (var i = 0; i < coordinates.length; i++) {
	  setTimeout(function() {
	    addMarker();
	  }, i * ((coordinates.length >= 50)?FAST:SLOW));
    }
  }

  function addMarker() {
	
	if(iterator == 0) {
	  map.setCenter(coordinates[iterator]);
	  map.setZoom(4);
	  setTimeout(function() { map.setZoom(5); }, 1000);
	}
    var marker = new google.maps.Marker({
	  map:map,
	  draggable:false,
	  animation: google.maps.Animation.DROP,
	  title: "screen-name: " + tweets[iterator].user.screen_name,
	  position: coordinates[iterator]
	});
	markers.push(marker);
	
	var hipTweet = prettyTweet(tweets[iterator]);	
	
	var myOptions = {
	                 content: hipTweet
	                ,disableAutoPan: false
	                ,maxWidth: 0
	                ,pixelOffset: new google.maps.Size(-200, -210)
	                ,zIndex: null
	                ,boxStyle: { 
	                  background: "#C9DFAF",
	                  opacity: 0.9,
	                  width: "450px",
	                 }
	                ,closeBoxMargin: "10px 2px 2px 2px"
	                ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
	                ,infoBoxClearance: new google.maps.Size(5, 5)
	                ,isHidden: false
	                ,pane: "floatPane"
	                ,enableEventPropagation: false
	        };

	        var infowindow = new InfoBox(myOptions);
	    
	
/*	
	var infowindow = new google.maps.InfoWindow({
	  //content: "<div class=\"msgbox\">"+"<u>"+"<img src=\""+tweets[iterator].user.profile_image_url_https+"\" />  "+"<b>"+tweets[iterator].user.screen_name + "</b>" + " says: </u> <br />" + "<i>"+tweetLink+"</i>"+"<br />"+"("+prtyDate+")"+"</div>",
	  content: hipTweet,
	  title: "Tweet",
	  size: new google.maps.Size(50,30)
	});
*/	
	google.maps.event.addListener(marker, 'click', function() {
	  toggleBounce(marker, infowindow);
	});
		
	iterator++;
  }

  function toggleBounce(marker, infowindow) {
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
	  infowindow.close(map, marker);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      //infowindow.setOptions();
	  infowindow.open(map, marker);
    }
  }

  function serializeTweet(tweet) {
	coordinates.push(new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]));
    tweets.push(tweet);
  }

  function prettyLink(tweet) {
	var urlRegex = /https*\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/gi;
	var url = tweet.match(urlRegex);
	if (url == null) { return tweet; } 
	url[0] = "<a href=\""+url[0]+"\" target=\"_blank\">"+url[0]+"</a>";
	tweet = tweet.replace(urlRegex, url[0]);
	return tweet;
  }

  function prettyTweet(tweet) {
	var prtyDate = prettyDate(tweet.created_at);
	var tweetLink = prettyLink(tweet.text);
    var tweetText = "<div class=\"msgbox\">"+
					"<img src=\""+tweet.user.profile_image_url_https+"\" />  "+
					"<b><twtname>"+tweet.user.screen_name+"</twtname></b>"+
					" says: <br /><br />" + "<i><twttext>"+tweetLink+"</twttext></i>"+
					"<br />"+"<twttime>("+prtyDate+")</twttime>"+"</div>";
    return tweetText;
  }

(function($) {
jQuery.fn.drawCircle = function(args) {
  return this.each(function() {
    var size = args.cirsize;
	var radius = args.radius;
	var distance = args.distance;
	
	$(this).css({
		display: 'block',
		width: size + 'px',
		height: size + 'px',
		top: distance + 'px',
		right: distance + 'px',
	});

	$(this).css('-moz-border-radius', radius);
	$(this).css('-webkit-border-radius',radius);
  });
}
})(jQuery);
