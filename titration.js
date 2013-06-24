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
		buttonDiv.append(drip, undrip, dump);
		
		div.append(buttonDiv);
		
		var model=Model();
        var controller=Controller(model);
        var view=View(div, model,controller);
		view.graphSetup();
		
		//now I'm binding functions to the buttons
		$(".drip").onclick = function(){
			dripSize = model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", dripSize);
			model.infoAdd("maxTit", dripSize);
			view.graphpH()
		};
	};
	
	return {setup: setup};
}();

$(document).ready(function(){
    $('.titration').each(function(){
        titration.setup($(this));});
});