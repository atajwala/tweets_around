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
	  for (i=0; i < markers.length; i++) {
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
	var tweetLength = tweets[iterator].text.length;
	// tweaking tweet window size to a fixed minimum
	if (tweetLength < 80) {tweetLength = 80;}	
	
	var myOptions = {
	                 content: hipTweet
	                ,disableAutoPan: false
	                ,maxWidth: 0
	                ,pixelOffset: new google.maps.Size(-2.5*tweetLength, -147)
	                ,zIndex: null
	                ,boxStyle: { 
	                  background: "#C9DFAF",
	                  opacity: 0.95,
	                  width: tweetLength*5+"px",
	                 }
	                ,closeBoxMargin: "3px 3px 2px 2px"
	                ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
	                ,infoBoxClearance: new google.maps.Size(1, 1)
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
	var hastagRegex = /\#[^\s \W][\S]+/gi;
	var nameRegex = /\@[^\s \W][\S]+/gi;
	
	tweet = matchUrl(tweet, urlRegex);
	tweet = matchHashtag(tweet, hastagRegex);
	tweet = matchName(tweet, nameRegex);
	return tweet;
  }

  function matchUrl(tweet, urlRegex) {
    var url = tweet.match(urlRegex);

    if (url == null) { return tweet; } 
    url.forEach(function(item){
	  var urlText = "<a href=\""+item+"\" target=\"_blank\">"+item+"</a>";
	  tweet = tweet.replace(item, urlText);
	});
	return tweet;
  }

  function matchHashtag(tweet, hastagRegex) {
	var tag = tweet.match(hastagRegex);
	
	if (tag == null) { return tweet; }
	tag.forEach(function(item){
	  var htmlText = "<a href=\"http://twitter.com/search?q=%23"+item.slice(1)+"\" target=\"_blank\">"+item+"</a>";
	  tweet = tweet.replace(item, htmlText);
	});
	return tweet;
  }

  function matchName(tweet, nameRegex) {
    var name = tweet.match(nameRegex);

    if (name == null) { return tweet; } 
    name.forEach(function(item){
	  var nameText = "<a href=\"http://twitter.com/#!/"+item.slice(1)+"\" target=\"_blank\">"+item+"</a>";
	  tweet = tweet.replace(item, nameText);
	});  
	return tweet;  	
  }

  function prettyTweet(tweet) {
	var prtyDate = prettyDate(tweet.created_at);
	var tweetLink = prettyLink(tweet.text);
    var tweetText = "<div class=\"msgbox\">"+
					"<div id=\"divpic\"><img src=\""+tweet.user.profile_image_url_https+"\" /> </div>"+
					"<twtname>"+"<a href=\"http://twitter.com/#!/"+tweet.user.screen_name+"\" target=\"_blank\">"+tweet.user.screen_name+"</a>"+"</twtname>"+"<br />"+
					"<twtmsg>"+tweetLink+"</twtmsg>"+"<br />"+
					"<twttime>"+prtyDate+"</twttime>"+"</div>";
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
	$(this).css('border-radius',radius);
  });
}
})(jQuery);
