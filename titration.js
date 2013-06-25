var titration=function(){
	
	function Model(div){
	
	};
	
	function Controller(model){
	
	};
	
	function View(div, model, controller){
	
	};
	
	function setup(div){		
		var buttonDiv = $("<div class='buttonDiv'></div>");
		var drip = $("<button class='drip'>Drip</button>");
		var undrip = $("<button class='undrip'>Undrip</button>");
		var dump = $("<div><button class='dump'>Full Titration</button></div>");
		// var slider = $("<div class='sliderDiv'></div>")
		var sliderDiv = $('<div id="slider-vertical" style="height: 200px;"></div>');
		buttonDiv.append(drip, undrip, dump);
		
		div.append(buttonDiv);
		div.append(sliderDiv);
		
		var model=Model();
        var controller=Controller(model);
        var view=View(div, model,controller);
		//view.graphSetup();
		
		
		// $(".sliderDiv").slider()

		// $(".slider").data("data-slider-orientation", "vertical");
		//now I'm binding functions to the buttons
		//we need to figure out when they stop clicking the titration button (it might get a little nasty if
		//we keep increasing maxTit when the data array only extends so far)
		$(".drip").onclick = function(){
			dripSize = model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", dripSize);
			model.infoAdd("maxTit", dripSize);
			view.graphpH(model.currentInfo["maxTit"], model.currentInfo["dataArray"]);
		};
		
		$(".undrip").onclick=function(){
			dripSize=model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", -dripSize);
			model.infoAdd("maxTit", -dripSize);
			view.graphpH(model.currentInfo["maxTit"], model.currentInfo["dataArray"]);
		};
		
		$(".dump").onclick=function(){
			DA = model.currentInfo["dataArray"];
			DALen = model.currentInfo["dataArray"].length;
			newMax = DA[DALen-1][0];
			model.infoChange("maxTit", newMax);
			model.infoChange("millilitersTit", newMax);
			view.graphPH(newMax, DA);
		};
		
		  $(function() {
    $( "#slider-vertical" ).slider({
      orientation: "vertical",
      range: "min",
      min: 12,
      max: -12,
      value: 12,
	  step: .01,
	  value: 0,
	  handle: "square",
	  formater: function(val){
		newval = Math.pow(10, -val);
		console.log(val, newval);
		return newval;
	  },
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value );
      }
    });
    //$( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
  });
	};
	
	return {setup: setup};
}();

$(document).ready(function(){
    $('.titration').each(function(){
        titration.setup($(this));});
});