var titration=(function(){
	
//	function Model(div){
//		var currentInfo = {"molesTit":0, "molesAna":.3, "litersTit":.2, "litersAna":1, "litersTotal":.2, "Ka":0.000008, "concTit":3,
//		"concAna":0, "dripSize":.005, "maxTit":200, "dataArray":[]};
//		//I added a variable dripSize to indicate how much titrant we're adding per drip
//		//I initialized it to 5 mL --K
//		//I also added a variable maxTit for graphing
//		//I think we should talk about how to deal with updating this. I think that we should have some way of automatically calculating
//		//things like the conc, totalmL, etc. without individually updating these things (because it could be a big mess if we accidentally
//		//updated the titrant mL but not the total mL or something. We can cover this tmrw
//
//
//
//		//I added this whole section here!
//		//controller calls these things a lot, but I didn't mess with the currentInfo array yet
//		//(so no automatic updates yet) --K
//
//		//adds amount to property value
//		var infoAdd = function(property, amount){
//			currentInfo[property] += amount;
//		};
//
//		//changes the property value to amount
//		var infoChange = function(property, amount){
//			currentInfo[property] = amount;
//		};
//
//		var calculateConcTit = function(moles, volume){
//			moles = parseFloat(moles);
//			volume = parseFloat(volume);
//			return moles/volume;
//		};
//
//		//end what I added --K
//
//		var convertToMoles = function(volume, concentration){
//			var moles = concentration*volume;
//			return moles;
//		}
//
//
//		/*findPH converts from concentration to pH. It uses Math.log, which is base e, so it also uses the log change of base formula to convert to log base 10.*/
//		var findPH = function(concentration){
//			return -Math.log(concentration)/Math.log(10);
//		}
//
//
//		/* phCalc takes the current volume in beaker, the current number of moles of analyte, the kA of the analyte, and the amount of titrant added this step. It then calculates pH after reaction. Note that it currently automatically makes the %5 assumption, so it is slightly inaccurate. This will be fixed later. It is iteratively called in buildData*/
//		/*baseAnalyte is an optional argument. If false, the calculator assumes a weak acid titrated with strong base, and interprets K as a Ka. If true, it assumes a weak base titrated with a strong acid, and interprets K as Kb . It defaults to false.*/
//		var pHCalc = function(molesTitrantAdded, molesAnalyte, volume, K, eqPoint, baseAnalyte){
//			
//			if (baseAnalyte === undefined){
//				baseAnalyte= false;
//			}
//			
//			/*Calculates pH at the initial state, when nothing has been added.*/
//			if (molesTitrantAdded == 0){
//				var concAnalyte = molesAnalyte / volume;
//				var pH = initialPH(concAnalyte, K)
//			}
//			
//			else if (molesAnalyte > molesTitrantAdded){
//				molesAnalyte -= molesTitrantAdded;
//				var molesProduct = molesTitrantAdded;
//			
//				
//				var concProduct = molesProduct / volume;
//				var concAnalyte = molesAnalyte / volume;
//				
//				var pH = bufferZonePH(concProduct, concAnalyte, K)
//				return pH
//			}
//			
//			
//			else {
//				var pH = dilutionPH(molesTitrantAdded, molesAnalyte, eqPoint, volume)
//			}
//			if (baseAnalyte == true){
//				pH = 14-pH;
//			}
//			return pH;
//			
//		}
//
//		/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the volume of 1 drop of titrant. It then calls pHCalc iteratively while tracking the amounts of each object*/
//		var buildData = function(baseAnalyte) {
//			
//			var molesAnalyte = currentInfo['molesAna'];
//			var volumeAnalyte = currentInfo['litersAna'];
//			var concTitrant = currentInfo['concTit']
//			var volumeTitrant = currentInfo['litersTit']
//			var K = currentInfo['Ka']
//			var step = currentInfo['dripSize']
//			//Variable assignment from current info
//			
//			var volume = volumeAnalyte
//			var molesTitrant = (volumeTitrant*concTitrant);
//			
//			var eqPoint =  calculateEqPoint(molesAnalyte, volumeAnalyte, concTitrant, K)
//			
//			var dataArray = []
//			
//			var numSteps = volumeTitrant/step
//			
//			for (i=0;i<numSteps+1;i++){
//				volumeTitrant-=step;
//				volume += step;
//				
//				var molesTitrantAdded = molesTitrant * (i) / numSteps;
//				var pH = pHCalc(molesTitrantAdded, molesAnalyte, volume, K, eqPoint, baseAnalyte);
//				
//				dataArray.push([i*step, pH])
//			}
//			
//			infoChange("dataArray", dataArray);
//			
//			return dataArray;
//		}
//
//
//		var initialPH = function(conc, k){
//			var pH = .5*(findPH(conc*k))
//			//Uses concentrated weak acid assumption to find pH at start
//			return pH
//		}
//
//		var bufferZonePH = function(concProduct, concAnalyte, K){
//			
//			var change = K*concAnalyte/concProduct;
//			var pH = findPH(change);
//			//Uses 5% asumption to solve for change
//			return pH;
//		}
//
//		var equivalencePH = function(concProduct, K){
//			 var oppositeK = Math.pow(10, -14)/K
//			//converts Ka to Kb, and vice versa
//			 var pOH = .5*findPH(oppositeK/concProduct)
//			 //Uses concentrated weak base asummption
//			 var pH= 14- pOH
//			 return pH
//		}
//
//		var dilutionPH = function(molesTitrantAdded, molesAnalyte, equivalencePH, volume){
//			
//			var initialOHConc = Math.pow(10, -(14-equivalencePH));
//			var molesOH = initialOHConc * volume;
//			var excessTitrant = molesTitrantAdded - molesAnalyte
//			molesOH += excessTitrant;
//			var newOHConc = molesOH/volume;
//			var pOH = findPH(newOHConc)
//			var pH = 14-pOH;
//			return pH;
//		}
//
//		var calculateEqPoint = function( molesAnalyte, volumeAnalyte, concTitrant, K) {
//			var volumeTitrantNeeded = molesAnalyte/concTitrant;
//			var newVolume = volumeAnalyte + volumeTitrantNeeded;
//			var concProduct = molesAnalyte/newVolume;
//			var pH = equivalencePH(concProduct, K)
//			return pH;
//		}
//		exports={"currentInfo":currentInfo, "infoAdd":infoAdd, "infoChange":infoChange, "calculateConcTit":calculateConcTit, "convertToMoles":convertToMoles,
//		"findPH":findPH, "pHCalc":pHCalc, "buildData":buildData, "initialPH":initialPH, "bufferZonePH":bufferZonePH, "equivalencePH":equivalencePH,
//		"dilutionPH":dilutionPH, "calculateEqPoint":calculateEqPoint};
//		
//		return exports;
//	};
	
	function Controller(model){
	
	};
	
	function View(div, model, controller){
		//sets up the graph to the size of the data array. Includes function extendGraph(data) for updating graph
		var graphSetup = function(){
			dataArray=model.currentInfo["dataArray"];
			$(".graph").remove();
		
			var margin = {top: 20, right: 20, bottom: 30, left: 50},
				width = 650 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;
			
			
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
				  .append("text").attr("x", "80%").attr("dy", -4).text("milliliters titrant");
			
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
		var beakerDiv=$("<div class='beakerDiv'></div>")
		var buttonDiv = $("<div class='buttonDiv'></div>");
		var slideDiv=$("<div class ='slideDiv'></div>");
		var drip = $("<button class='button drip'>Drip</button>");
		var undrip = $("<button class='button undrip'>Undrip</button>");
		var dump = $("<button class='button dump'>Full Titration</button>");
		var clear=$("<button class='button clear'>Clear</button>")
		// var slider = $("<div class='sliderDiv'></div>")
		var sliderDiv = $('<div class="slider" id="pKa" style="width: 350px;"><div class="slabel">pKa</div></div>');
		var sliderDiv2 = $('<div class="slider" id="molesAna" style="width: 350px;"><div class="slabel">Moles Analyte</div></div>');
		//var sliderDiv3 = $('<div class="slider-vertical" id="litersAna" style="height: 200px;"><div class="slabel">liters analyte</div></div>');
		var sliderDiv4 = $('<div class="slider" id="concTitrant" style="width: 350px;"><div class="slabel">Titrant Concentration (Mol/L)</div></div>');
		var sliderDiv5 = $('<div class="slider" id="dripSize" style="width: 350px;"><div class="slabel">Drip Size (mL)</div></div>');
		buttonDiv.append(drip, undrip, dump, clear);
		
		var inputDiv = $("<div class ='inputDiv input'></input>");
		var pKaInp = $("<input type='text' class='pKaInp input'></input>");
		var molesAnaInp = $("<input type='text' class='molesAnaInp input'></input>");
		var concTitInp = $("<input type='text' class='concTitInp input'></input>");
		var dripInp = $("<input type='text' class='dripInp input'></input>");
		inputDiv.append(pKaInp, molesAnaInp, concTitInp, dripInp);
		
		slideDiv.append(sliderDiv, sliderDiv2, sliderDiv4, sliderDiv5);
		div.append(beakerDiv, slideDiv, buttonDiv, inputDiv);
		
		var model=Model();
		var dataArray = model.currentInfo["dataArray"];
        var controller=Controller(model);
        var view=View(div, model,controller);
		
		var beaker = Beaker();
		beaker.setupBeaker(beakerDiv);
		beaker.setupDropper()

		view.graphSetup(dataArray);
		
		$(".pKaInp").change(function(){
			$( "#pKa" ).slider("setValue", $(".pKaInp").val());
			});
			
		$(".molesAnaInp").change(function(){
			 $( "#molesAna" ).slider("setValue", $(".molesAnaInp").val());
			});
		
		$(".concTitInp").change(function(){
			 $( "#concTitrant" ).slider("setValue", $(".concTitInp").val());
			});
			
		$(".dripInp").change(function(){
			 $( "#dripSize" ).slider("setValue", $(".dripInp").val()/1000);
			});
		
		// $(".Div").slider()

		// $(".slider").data("data-slider-orientation", "vertical");
		//now I'm binding functions to the buttons
		//we need to figure out when they stop clicking the titration button (it might get a little nasty if
		//we keep increasing maxTit when the data array only extends so far)
		$(".drip").click(function(){
			dripSize = model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", dripSize);
			model.infoAdd("maxTit", dripSize);
			view.graphpH();
		});
		
		$(".undrip").click(function(){
			dripSize=model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", -dripSize);
			model.infoAdd("maxTit", -dripSize);
			view.graphpH();
		});
		
		$(".dump").click(function(){
			model.buildData();
			var DA = model.currentInfo["dataArray"];
			var DALen = model.currentInfo["dataArray"].length;
			var newMax = DA[DALen-1][0];
			model.infoChange("maxTit", newMax);
			model.infoChange("millilitersTit", newMax);
			view.graphpH();
		});
		
		$(".clear").click(function(){
			console.log("clear");
			model.infoChange("maxTit", 0);
			console.log(model.currentInfo["maxTit"]);
			view.graphpH();
		});
		
    $( "#pKa" ).slider({
      range: "min",
      min: -2,
      max: 8,
	  step: .01,
	  value: 3,
	  formater: function(pKa){
		pKa = Math.round(pKa*1000)/1000;
		Ka = Math.pow(10, -pKa);
		model.infoChange("Ka", Ka);
		$( ".pKaInp" ).val(pKa);
		
		return pKa;
	  },
	  handle: "round",
    }).on('slide', function(event, ui){
		model.buildData();
		view.graphpH();
	});
  
    $( "#molesAna" ).slider({
      range: "min",
      min: .01,
      max: 2,
      value: 1,
	  step: .01,
	  handle: "round",
	  formater: function(val){
		val=Math.round(val*100)/100;
		model.infoChange("molesAna", val);
		$(".molesAnaInp").val(val);
		return val;
	  }
    }).on('slide', function(event, ui){
		model.buildData();
		view.graphpH();
	});	
  
    $( "#concTitrant" ).slider({
      range: "min",
      min: 0,
      max: 10,
      value: .5,
	  step: .01,
	  handle: "round",
	  formater: function(val){
		val = Math.round(val*100)/100;
		model.infoChange("concTit", val);
		$(".concTitInp").val(val);
		return val;
	  }
    }).on('slide', function(event, ui){
		model.buildData();
		view.graphpH();
	});
  
    $( "#dripSize" ).slider({
      min: .0001,
      max: .005,
      value: .0001,
	  step: .0001,
	  handle: "round",
	  //this alters the dripsize in liters
	  //also changes the currentInfo to the new dripval in liters
	  //but displays the drip size in mL
	  formater: function(val){
		val=Math.round(val*10000)/10000;
		var dripval = 1000*val;
		model.infoChange("dripSize", val);
		$(".dripInp").val(dripval)
		return dripval;
	  }
    }).on('slide', function(event, ui){
		model.buildData();
		view.graphpH();
	});
  

};
	
	return {setup: setup};
}());

$(document).ready(function(){
    $('.titration').each(function(){
        titration.setup($(this));});
});