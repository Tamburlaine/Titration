var titration=(function(){

	var Beaker = function(){
    
		
		/*pHtoColor takes  pH and uses it to determine the opacities of the layers of the beaker image. Below start pH, the beaker is 100% red. Above end pH, it is 100% blue. Between the two pH's, the opacitys change linearly.*/
		var pHtoColor = function(pH){
			var startPH = 5
			var endPH=9
			var red = 1
			var blue = 0
			
			if (pH<=startPH){
				red = 1
				blue = 0
				
			}
			else if ( (startPH<pH) && (pH<endPH)){
				blue =(pH-startPH) /(endPH-startPH)
				red = 1-blue
			}
			else if (pH>=endPH){
				blue = 1
				red = 0
			}
			$('.red').attr('style','opacity:'+red)
			$('.blue').attr('style','opacity:'+blue)
		}
		
		/*Builds the html for the beaker*/
		var setupBeaker = function (div) {
			$(div).append("<div class= 'dropper'></div><img src=rsz_beakertop.png class='beakerTop'>")
			.append("<img src=rsz_beakercontents.png class='red'>")
			.append("<img src=rsz_beakercontentsblue.png class='blue'>")
			.append("<div class = 'instructions'><h6> Try setting some values, hit clear, and click the dropper!</h6></div>")
		}
		/* Not used. Will be removed when i can safely access titration.js*/
		
		var pH = Model().currentInfo['pH']
		/*Sets up the dropper*/
		var setupDropper = function(){
			$('.dropper').append("<img src = dropper.png class = 'dropperPic'>")
		}
		
		var exports = {'pHtoColor':pHtoColor, 'setupBeaker':setupBeaker, 'setupDropper':setupDropper}
		return exports
		
	};

	function Model(div){
		var currentInfo = {"molesTit":0, "molesAna":.3, "litersTit":.2, "litersAna":1, "litersTotal":.2, "Ka":0.000008, "concTit":3, "concAna":0, "dripSize":.005, "maxTit":200, "dataArray":[], 'pH':5.1, 'eqPoint':0};
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


		/* pHCalc takes molesTitrantAdded, molesAnalyte, total volume in the beaker, a appropriate Ka/Kb, the equivalence point(calculated by calculateEqPt), and an optional artifact baseAnalyte. It uses a piecewise function to calculate pH at a given set of info.*/
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
			}
			
			
			else {
				var pH = dilutionPH(molesTitrantAdded, molesAnalyte, eqPoint, volume)
			}
			if (baseAnalyte == true){
				pH = 14-pH;
			}
            infoChange('pH', pH)
			return pH;
			
		}

		/*buildData creates the array of data used to graph the curve. It takes starting moles and volumes of analyte, a concentraion and total amount to added of titrant, a Ka of analyte, and step, which is the volume of 1 drop of titrant. It then calls pHCalc iteratively while tracking the amounts of each object. Also builds the icebox.*/
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
            
            infoChange('eqPoint', eqPoint)
			
			var dataArray = []
			
			var numSteps = volumeTitrant/step
			
			for (i=1;i<numSteps+1;i++){
				volumeTitrant-=step;
				volume += step;
				
				var molesTitrantAdded = molesTitrant * (i) / numSteps;
				var pH = pHCalc(molesTitrantAdded, molesAnalyte, volume, K, eqPoint, baseAnalyte);
				
				dataArray.push([i*step, pH])
			}
			
			infoChange("dataArray", dataArray);
            $('.icebox').remove();
            $('.titration').append('<div class = "icebox"></div>')
            icebox().iceboxSetup($('.icebox'))
			return dataArray;
		}

        /*These pH functions are helper functions for pH calc. Based on the current moles of titrant added and the moles of analyte, a different function is called.*/
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
			 //Uses concentrated weak base assumption
			 var pH= 14- pOH
			 return pH
		}

		var dilutionPH = function(molesTitrantAdded, molesAnalyte, equivalencePoint, volume){
			var equivalencePH = equivalencePoint[1];
			var initialOHConc = Math.pow(10, -(14-equivalencePH));
			var molesOH = initialOHConc * volume;
			var excessTitrant = molesTitrantAdded - molesAnalyte
			molesOH += excessTitrant;
			var newOHConc = molesOH/volume;
			var pOH = findPH(newOHConc)
			var pH = 14-pOH;
			return pH;
		}
        /*calculateEqPoint is used to find the equivalence point. This value is used in dilutionPH calculations, and will be used to mark off the equivalence point on the graph*/
		var calculateEqPoint = function( molesAnalyte, volumeAnalyte, concTitrant, K) {
			var volumeTitrantNeeded = molesAnalyte/concTitrant;
			var newVolume = volumeAnalyte + volumeTitrantNeeded;
			var concProduct = molesAnalyte/newVolume;
			var pH = equivalencePH(concProduct, K)
			return [volumeTitrantNeeded, pH];
		}
		exports={"currentInfo":currentInfo, "infoAdd":infoAdd, "infoChange":infoChange, "calculateConcTit":calculateConcTit, "convertToMoles":convertToMoles,
		"findPH":findPH, "pHCalc":pHCalc, "buildData":buildData, "initialPH":initialPH, "bufferZonePH":bufferZonePH, "equivalencePH":equivalencePH,
		"dilutionPH":dilutionPH, "calculateEqPoint":calculateEqPoint};
		
		return exports;
	};
	
	
	function View(div, model){
		//sets up the graph to the size of the data array. Includes function extendGraph(data) for updating graph
		var graphSetup = function(){
			var dataArray=model.currentInfo["dataArray"];
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
				 // .scale(xScale*1000)
				  .append("text").attr("x", "77%").attr("dy", -4).text("Liters Titrant");
			
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
				  .attr("d", line)
				  .style("z-index", -1);
				  };
			
			
			//this turns eqPoint into graphable data
			var eqPointData=model.currentInfo["eqPoint"];
			
			var maxXY = model.currentInfo["dataArray"][model.currentInfo["dataArray"].length-1];
			var minXY = model.currentInfo["dataArray"][0];
			
			//this section puts a circle on the graph at the equivalence point
			//it currently is automatically called but could easily be made into a callable function
			// we currently have a slight problem with placement due to discrete drips
			var graphEqPoint = function(){
				$(".circleLabel").remove();
				svg.selectAll("circle").data(eqPointData).enter().append("circle").attr("id", "circle")
				.style("z-index", 10000)
				.attr("cx", function(){
					if (maxXY){
						$(".circleLabel").remove();
						var x =582*((eqPointData[0]-minXY[0])/(maxXY[0]-minXY[0]));
						var circleLabel = $("<div class = circleLabel>Equivalence Point</div>");
						circleLabel.css("left", function(){
											if (x < width - 100){
												return x+40}
											else{
												return x-100
											};
						});
						$(".titration").append(circleLabel);
						return x;
						}
						})
				.attr("cy", function(){
					if(maxXY){
						var y = 352 - 352*((eqPointData[1]-minXY[1])/(maxXY[1]-minXY[1]));
						$(".circleLabel").css("display", function(){
							if (y<0){
							return "none";
							}
						})
						$(".circleLabel").css("top", y-810);
						return y-2;
						}
						})
				.attr("r", 5)
				}();
			
			return{extendGraph:extendGraph};
		};
			
		//updates the graph display after more titrant has been added
		//should be compatible with both drip and undrip
		//this should be called every time there is a change to dataArray
		var graphpH=function(){
			var maxTit=model.currentInfo["maxTit"];
			dataArray=model.currentInfo["dataArray"];
			var dataToGraph = [];
			for(var i=0; i<dataArray.length; i++){
				if(dataArray[i][0]<=maxTit){
					dataToGraph.push(dataArray[i])
				}
				else{
				break;
				}
			};
            if (dataToGraph.length>0){
                Beaker().pHtoColor(dataToGraph[dataToGraph.length-1][1])
            }
			graphSetup(dataArray).extendGraph(dataToGraph);
				
		};
		
		var exports={graphSetup:graphSetup, graphpH:graphpH};

		return exports;
    };
	
	
	//setup is called as soon as the document is ready
	//adds all the HTML elements
	function setup(div){
		//add all the divs required -- beaker, buttons, sliders
		var beakerDiv=$("<div class='beakerDiv'></div>")
		var buttonDiv = $("<div class='buttonDiv'></div>");
		var slideDiv=$("<div class ='slideDiv'></div>");
		var drip = $("<button class='btn btn-primary drip button'><font color='white'>Drip</font></button>");
		var undrip = $("<button class='btn btn-primary undrip button'><font color='white'>Undrip</font></button>");
		var dump = $("<button class='btn btn-primary dump button'><font color='white'>Full Titration</font></button>");
		var clear=$("<button class='btn btn-primary clear button'><font color='white'>Clear</font></button>")
		var sliderDiv = $('<div class="slider" id="pKa" style="width: 350px;"><div class="slabel">pKa</div></div>');
		var sliderDiv2 = $('<div class="slider" id="molesAna" style="width: 350px;"><div class="slabel">Moles Analyte</div></div>');
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
		
		//Model() is located in model.js, which is called in the html
		var model=Model();
		//currentInfo is an array in model containing all of the current relevant information
		//eg currentInfo["molesTit"] would give us the moles of Titrant
		//dataArray is an array of arrays of format [liters titrant added, pH] for graphing
		var dataArray = model.currentInfo["dataArray"];
        var view=View(div, model);
		
		//sets up the beaker div -- Beaker() is located in beaker.js
		var beaker = Beaker();
		beaker.setupBeaker(beakerDiv);
		beaker.setupDropper()

		//graphs all the information in the data array so that the axes are the correct size
		// but doesn't display the path
		view.graphSetup(dataArray);
		
		//giving functionalities to all the sliders
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
		
		//giving functionalities to the buttons
        $(".dropperPic").click(function(){
            dripSize = model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", dripSize);
			model.infoAdd("maxTit", dripSize);
			view.graphpH();
		});
        
		//adds one drop of titrant (amount controlled by dropSize) to the analyte
		$(".drip").click(function(){
			dripSize = model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", dripSize);
			model.infoAdd("maxTit", dripSize);
			view.graphpH();
		});
		
		//removes one drop of titrant from the analyte
		$(".undrip").click(function(){
			dripSize=model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", -dripSize);
			model.infoAdd("maxTit", -dripSize);
			view.graphpH();
		});
		
		//dump puts 200 mL of titrant in the analyte, completing the titration
		$(".dump").click(function(){
			model.buildData();
			var DA = model.currentInfo["dataArray"];
			var DALen = model.currentInfo["dataArray"].length;
			var newMax = DA[DALen-1][0];
			model.infoChange("maxTit", newMax);
			model.infoChange("millilitersTit", newMax);
			view.graphpH();
		});
		
		//removes all titrant from the analyte
		$(".clear").click(function(){
			model.infoChange("maxTit", 0);
			view.graphpH();
		});
	
	//adds functionality to the sliders
	//all sliders call model.buildData upon being changed, which builds a new dataArray
	//all sliders also graph the new data Array, allowing the graph to change dynamically with the user input
	
	//pKa slider alters the pKa, but it alters dataArray's Ka (which is 10^(-pKa)
	//this allows us to put what is essentially a logarithmic function on a linear scale
    $( "#pKa" ).slider({
      range: "min",
      min: -2,
      max: 6,
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
  
	//moles Analyte
	//we assume that there is 1 liter of analyte
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
  
	//concentration of the Titrant in moles/Liter
    $( "#concTitrant" ).slider({
      range: "min",
      min: .01,
      max: 9.99,
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
  
	//size of drips added
	//not only does this alter how much is added per drip, but it also changes the resolution of the graph
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
	
	//bootstrap button the slider handles
	$(".round").addClass("btn btn-primary btn-mini");
  

};
	
	return {setup: setup};
}());

//call setup when the document is ready
$(document).ready(function(){
    $('.titration').each(function(){
        titration.setup($(this));});
});