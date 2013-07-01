var titration=(function(){
	

	
	function Controller(model){
	
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
						$(".circleLabel").css("top", y-322);
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