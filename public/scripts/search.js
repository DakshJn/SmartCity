var populate_search = function(arr){
	console.log("function is called");
	arr.forEach((item,index) =>{
		var txt= "<option value ="+item.id+">"+item.name+"</option>";
		$("#search_list").append(txt);
	})
}
$(document).ready(function(){
	$.ajax({
			url: "https://api.tomtom.com/search/2/poiCategories.json?key=UMgEdp0NIAjZ1RnylvWfZtrLwpcQAJHA",
			type: "GET",
			success: function(result){
				console.log(result);
				populate_search(result['poiCategories']);
			},
			error: function(err){
				console.log(err);
			}
		})
})