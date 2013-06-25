var titration=function(){
	
	function Model(div){
		var currentInfo = {"molesTit":0, "molesAna":0, "millilitersTit":0, "millilitersAna":0, "millilitersTotal":0, "Ka":0, "concTit":0,
							"concAna":0, "dripSize":.005, "maxTit":0, "dataArray":[]};
		//I added a variable dripSize to indicate how much titrant we're adding per drip
		//I initialized it to 5 mL --K
		//I also added a variable maxTit for graphing
		//I think we should talk about how to deal with updating this. I think that we should have some way of automatically calculating
		//things like the conc, totalmL, etc. without individually updating these things (because it could be a big mess if we accidentally
		//updated the titrant mL but not the total mL or something. We can cover this tmrw

		exports = {};

		exports[currentInfo] = currentInfo;

		//I added this whole section here!
		//controller calls these things a lot, but I didn't mess with the currentInfo array yet
		//(so no automatic updates yet) --K

		//adds amount to property value
		var infoAdd = function(property, amount){
			currentInfo[property] += amount;
		};

		//changes the property value to amount
		var infoChange = function(property, amount){
			currentInfo[property] = amount;
		};

		var infoGet = function(property){
			return currentInfo[property];
		}

		var calculateConcTit = function(moles, volume){
			moles = parseFloat(moles);
			volume = parseFloat(volume);
			return moles/volume;
		};
		exports[infoAdd]=infoAdd;
		exports[infoChange]=infoChange;
		exports[infoGet]=infoGet;
		exports[calculateConcTit]=calculateConcTit;

		//end what I added --K

		var convertToMoles = function(volume, concentration){
			var moles = concentration*volume;
			return moles;
		}

		exports[convertToMoles]=convertToMoles

		/*findPH converts from concentration to pH. It uses Math.log, which is base e, so it also uses the log change of base formula to convert to log base 10.*/
		var findPH = function(concentration){
			return -Math.log(concentration)/Math.log(10);
		}

		exports[findPH]=findPH;
		/* phCalc takes the current volume in beaker, the current number of moles of analyte, the kA of the analyte, and the amount of titrant added this step. It then calculates pH after reaction. Note that it currently automatically makes the %5 assumption, so it is slightly inaccurate. This will be fixed later. It is iteratively called in buildData*/
		var pHCalc = function(molesTitrantAdded, molesAnalyte, volume, Ka){
			
			if (molesAnalyte >= molesTitrantAdded){
				molesAnalyte -= molesTitrantAdded;
				var molesProduct = molesTitrantAdded;
				molesTitrantAdded = 0;
			
				
				var concProduct = molesProduct / volume;
				var concAnalyte = molesAnalyte / volume;
				
				var change = Ka*concAnalyte/concProduct;
				
				var pH = findPH(change);
			}
			else {
				molesTitrantAdded -=molesAnalyte
				/*Where I left off Monday*/
			}
		}

		exports[pHCalc]=pHCalc;
		/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the volume of 1 drop of titrant. It then calls pHCalc iteratively while tracking the amounts of each object*/
		//I strongly suspect your life will be easier (and my life will be easier!) if you take only currentInfo as the input and redeclare all the variables inside the function
		var buildData = function(molesAnalyte, volumeAnalyte, concTitrant, volumeTitrant, Ka, step) {
			var volume = volumeAnalyte
			var molesTitrant = (volumeTitrant*concTitrant);
			
			var dataArray = []
			
			var numSteps = volumeTitrant/step
			
			for (i=1;i<numSteps+1;i++){
				volumeTitrant-=step;
				volume += step;
				
				var molesTitrantAdded = molesTitrant * (i) / numSteps;
				var pH = pHCalc(molesTitrantAdded, molesAnalyte, volume, Ka);
				
				dataArray.push([i*step, pH])
			}
			
			console.log(String(dataArray));
			return dataArray;
		}

		exports[buildData]=buildData;
	};
	
	function Controller(model){
	
	};
	
	function View(div, model, controller){
		//sets up the graph to the size of the data array. Includes function extendGraph(data) for updating graph
		var graphSetup = function(dataArray){
			$(".graph").remove();
		
			var margin = {top: 20, right: 20, bottom: 30, left: 50},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;
			
			
			var x = d3.scale.linear()
				.range([0, width]);
			
			var y = d3.scale.linear()
				.range([height, 0]);
			
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
			
			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
			
			var line = d3.svg.line()    
			.x(function(d) { return x(d[0]); })
			.y(function(d) { return y(d[1]); });
			
			var svg = d3.select("body").append("svg").attr("class", "graph")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
			
			  x.domain(d3.extent(dataArray, function(d) { return d[0]; }));
			  y.domain(d3.extent(dataArray, function(d) { return d[1]; }));
			
			  svg.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + height + ")")
				  .call(xAxis)
				  .append("text").attr("x", "90%").attr("dy", -4).text("milliliters titrant");
			
			  svg.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				  .append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("pH");

			//extendGraph is intended to be called outside of the function
			//It will add data the data to be graphed to the setup graph
			var extendGraph = function(data){
				  svg.append("path")
				  .datum(data)
				  .attr("class", "line")
				  .attr("d", line);
				  };
			
			return{extendGraph:extendGraph};
		};
			
		//updates the graph display after more titrant has been added
		//should be compatible with both drip and undrip
		var graphpH=function(maxTit, dataArray){
			maxTit = maxTit*1000.0;
			dataToGraph = [];
			for(var i=0; i<dataArray.length; i++){
				if(dataArray[i][0]<=maxTit){
					dataToGraph.push(dataArray[i])
				}
				else{
				break;
				}
			};
			graphSetup(dataArray).extendGraph(dataToGraph);
				
		};
		
		var exports={graphSetup:graphSetup, graphpH:graphpH};


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
	  formater: function(val){
		newval = Math.pow(10, -val);
		return newval;
	  },
	  handle: "square",
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value );
		console.log("butts: " + ui.value);
      }
    }).on('slide', function(event, ui){
		model.infoChange("Ka", ui.value);
		console.log(ui.value);
		view.graphpH(model.currentInfo["maxTit"], model.currentInfo["dataArray"]);
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