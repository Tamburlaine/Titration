var titration=(function(){
	
	function Model(div){
		var currentInfo = {"molesTit":0, "molesAna":.3, "litersTit":.2, "litersAna":1, "litersTotal":.2, "Ka":0.000008, "concTit":3,
		"concAna":0, "dripSize":.005, "maxTit":0, "dataArray":[]};
		//I added a variable dripSize to indicate how much titrant we're adding per drip
		//I initialized it to 5 mL --K
		//I also added a variable maxTit for graphing
		//I think we should talk about how to deal with updating this. I think that we should have some way of automatically calculating
		//things like the conc, totalmL, etc. without individually updating these things (because it could be a big mess if we accidentally
		//updated the titrant mL but not the total mL or something. We can cover this tmrw



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

		var calculateConcTit = function(moles, volume){
			moles = parseFloat(moles);
			volume = parseFloat(volume);
			return moles/volume;
		};

		//end what I added --K

		var convertToMoles = function(volume, concentration){
			var moles = concentration*volume;
			return moles;
		}


		/*findPH converts from concentration to pH. It uses Math.log, which is base e, so it also uses the log change of base formula to convert to log base 10.*/
		var findPH = function(concentration){
			return -Math.log(concentration)/Math.log(10);
		}


		/* phCalc takes the current volume in beaker, the current number of moles of analyte, the kA of the analyte, and the amount of titrant added this step. It then calculates pH after reaction. Note that it currently automatically makes the %5 assumption, so it is slightly inaccurate. This will be fixed later. It is iteratively called in buildData*/
		/*baseAnalyte is an optional argument. If false, the calculator assumes a weak acid titrated with strong base, and interprets K as a Ka. If true, it assumes a weak base titrated with a strong acid, and interprets K as Kb . It defaults to false.*/
		var pHCalc = function(molesTitrantAdded, molesAnalyte, volume, K, eqPoint, baseAnalyte){
			
			if (baseAnalyte === undefined){
				baseAnalyte= false;
			}
			
			/*Calculates pH at the initial state, when nothing has been added.*/
			if (molesTitrantAdded == 0){
				var concAnalyte = molesAnalyte / volume;
				var pH = initialPH(concAnalyte, K)
			}
			
			else if (molesAnalyte > molesTitrantAdded){
				molesAnalyte -= molesTitrantAdded;
				var molesProduct = molesTitrantAdded;
			
				
				var concProduct = molesProduct / volume;
				var concAnalyte = molesAnalyte / volume;
				
				var pH = bufferZonePH(concProduct, concAnalyte, K)
				return pH
			}
			
			
			else {
				var pH = dilutionPH(molesTitrantAdded, molesAnalyte, eqPoint, volume)
			}
			if (baseAnalyte == true){
				pH = 14-pH;
			}
			return pH;
			
		}

		/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the volume of 1 drop of titrant. It then calls pHCalc iteratively while tracking the amounts of each object*/
		var buildData = function(baseAnalyte) {
			
			var molesAnalyte = currentInfo['molesAna'];
			var volumeAnalyte = currentInfo['litersAna'];
			var concTitrant = currentInfo['concTit']
			var volumeTitrant = currentInfo['litersTit']
			var K = currentInfo['Ka']
			var step = currentInfo['dripSize']
			//Variable assignment from current info
			
			var volume = volumeAnalyte
			var molesTitrant = (volumeTitrant*concTitrant);
			
			var eqPoint =  calculateEqPoint(molesAnalyte, volumeAnalyte, concTitrant, K)
			
			var dataArray = []
			
			var numSteps = volumeTitrant/step
			
			for (i=0;i<numSteps+1;i++){
				volumeTitrant-=step;
				volume += step;
				
				var molesTitrantAdded = molesTitrant * (i) / numSteps;
				var pH = pHCalc(molesTitrantAdded, molesAnalyte, volume, K, eqPoint, baseAnalyte);
				
				dataArray.push([i*step, pH])
			}
			
			console.log(String(dataArray));
			
			infoChange("dataArray", dataArray);
			
			return dataArray;
		}


		var initialPH = function(conc, k){
			var pH = .5*(findPH(conc*k))
			//Uses concentrated weak acid assumption to find pH at start
			return pH
		}

		var bufferZonePH = function(concProduct, concAnalyte, K){
			
			var change = K*concAnalyte/concProduct;
			var pH = findPH(change);
			//Uses 5% asumption to solve for change
			return pH;
		}

		var equivalencePH = function(concProduct, K){
			 var oppositeK = Math.pow(10, -14)/K
			//converts Ka to Kb, and vice versa
			 var pOH = .5*findPH(oppositeK/concProduct)
			 //Uses concentrated weak base asummption
			 var pH= 14- pOH
			 return pH
		}

		var dilutionPH = function(molesTitrantAdded, molesAnalyte, equivalencePH, volume){
			
			var initialOHConc = Math.pow(10, -(14-equivalencePH));
			var molesOH = initialOHConc * volume;
			var excessTitrant = molesTitrantAdded - molesAnalyte
			molesOH += excessTitrant;
			var newOHConc = molesOH/volume;
			var pOH = findPH(newOHConc)
			var pH = 14-pOH;
			return pH;
		}

		var calculateEqPoint = function( molesAnalyte, volumeAnalyte, concTitrant, K) {
			var volumeTitrantNeeded = molesAnalyte/concTitrant;
			var newVolume = volumeAnalyte + volumeTitrantNeeded;
			var concProduct = molesAnalyte/newVolume;
			var pH = equivalencePH(concProduct, K)
			return pH;
		}
		exports={"currentInfo":currentInfo, "infoAdd":infoAdd, "infoChange":infoChange, "calculateConcTit":calculateConcTit, "convertToMoles":convertToMoles,
		"findPH":findPH, "pHCalc":pHCalc, "buildData":buildData, "initialPH":initialPH, "bufferZonePH":bufferZonePH, "equivalencePH":equivalencePH,
		"dilutionPH":dilutionPH, "calculateEqPoint":calculateEqPoint};
		
		return exports;
	};
	
	function Controller(model){
	
	};
	
	function View(div, model, controller){
		//sets up the graph to the size of the data array. Includes function extendGraph(data) for updating graph
		var graphSetup = function(){
			dataArray=model.currentInfo["dataArray"];
			console.log("dataArray is " + dataArray, "currentInfo is "+ model.currentInfo+"dA "+ model.currentInfo["dataArray"]);
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
		var graphpH=function(){
			maxTit=model.currentInfo["maxTit"];
			dataArray=model.currentInfo["dataArray"];
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

		return exports;
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
		var dataArray = model.currentInfo["dataArray"];
        var controller=Controller(model);
        var view=View(div, model,controller);
		view.graphSetup(dataArray);
		
		
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
}());

$(document).ready(function(){
    $('.titration').each(function(){
        titration.setup($(this));});
});