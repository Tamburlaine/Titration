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
		maxTit = maxTit/1000.0;
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

