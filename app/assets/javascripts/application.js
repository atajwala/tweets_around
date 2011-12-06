// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var welcomeTimer;

'use strict';
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}

jQuery.ajaxSetup({ 
  'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
})

function clearTimer(){
	if(welcomeTimer) {
		clearTimeout(welcomeTimer);
		welcomeTimer = null;
	}
}

function makeBubbles(){
  $("#circle4").drawCircle({cirsize: 60, radius: 30, distance_x: 210, distance_y: 180});
  $("#circle3").drawCircle({cirsize: 40, radius: 25, distance_x: 155, distance_y: 125});
  $("#circle2").drawCircle({cirsize: 20, radius: 15, distance_x: 120, distance_y: 85});
  $("#circle1").drawCircle({cirsize: 10, radius: 10, distance_x: 93, distance_y: 57});
  $("#circle0").drawCircle({cirsize: 4, radius: 4, distance_x: 72, distance_y: 37});
}

function welcomeChirp(){
	stopChirp();
	$(".notice").css("display","block");
	welcomeTimer = setTimeout(function() { 
	  stopChirp();
	  welcomeTimer = null; 
	}, 12000);
	$(".notice").append("Welcome to <b>TweetsAround</b>!</br></br><em>TweetsAround</em> \
	  is a geo-location-based tool that allows you to search for recent tweets near any \
	  geographical point. </br></br> <i>If you liked this application, tweet about it or like it on \
	  Facebook.</i> </br></br> This application was developed by \
	  <a href=\"http://aslamtajwala.com\"><b>Aslam Tajwala</b></a>");
	makeBubbles();
}

function startChirp(msg, check) {
	var confused = "</br>still confused? <a href=\"http://en.wikipedia.org\
	/wiki/Geographic_coordinate_system\">click here!</a>";
	clearTimer();
	stopChirp();
	$(".notice").css("display","block");
	$(".notice").append(msg + ((check)?confused:""));
	makeBubbles();
}

function stopChirp() {
	$(".notice").css("display","none");
	$(".notice").empty();
	$("#circle0").css("display","none");
	$("#circle1").css("display","none");
	$("#circle2").css("display","none");
	$("#circle3").css("display","none");
	$("#circle4").css("display","none");
}

function validateInput() {
	var criteria = $("#criteria").val();
	//if (criteria == CRITERIA[0]) {
	if (criteria == "Address/City/State/Zip") {
		return validateAddress();
	} else {
		return validateLongLat();
	}
}

function validateAddress() {
	var address = $("#addr").val();	
	
	if ((address == "") || (address == "(make a selection then enter search text here)")) {
		startChirp("<b>CHIRP!</br></br>Please enter a valid: </br> Address, Landmark, \
		  Country, City, State, or Zip.</b></br>" + 
		  "<p>Example:</br> => Milpitas, CA (address)</br> => Eiffel Tower \
		  (landmark)</br> => 91210 (zip code)</p>", false);		  
		return false;
	} 
	return true;
}

function validateLongLat() {
	var latlong = $("#addr").val();
	latlong = latlong.split(/[\s,\/]/);
	var long = latlong[0];
	var lat  = latlong[1];
	
	if (long == "" || lat == "") {
		startChirp("<b>CHIRP!</br></br>Please enter Longitude/Latitude values first.</b></br>"
		+ "<p>(Example: for the city of Milpitas, CA, USA:</br> \
		  Longitude = <b>-121.898065</b> and Latitude = <b>37.432539</b>)</p>", true);
		return false;
	}	
	if (isNaN(long) || isNaN(lat)) {
		startChirp("<b>CHIRP!</br></br>Longitude/Latitude values have to be numbers.</b></br>"
		+ "<p>(Example: for the city of Milpitas, CA, USA:</br> \
		  Longitude = <b>-121.898065</b> and Latitude = <b>37.432539</b>)<p>", true);
		return false;
	}	
	if((long < -180 || long > 180) || (lat < -90 || lat > 90)) {
	  if((lat < -90 || lat > 90)){
		startChirp("<b>CHIRP!</br></br>Latitude value ranges from -90 to 90.</b></br>"
		+ "<p>(Example: for the city of Milpitas, CA, USA:</br> \
		  Latitude = <b>37.432539</b>)</p>", true);
	  }
	  if((long < -180 || long > 180)){
		startChirp("<b>CHIRP!</br></br>Longitude value ranges from -180 to 180.</b></br>"
		+ "<p>(Example: for the city of Milpitas, CA, USA:</br> \
		  Longitude = <b>-121.898065</b>)</p>", true);
	  }
	  return false;
	}	
	return true;
}

$(document).ready(function(){
	
  $("#bird").click(function(){ 
	if(welcomeTimer) {
	  clearTimer();
	  stopChirp();
	} else {
	  clearTimer(); 
	  welcomeChirp();	
	} 
  });

  setTimeout(function() { welcomeChirp(); }, 3000);
  $("#findtweets").submit(function(){
	var retVal = false; 
	retVal = validateInput();	
	if (!retVal){
		return false;
	}
	stopChirp();
	$("#busy").css("visibility","visible");
	$("#search").addClass("box_disabled");
	$.post(this.action, $(this).serialize(), null, "script");
	return false;
  });
 
  $("#addr").blur(function() {
	if($(this).value == "") {
		$(this).val($(this).data("(make a selection then enter search text here)"));
	}
  });

  $("#addr").focus(function() {this.value = ""});
  $("#addr").focus(function() {stopChirp();});
});

