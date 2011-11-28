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
	
	var prtyDate = prettyDate(tweets[iterator].created_at);	
	var infowindow = new google.maps.InfoWindow({
	  content: "<u>"+"<img src=\""+tweets[iterator].user.profile_image_url_https+"\" />  "+"<b>"+tweets[iterator].user.screen_name + "</b>" + " says: </u> <br />" + "<i>"+tweets[iterator].text+"</i>"+"<br />"+"("+prtyDate+")",
	  title: "Tweet",
	  size: new google.maps.Size(50,30)
	});
	
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
      infowindow.setOptions();
	  infowindow.open(map, marker);
    }
  }

  function serializeTweet(tweet) {
	coordinates.push(new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]));
    tweets.push(tweet);
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
