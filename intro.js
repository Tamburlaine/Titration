var intro=(function(){
	function setup(div){
		var firstDiv=$("<div class='firstDiv'>Welcome to the titration simulator walkthrough!</div>");
		var firstDivButt = $("<div class='firstDivButt'><button class ='btn firstButt'>OK</button></div>");
		firstDiv.append(firstDivButt);
		div.append(firstDiv);
		$(".firstButt").click(function(){
			firstDiv.remove();
			secondDivSetup();
		});
		
		var secondDivSetup=function(){
			var secondDiv=$("<div class='secondDiv'>The beaker to the left contains one liter of analyte. The analyte will change color from blue to red as the solution becomes more basic</div>")
			var secondDivButt = $("<div class='secondDivButt'><button class ='btn secondButt'>OK</button></div>");
			secondDiv.append(secondDivButt);
			div.append(secondDiv);
			$('.secondButt').click(function(){
				secondDiv.remove();
				thirdDivSetup();
			})
		}
		
		var thirdDivSetup = function(){
			var thirdDiv=$("<div class='thirdDiv'>These buttons allow you to control the amount of titrant added. Drip and Undrip add and remove a single drop of titrant from the analyte. Full Titration will put 200 mL of titrant in the analyte, and Clear will remove all titrant from the analyte</div>");
			var thirdDivButt = $("<div class='thirdDivButt'><button class ='btn thirdButt'>OK</button></div>");
			thirdDiv.append(thirdDivButt);
			div.append(thirdDiv);
			$('.thirdButt').click(function(){
				thirdDiv.remove();
				fourthDivSetup();
			})
		}
		
		var fourthDivSetup = function(){
			var fourthDiv=$("<div class='fourthDiv'>Try clicking Full Titration now</div>");
			var fourthDivButt = $("<div class='fourthDivButt'><button class ='btn fourthButt'>OK</button></div>");
			fourthDiv.append(fourthDivButt);
			div.append(fourthDiv);
			$('.fourthButt').click(function(){
				fourthDiv.remove();
				fifthDivSetup();
			})
		}
		
		var fifthDivSetup = function(){
			var fifthDiv=$("<div class='fifthDiv'>This graph displays the pH versus titrant added. The equivalence point is also labelled.</div>");
			var fifthDivButt = $("<div class='fifthDivButt'><button class ='btn fifthButt'>OK</button></div>");
			fifthDiv.append(fifthDivButt);
			div.append(fifthDiv);
			$('.fifthButt').click(function(){
				fifthDiv.remove();
				sixthDivSetup();
			})
		}
		
		var sixthDivSetup = function(){
			var sixthDiv=$("<div class='sixthDiv'>The ICEbox will update with the relevant equations for each stage of the titration</div>");
			var sixthDivButt = $("<div class='sixthDivButt'><button class ='btn sixthButt'>OK</button></div>");
			sixthDiv.append(sixthDivButt);
			div.append(sixthDiv);
			$('.sixthButt').click(function(){
				sixthDiv.remove();
			})
		}
	};
	
	return {setup: setup};
}());

$(document).ready(function(){
    $('.intro').each(function(){
        intro.setup($(this));});
});