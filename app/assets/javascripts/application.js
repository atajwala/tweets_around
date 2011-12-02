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

jQuery.ajaxSetup({ 
  'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
})

function clearTimer(){
	if(welcomeTimer) {
		clearTimeout(welcomeTimer);
		welcomeTimer = null;
	}
}

function makeBubbles(time){
    if (time == 0) {
	  $("#circle1").drawCircle({cirsize: 60, radius: 30, distance: 150});
	  $("#circle2").drawCircle({cirsize: 40, radius: 25, distance: 100});
	  $("#circle3").drawCircle({cirsize: 20, radius: 15, distance: 70});
	  $("#circle4").drawCircle({cirsize: 10, radius: 10, distance: 50});
	  return;
    }
	$("#circle1").drawCircle({cirsize: 60, radius: 30, distance: 150}).fadeOut(time);
	$("#circle2").drawCircle({cirsize: 40, radius: 25, distance: 100}).fadeOut(time);
	$("#circle3").drawCircle({cirsize: 20, radius: 15, distance: 70}).fadeOut(time);
	$("#circle4").drawCircle({cirsize: 10, radius: 10, distance: 50}).fadeOut(time);
}

function welcomeChirp(){
	stopChirp();
	$(".notice").css("display","block");
	welcomeTimer = setTimeout(function() { $(".notice").css("display","none").fadeOut(2000) }, 12000);
	$(".notice").append("Welcome to <b>TweetsAround</b>!</br></br><em>TweetsAround</em> \
	  is a geo-location-based tool that allows you to search for recent tweets near any \
	  geographical point. </br></br> <i>If you liked this application, tweet about it or like it on \
	  Facebook.</i> </br></br> This application was developed by \
	  <a href=\"http://aslamtajwala.com\"><b>Aslam Tajwala</b></a>");
	makeBubbles(6000);
}

function startChirp(msg, check) {
	var confused = "</br>still confused? <a href=\"http://en.wikipedia.org\
	/wiki/Geographic_coordinate_system\">click here!</a>";
	clearTimer();
	stopChirp();
	$(".notice").css("display","block");
	$(".notice").append(msg + ((check)?confused:""));
	makeBubbles(0);
}

function stopChirp() {
	$(".notice").css("display","none");
	$(".notice").empty();
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
		startChirp("<b>CHIRP!</br>Please enter a valid: </br> Address, Landmark, \
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
		startChirp("<b>CHIRP!</br>Please enter Longitude/Latitude values first.</b></br>"
		+ "<p>(Example: for the city of Milpitas, CA, USA:</br> \
		  Longitude = <b>-121.898065</b> and Latitude = <b>37.432539</b>)</p>", true);
		return false;
	}	
	if (isNaN(long) || isNaN(lat)) {
		startChirp("<b>CHIRP!</br>Longitude/Latitude values have to be numbers.</b></br>"
		+ "<p>(Example: for the city of Milpitas, CA, USA:</br> \
		  Longitude = <b>-121.898065</b> and Latitude = <b>37.432539</b>)<p>", true);
		return false;
	}	
	if((long < -180 || long > 180) || (lat < -90 || lat > 90)) {
	  if((lat < -90 || lat > 90)){
		startChirp("<b>CHIRP!</br>Latitude value ranges from -90 to 90.</b></br>"
		+ "<p>(Example: for the city of Milpitas, CA, USA:</br> \
		  Latitude = <b>37.432539</b>)</p>", true);
	  }
	  if((long < -180 || long > 180)){
		startChirp("<b>CHIRP!</br>Longitude value ranges from -180 to 180.</b></br>"
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

