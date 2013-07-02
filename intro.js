var intro=(function(){
	function setup(div){
		var firstDiv=$("<div class='firstDiv'>Welcome to the titration simulator walkthrough!</div>");
		var firstDivButt = $("<div class='firstDivButt'><button class ='btn firstButt'>OK</button></div>");
		firstDiv.append(firstDivButt);
		$('.divButt').on('click', console.log("h'LO!"));
		div.append(firstDiv);
		$(".firstButt").click(function(){
			firstDiv.remove();
			secondDivSetup();
		});
		
		var secondDivSetup = function(){
			var secondDiv=$("<div class='secondDiv'>These buttons allow you to control the amount of titrant added. Drip and Undrip add </div>")
		}
	};
	
	return {setup: setup};
}());

$(document).ready(function(){
    $('.intro').each(function(){
        intro.setup($(this));});
});