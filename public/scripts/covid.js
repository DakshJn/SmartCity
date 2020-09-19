var covid_func = function(url = "https://covid19.mathdro.id/api"){
	$.ajax({
			url: url,
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
	bar_graph_func(c_value,r_value,d_value);
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
var list_data = function(arr){
	arr.forEach((item,index) =>{
		var txt = "<option value ="+item['iso2']+">"+item['name']+"</option>";
		$("#countryId").append(txt);
	})
}
var change_data  =function(){
	var val = document.getElementById("countryId").value;
	console.log(val);
	covid_func('https://covid19.mathdro.id/api/countries/'+val)
}
var bar_graph_func = function(c_value,r_value,d_value){
	const chart  = document.getElementById("barChart");
	Chart.defaults.global.animation.duration = 4000;
	let  barChart = new Chart(chart,{
		type:'bar',
		data:{
			labels:['Confirmed', 'Recovered', 'Deaths'],
			datasets:[
				{
					label:["Confirmed","Recovered","Deaths"],
					backgroundColor:["rgba(97, 12, 207, 0.2)","rgba(242, 2, 2, 0.2)","rgba(14, 242, 2, 0.2)"],
					data:[c_value, r_value, d_value]
				}
			]
		}
	})
}

var line_graph_func = function(arr){
	const chart  = document.getElementById("lineChart");
	Chart.defaults.global.animation.duration = 4000;
	var c_data = [];
	var dates = [];
	var d_data = [];
	arr.forEach((item,index)=>{
		c_data.push(item.totalConfirmed);
		dates.push(item.reportDate);
		d_data.push(item.deaths.total);
	})
	let  barChart = new Chart(chart,{
		type:'line',
		data:{
			labels:dates,
			datasets:[
				{
					label:'Confirmed Cases',
					backgroundColor:"rgba(97, 12, 207, 0.2)",
					data:c_data
				},
				{
					label:'Deaths',
					backgroundColor:"rgba(242, 2, 2, 0.2)",
					data:d_data
				}
			]
		}
	})
}
$(document).ready(() =>{
	covid_func();
	$.ajax({
			url: "https://covid19.mathdro.id/api/countries",
			type: "GET",
			success: function(result){
				console.log(result);
				list_data(result['countries'])
			},
			error: function(err){
				console.log(err);
			}
		})
		$.ajax({
			url: "https://covid19.mathdro.id/api/daily",
			type: "GET",
			success: function(result){
				console.log(result);
				line_graph_func(result);
			},
			error: function(err){
				console.log(err);
			}
		})
	$("#go").click(function(){
		change_data();
	})
})