var titration=(function(){
	

	
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
            Beaker().pHtoColor(dataToGraph[dataToGraph.length-1][1])
			graphSetup(dataArray).extendGraph(dataToGraph);
				
		};
		
		var exports={graphSetup:graphSetup, graphpH:graphpH};

		return exports;
    };
	
	function setup(div){
		var beakerDiv=$("<div class='beakerDiv'></div>")
		var buttonDiv = $("<div class='buttonDiv'></div>");
		var slideDiv=$("<div class ='slideDiv'></div>");
		var drip = $("<button class='btn btn-primary drip button'><font color='white'>Drip</font></button>");
		var undrip = $("<button class='btn btn-primary undrip button'><font color='white'>Undrip</font></button>");
		var dump = $("<button class='btn btn-primary dump button'><font color='white'>Full Titration</font></button>");
		var clear=$("<button class='btn btn-primary clear button'><font color='white'>Clear</font></button>")
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
        
        $(".dropperPic").click(function(){
            dripSize = model.currentInfo["dripSize"];
			model.infoAdd("millilitersTit", dripSize);
			model.infoAdd("maxTit", dripSize);
			view.graphpH();
		});
        
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
	
	$(".round").addClass("btn btn-primary btn-mini");
  

};
	
	return {setup: setup};
}());

$(document).ready(function(){
    $('.titration').each(function(){
        titration.setup($(this));});
});