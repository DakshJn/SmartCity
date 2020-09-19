var pos = {};
var map_func = function(){
	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
		var mymap = L.map('mapid').setView([pos.lat,pos.lng], 13);
		L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox/streets-v11',
			tileSize: 512,
			zoomOffset: -1,
			accessToken: 'pk.eyJ1Ijoic20yMTAxIiwiYSI6ImNrYTVodWxxMjAwOHQzbnBld250bzdjaHIifQ.a0R5s8BihWNiPZu-DYmXwA'
		}).addTo(mymap);
		$.ajax({
			url: "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+pos.lat+"&longitude=-"+pos.lng+"&localityLanguage=en",
			type: "GET",
			success: function(result){
				console.log(result);
			},
			error: function(err){
				console.log(err);
			}
		})
	});
  } else {
	  // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
var covid_func = function(){
	$.ajax({
			url: "https://covid19.mathdro.id/api/countries/IN",
			type: "GET",
			success: function(result){
				console.log(result);
				show_data(result['confirmed']['value'],result['recovered']['value'],result['deaths']['value'])
			},
			error: function(err){
				console.log(err);
			}
		})
}
var show_data = function(c_value, r_value, d_value){
	$("#confirmed_data").html(c_value);
	$("#recovered_data").html(r_value);
	$("#deaths_data").html(d_value);
	$('.count').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).text()
    }, {
        duration: 4000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
});
}
var show_search = function(arr){
	$("#body").html("<div class = 'container' id = 'search_result'><div class = 'row mt-5'><div class = 'col-xs-12' id = 'res_list'><h3>Here are your search results</h3> </div></div></div>");
	arr.forEach((item,index) =>{
		$("#res_list").append("<div class='card mb-2 mr-0'><div class='card-body'><h5 class='card-title'>"+item.poi.name+"</h5><h6 class='card-substitle mb-2 text-muted'>Rating:"+item.score.toFixed(2)+"</h6><p class='card-text'>Address:"+item.address.freeformAddress+"</p></div><a href = 'http://www.google.com/maps/place/"+item.position.lat+","+item.position.lon+"' class = 'btn btn-primary locbttn'>Get Location</a></div>")
	})
	$("#res_list").append("<a href = '/' class = 'btn btn-secondary'>Back</a>");
}
var info = function(){
	var cityName = "";
		$.ajax({
			url: "https://api.tomtom.com/search/2/reverseGeocode/"+pos.lat+"%2C"+pos.lng+".json?key=UMgEdp0NIAjZ1RnylvWfZtrLwpcQAJHA",
			type: "GET",
			success: function(result){
				console.log(result);
				cityName = result['addresses'][0]['address']['localName'];
				window.location.href = "https://en.wikipedia.org/wiki/"+cityName;
			},
			error: function(err){
				console.log(err);
				cityName = prompt("Sorry, we are having trouble getting your city. Please enter it manually");
				window.location.href = "https://en.wikipedia.org/wiki/"+cityName;
			}
		})
}
var search = function(q){
	$.ajax({
			url: "https://api.tomtom.com/search/2/nearbySearch/.JSON?key=UMgEdp0NIAjZ1RnylvWfZtrLwpcQAJHA&lat="+pos.lat+"&lon="+pos.lng+"&radius=1500&categorySet="+q,
			type: "GET",
			success: function(result){
				console.log(result);
				if(result['results'].length == 0){
					alert("Oops! Looks like the search came back empty");
					window.location.href = "/";
				}
				show_search(result['results'])
			},
			error: function(err){
				console.log(err);
			}
		})
}
$(document).ready(() =>{
	map_func();
	covid_func();
	$("#search").click(function(){
		var q = document.getElementById("search_list").value;
		search(q);
	});
	$("#info").click(function(){
		info();
	})
})