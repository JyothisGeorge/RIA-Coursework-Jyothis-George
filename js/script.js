var selectedId;
var museums;
var museumInfo= "";
var latitude;
var longitude;
var map;
			
	$(document).ready(function(){
		$(".panel-group").hide();
		getMuseums();
        initMap();
        getImages();
        $("#map").hide();
	});
    
//  JSON PARSE

	function getMuseums() {
		$.get("./php/museums.php",function(data,status){
		var response='';
		var json = $.parseJSON(data);
		museums = json.museums;
		response += "<option>Select A Museum</option>";
			$.each(museums, function(index, item) {
			response += "<option value="+index+">" + item.museum_name + "</option>";
			$("#museumdropdown").html(response);
			});
		});
	}

// 	DISPLAY INFORMATION FROM MUSEUM
	function getMuseumInfo () {
		var museum_id = $("#museumdropdown").val();
		selectedId = museum_id;
		
		var museum_name = museums[museum_id].museum_name;
		var museum_description = museums[museum_id].museum_description;
		var museum_type = museums[museum_id].museum_type;
		var museum_address = museums[museum_id].address;
		var museum_postcode = museums[museum_id].postcode;
		var museum_latitude = museums[museum_id].lat;
		var museum_longitude = museums[museum_id].long;
		var museum_website = museums[museum_id].website;
		var museum_images = museums[museum_id].images;
	 							 	
		name = "<h1>" + museum_name + " ("+ museum_type + ")"+"</h1>";
		description = "<p><b>Description: </b>" + museum_description +"<br><a href='"+ museum_website +"' target='_blank'> Visit  "+ museum_name + " Website for more information</a>";
		type = "<p><b>Museum Type: </b>" + museum_type +"</p>";
		address = "<p><b>Address: </b>" + museum_address + ", "+ museum_postcode+ ", Glasgow </p>";
		latitude = "<p><b>Latitude: </b>" + museum_latitude + "</p>";
		longitude = "<p><b>Longitude: </b>" + museum_longitude + "</p>";
		website = "<b>Website: </b>";
		trytime = "";
		$(".homepagesection").hide();
		$(".panel-group").show();
		$(".nav").show();
		$("#info").html(name + description);
		$("#openinghourbox").html(trytime);
		$("#gettingherebox").html(address);
		$("#testname").html(address + latitude + longitude);
		$("#map").show();
		$("#menu-toggle").show();
		getDistance();
		getOpeningTimes();
		getImages();
		getClosedDate();
		mapResize();
		initMap();
		getAccordion();
		$(".hey").hide();
	}

 var maploc;  
  
//  GOOGLE MAPS 
	function initMap() {
		latitude = museums[selectedId].lat;
		longitude = museums[selectedId].long;
		musname = museums[selectedId].museum_name;
		musdesc = museums[selectedId].museum_description;
				
        maploc = {lat:parseFloat(latitude), lng:parseFloat(longitude)};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: maploc
        });
        
        var contentString = '<h5>' + musname + '</h5><p>' + musdesc + '</p>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        
        var marker = new google.maps.Marker({
          position: maploc,
          map: map,
          title: ''
        });
        
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
	}
	
// 	MAPS RESIZE FOR TABS
	function mapResize() {
	    $("a[href='#home']").on('shown.bs.tab', function () {
	    google.maps.event.trigger(map, 'resize');
	    map.setCenter(maploc);
	    });
    }

//  GET OPENING TIMES INFORMATION
	function getOpeningTimes() {
		$.each(museums[selectedId].opening_hours, function(daytime, timehour) {
			var trytime ="<b>" + daytime + ":</b> "+ timehour +"<br>";
			document.getElementById("openinghourbox").innerHTML+=trytime;
			console.log(trytime);
		});
	}

// 	GET DATES CLOSED
	function getClosedDate() {
		document.getElementById("openinghourbox").innerHTML+= "<span><b>Dates Closed: </b></span>";
		$.each(museums[selectedId].closed_days, function(index, dater) {
			var closeddate ="<span>" + dater +"</span> | ";
			document.getElementById("openinghourbox").innerHTML+=closeddate;
			console.log(closeddate);
		});
	}
	
// 	GET DISTANCE FROM CITY CENTRE
	function getDistance() {
		dest = document.getElementById("gettingherebox").innerHTML+= "<b>Distance From City Centre</b><br>";
		$.each(museums[selectedId].distance_citycentre, function(distancex, distancey) {
			var distancexx = distancex +": "+ distancey +"<br>";
			dest = document.getElementById("gettingherebox").innerHTML+=distancexx;
			console.log(distancexx);
		});
	}
// 	GET IMAGES OF MUSEUM
	function getImages() {
						$("#imagessection").empty();
		$.each(museums[selectedId].images, function(imgid, obj){
			var imageurl = obj.url;
			var imagedesc = obj.description;
			var imagedisplay ="<li><a href="+'images/'+imageurl+" title='"+imagedesc+"'><img src="+'images/'+imageurl+" height='250px' width='250px' max-height='250px' alt='"+imagedesc+"'></a></li>";
			img = document.getElementById("imagessection").innerHTML += imagedisplay;
			console.log(imagedesc);
		});
	}