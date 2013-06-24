var titration=function(){
	
	function Model(div){
	
	};
	
	function Controller(model){
	
	};
	
	function View(div, model, controller){
	
	};
	
	function setup(div){
		var model=Model();
        var controller=Controller(model);
        var view=View(div, model,controller);
		var canvas=$('<div class = "output"> <canvas id="graphwindow"></canvas></div>');
		div.append(canvas);
	};
	
	return {setup: setup}
}

$(document).ready(function(){
    $('.titration').each(function(){
        titration.setup($(this));});
});