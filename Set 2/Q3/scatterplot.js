// canvas 800x600:
var w = 1000; 
var h = 800;
var padding = 100;
//------------------------------------------------------------------------------------------
// I would rather to separate these functions in different js files; however, due to the deliverable 
// instructions, I gathered them in one file with 5 functions:
fig1();
fig2();
fig3();
fig4();
fig5();
//------------------------------------------------------------------------------------------
function fig1(){
  // csv read
  data = [];

  d3.csv("wine_quality.csv",function(d){
              return {
          	    residual_sugar: +d.residual_sugar,
                  chlorides: +d.chlorides,
                  free_sulfur_dioxide: +d.free_sulfur_dioxide,
                  total_sulfur_dioxide: +d.total_sulfur_dioxide,
                  Density: +d.Density,
                  pH: +d.pH,
                  sulphates: +d.sulphates,
                  alcohol: +d.alcohol,
                  quality: +d.quality
              };
          },function(error, rows){
          	for (i in rows){

                  data.push([rows[i].alcohol,rows[i].pH,rows[i].quality]);                
              }

              // dispSize("data",data);
              // printMat(data);

              var xScale = d3.scale.linear()
                                   .domain([0, d3.max(data, function(d){ return d[0]; })])
                                   .range([padding, w - padding * 2]);

              var yScale = d3.scale.linear()
                                   .domain([0, d3.max(data, function(d){ return d[1]; })])
                                   .range([h - padding, padding]);

              var svg = d3.select("#fig1")
                          .append("svg")
                          .attr("width",  w)
                          .attr("height", h);

              
              // symbols
          	var arc = d3.svg.symbol().type(function(d,i){
                                  if (data[i][2] < 6)
                                    	return "circle";
                                  else
                                     	return "cross";
                                 	})
                               	.size(function(d){return 100; }); //size(d[0])


              svg.selectAll("path")
                 .data(data)
                 .enter()
                 .append("path")
                 .attr("d",arc)
                 .attr("fill","white")
                 .attr("stroke",function(d,i){
                                  // console.log(i+"---> "+data[i][3]);
                                  if (data[i][2] < 6)
                                      return "red";
                                  else 
                                      return "blue";
                 })
                 .attr("stroke-width",1)
                 .attr("transform",function(d,i){ 
                              //console.log(i+"   "+d[0]+" - "+d[1]);
                              //console.log("translate("+xScale(d[0])+","+yScale(d[1])+")");
                              return "translate("+xScale(d[0])+","+yScale(d[1])+")"; });

              
              var leg_cross  = d3.svg.symbol().type("cross").size(100);
              var leg_circle = d3.svg.symbol().type("circle").size(100);

              svg.append("path")
                 .attr("d",leg_cross)
                 .attr("fill","white")
                 .attr("stroke","blue")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding-5)+")");

              svg.append("path")
                 .attr("d",leg_circle)
                 .attr("fill","white")
                 .attr("stroke","red")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding+15)+")");   

                 //Define X axis
              var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom")
                                .ticks(10);

              //Define Y axis
              var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left")
                                .ticks(10);

            	//Create X axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + (h - padding) + ")")
                  .call(xAxis);

               //Create Y axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + padding + ",0)")
                  .call(yAxis);

              svg.append("text")  
               	.attr("x", w/2)
               	.attr("y", h - padding/2)
               	.attr("text-anchor", "middle")  
               	.style("font-size", "20px") 
               	.text("Alcohol (% by volume)");

          	svg.append("text")  
               	.attr("x", -h/2)
               	.attr("y",  padding /2)
               	.attr("transform", "rotate(-90)")
               	.attr("text-anchor", "middle")  
               	.style("font-size", "20px") 
               	.text("pH");

           	// title
              svg.append("text")  
               	.attr("x", w/2)
               	.attr("y", padding/2)
               	.attr("text-anchor", "middle")  
               	.style("font-size", "30px") 
               	.text("pH vs. Alcohol"); 	

           	// Legend
              svg.append("text")  
               	.attr("x", w-padding/2)
               	.attr("y",   padding)
               	.attr("text-anchor", "left")  
               	.style("font-size", "15px") 
               	.text("Good");

              svg.append("text")  
               	.attr("x", w-padding/2)
               	.attr("y",   padding+20)
               	.attr("text-anchor", "left")  
               	.style("font-size", "15px") 
               	.text("Bad"); 	
       		
       		// Legend Symbol:

  		});
}
//------------------------------------------------------------------------------------------
function fig2(){
  // csv read
  data = [];

  d3.csv("wine_quality.csv",function(d){
              return {
                  residual_sugar: +d.residual_sugar,
                  chlorides: +d.chlorides,
                  free_sulfur_dioxide: +d.free_sulfur_dioxide,
                  total_sulfur_dioxide: +d.total_sulfur_dioxide,
                  Density: +d.Density,
                  pH: +d.pH,
                  sulphates: +d.sulphates,
                  alcohol: +d.alcohol,
                  quality: +d.quality
              };
          },function(error, rows){
            for (i in rows){

                  data.push([rows[i].residual_sugar,rows[i].pH,rows[i].quality]);                
              }

              // dispSize("data",data);
              // printMat(data);

              var xScale = d3.scale.linear()
                                   .domain([0, d3.max(data, function(d){ return d[0]; })])
                                   .range([padding, w - padding * 2]);

              var yScale = d3.scale.linear()
                                   .domain([0, d3.max(data, function(d){ return d[1]; })])
                                   .range([h - padding, padding]);

              var svg = d3.select("#fig2")
                          .append("svg")
                          .attr("width",  w)
                          .attr("height", h);

              
              // symbols
            var arc = d3.svg.symbol().type(function(d,i){
                                  if (data[i][2] < 6)
                                      return "circle";
                                  else
                                      return "cross";
                                  })
                                .size(function(d){return 100; }); //size(d[0])


              svg.selectAll("path")
                 .data(data)
                 .enter()
                 .append("path")
                 .attr("d",arc)
                 .attr("fill","white")
                 .attr("stroke",function(d,i){
                                  // console.log(i+"---> "+data[i][3]);
                                  if (data[i][2] < 6)
                                      return "red";
                                  else 
                                      return "blue";
                 })
                 .attr("stroke-width",1)
                 .attr("transform",function(d,i){ 
                              //console.log(i+"   "+d[0]+" - "+d[1]);
                              //console.log("translate("+xScale(d[0])+","+yScale(d[1])+")");
                              return "translate("+xScale(d[0])+","+yScale(d[1])+")"; });

              
              var leg_cross  = d3.svg.symbol().type("cross").size(100);
              var leg_circle = d3.svg.symbol().type("circle").size(100);

              svg.append("path")
                 .attr("d",leg_cross)
                 .attr("fill","white")
                 .attr("stroke","blue")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding-5)+")");

              svg.append("path")
                 .attr("d",leg_circle)
                 .attr("fill","white")
                 .attr("stroke","red")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding+15)+")");   

                 //Define X axis
              var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom")
                                .ticks(10);

              //Define Y axis
              var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left")
                                .ticks(10);

              //Create X axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + (h - padding) + ")")
                  .call(xAxis);

               //Create Y axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + padding + ",0)")
                  .call(yAxis);

              svg.append("text")  
                .attr("x", w/2)
                .attr("y", h - padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("Residual Sugar (g/cm³)");

            svg.append("text")  
                .attr("x", -h/2)
                .attr("y",  padding /2)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("pH");

            // title
              svg.append("text")  
                .attr("x", w/2)
                .attr("y", padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .text("pH vs. Residual Sugar");   

            // Legend
              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Good");

              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding+20)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Bad");   
          
          // Legend Symbol:

      });
}
//------------------------------------------------------------------------------------------
function fig3(){
  // csv read
  data = [];

  d3.csv("wine_quality.csv",function(d){
              return {
                residual_sugar: +d.residual_sugar,
                  chlorides: +d.chlorides,
                  free_sulfur_dioxide: +d.free_sulfur_dioxide,
                  total_sulfur_dioxide: +d.total_sulfur_dioxide,
                  Density: +d.Density,
                  pH: +d.pH,
                  sulphates: +d.sulphates,
                  alcohol: +d.alcohol,
                  quality: +d.quality
              };
          },function(error, rows){
            for (i in rows){

                  data.push([rows[i].alcohol,rows[i].pH,rows[i].quality]);                
              }

              // dispSize("data",data);
              // printMat(data);

              var xScale = d3.scale.linear()
                                   .domain([0, d3.max(data, function(d){ return d[0]; })])
                                   .range([padding, w - padding * 2]);

              var yScale = d3.scale.linear()
                                   .domain([0, d3.max(data, function(d){ return d[1]; })])
                                   .range([h - padding, padding]);

              //finding the minimum and maximum of data:
              var xMin = d3.min(data, function(d){return d[0]});
              var yMin = d3.min(data, function(d){return d[1]});
              var xMax = d3.max(data, function(d){return d[0]});
              var yMax = d3.max(data, function(d){return d[1]});
              var minProduct = xMin*yMin;
              var maxProduct = xMax*yMax;
              //inverse scale:
              var invScale = d3.scale.linear()
                                     .domain([maxProduct,minProduct])
                                     .range([20,150]);

              var svg = d3.select("#fig3")
                          .append("svg")
                          .attr("width",  w)
                          .attr("height", h);

              
              // symbols
              var arc = d3.svg.symbol().type(function(d,i){
                                  if (data[i][2] < 6)
                                      return "circle";
                                  else
                                      return "cross";
                                  })
                                .size(function(d){return invScale(d[0]*d[1]); }); 


              svg.selectAll("path")
                 .data(data)
                 .enter()
                 .append("path")
                 .attr("d",arc)
                 .attr("fill","white")
                 .attr("stroke",function(d,i){
                                  // console.log(i+"---> "+data[i][3]);
                                  if (data[i][2] < 6)
                                      return "red";
                                  else 
                                      return "blue";
                 })
                 .attr("stroke-width",1)
                 .attr("transform",function(d,i){ 
                              //console.log(i+"   "+d[0]+" - "+d[1]);
                              //console.log("translate("+xScale(d[0])+","+yScale(d[1])+")");
                              return "translate("+xScale(d[0])+","+yScale(d[1])+")"; });

              
              var leg_cross  = d3.svg.symbol().type("cross").size(100);
              var leg_circle = d3.svg.symbol().type("circle").size(100);

              svg.append("path")
                 .attr("d",leg_cross)
                 .attr("fill","white")
                 .attr("stroke","blue")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding-5)+")");

              svg.append("path")
                 .attr("d",leg_circle)
                 .attr("fill","white")
                 .attr("stroke","red")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding+15)+")");   

                 //Define X axis
              var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom")
                                .ticks(10);

              //Define Y axis
              var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left")
                                .ticks(10);

              //Create X axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + (h - padding) + ")")
                  .call(xAxis);

               //Create Y axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + padding + ",0)")
                  .call(yAxis);

              svg.append("text")  
                .attr("x", w/2)
                .attr("y", h - padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("Alcohol (% by volume)");

            svg.append("text")  
                .attr("x", -h/2)
                .attr("y",  padding /2)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("pH");

            // title
              svg.append("text")  
                .attr("x", w/2)
                .attr("y", padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .text("pH vs. Alcohol (scaled symbols)");   

            // Legend
              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Good");

              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding+20)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Bad");   
          
          // Legend Symbol:

      });
}
//------------------------------------------------------------------------------------------
function fig4(){
  // csv read
  data = [];

  d3.csv("wine_quality.csv",function(d){
              return {
                residual_sugar: +d.residual_sugar,
                  chlorides: +d.chlorides,
                  free_sulfur_dioxide: +d.free_sulfur_dioxide,
                  total_sulfur_dioxide: +d.total_sulfur_dioxide,
                  Density: +d.Density,
                  pH: +d.pH,
                  sulphates: +d.sulphates,
                  alcohol: +d.alcohol,
                  quality: +d.quality
              };
          },function(error, rows){
            for (i in rows){

                  data.push([rows[i].pH,rows[i].sulphates]);                
              }

              // dispSize("data",data);
              // printMat(data);
              var xMin = d3.min(data, function(d){return d[0]});
              var yMin = d3.min(data, function(d){return d[1]});
              var xMax = d3.max(data, function(d){return d[0]});
              var yMax = d3.max(data, function(d){return d[1]});

              var xScale = d3.scale.linear()
                                   .domain([0, d3.max(data, function(d){ return d[0]; })])
                                   .range([padding, w - padding * 2]);

              var yScale = d3.scale.sqrt()
                                   .domain([0, d3.max(data, function(d){ return d[1]; })])
                                   .range([h - padding, padding]);

              var svg = d3.select("#fig4")
                          .append("svg")
                          .attr("width",  w)
                          .attr("height", h);

              
              // symbols
            var arc = d3.svg.symbol().type(function(d,i){
                                  if (data[i][2] < 6)
                                      return "circle";
                                  else
                                      return "cross";
                                  })
                                .size(function(d){return 100; }); //size(d[0])


              svg.selectAll("path")
                 .data(data)
                 .enter()
                 .append("path")
                 .attr("d",arc)
                 .attr("fill","white")
                 .attr("stroke",function(d,i){
                                  // console.log(i+"---> "+data[i][3]);
                                  if (data[i][2] < 6)
                                      return "red";
                                  else 
                                      return "blue";
                 })
                 .attr("stroke-width",1)
                 .attr("transform",function(d,i){ 
                              //console.log(i+"   "+d[0]+" - "+d[1]);
                              //console.log("translate("+xScale(d[0])+","+yScale(d[1])+")");
                              return "translate("+xScale(d[0])+","+yScale(d[1])+")"; });

              // legend
              var leg_cross  = d3.svg.symbol().type("cross").size(100);
              var leg_circle = d3.svg.symbol().type("circle").size(100);

              svg.append("path")
                 .attr("d",leg_cross)
                 .attr("fill","white")
                 .attr("stroke","blue")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding-5)+")");

              svg.append("path")
                 .attr("d",leg_circle)
                 .attr("fill","white")
                 .attr("stroke","red")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding+15)+")");   

              //Define X axis
              var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom");
                                // .ticks(10);

              //Define Y axis
              var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left");
                                // .ticks(10);

              //Create X axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + (h - padding) + ")")
                  .call(xAxis);

               //Create Y axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + padding + ",0)")
                  .call(yAxis);

              svg.append("text")  
                .attr("x", w/2)
                .attr("y", h - padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("pH");

              svg.append("text")  
                .attr("x", -h/2)
                .attr("y",  padding /2)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("Sulphates (g/cm³)");

            // title
              svg.append("text")  
                .attr("x", w/2)
                .attr("y", padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .text("Sulphates vs. pH (squared-root-scaled)");  

            // Legend
              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Good");

              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding+20)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Bad");   
          
          // Legend Symbol:

      });
}
//------------------------------------------------------------------------------------------
function fig5(){
  // csv read
  data = [];

  d3.csv("wine_quality.csv",function(d){
              return {
                residual_sugar: +d.residual_sugar,
                  chlorides: +d.chlorides,
                  free_sulfur_dioxide: +d.free_sulfur_dioxide,
                  total_sulfur_dioxide: +d.total_sulfur_dioxide,
                  Density: +d.Density,
                  pH: +d.pH,
                  sulphates: +d.sulphates,
                  alcohol: +d.alcohol,
                  quality: +d.quality
              };
          },function(error, rows){
            for (i in rows){

                  data.push([rows[i].pH,rows[i].sulphates]);                
              }

              // dispSize("data",data);
              // printMat(data);
              var xMin = d3.min(data, function(d){return d[0]});
              var yMin = d3.min(data, function(d){return d[1]});
              var xMax = d3.max(data, function(d){return d[0]});
              var yMax = d3.max(data, function(d){return d[1]});

              var xScale = d3.scale.linear()
                                   .domain([xMin, xMax])
                                   .range([padding, w - padding * 2]);

              var yScale = d3.scale.log()
                                   .domain([yMin, yMax])
                                   .range([h - padding, padding]);

              var svg = d3.select("#fig5")
                          .append("svg")
                          .attr("width",  w)
                          .attr("height", h);

              
              // symbols
            var arc = d3.svg.symbol().type(function(d,i){
                                  if (data[i][2] < 6)
                                      return "circle";
                                  else
                                      return "cross";
                                  })
                                .size(function(d){return 100; }); //size(d[0])


              svg.selectAll("path")
                 .data(data)
                 .enter()
                 .append("path")
                 .attr("d",arc)
                 .attr("fill","white")
                 .attr("stroke",function(d,i){
                                  // console.log(i+"---> "+data[i][3]);
                                  if (data[i][2] < 6)
                                      return "red";
                                  else 
                                      return "blue";
                 })
                 .attr("stroke-width",1)
                 .attr("transform",function(d,i){ 
                              //console.log(i+"   "+d[0]+" - "+d[1]);
                              //console.log("translate("+xScale(d[0])+","+yScale(d[1])+")");
                              return "translate("+xScale(d[0])+","+yScale(d[1])+")"; });

              // legend
              var leg_cross  = d3.svg.symbol().type("cross").size(100);
              var leg_circle = d3.svg.symbol().type("circle").size(100);

              svg.append("path")
                 .attr("d",leg_cross)
                 .attr("fill","white")
                 .attr("stroke","blue")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding-5)+")");

              svg.append("path")
                 .attr("d",leg_circle)
                 .attr("fill","white")
                 .attr("stroke","red")
                 .attr("stroke-width",1)
                 .attr("transform","translate("+(w-padding/2-15)+","+(padding+15)+")");   

              //Define X axis
              var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom");
                                // .ticks(10);

              //Define Y axis
              var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left");
                                // .ticks(10);

              //Create X axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + (h - padding) + ")")
                  .call(xAxis);

               //Create Y axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + padding + ",0)")
                  .call(yAxis);

              svg.append("text")  
                .attr("x", w/2)
                .attr("y", h - padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("pH");

              svg.append("text")  
                .attr("x", -h/2)
                .attr("y",  padding /2)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "middle")  
                .style("font-size", "20px") 
                .text("Sulphates (g/cm³)");

            // title
              svg.append("text")  
                .attr("x", w/2)
                .attr("y", padding/2)
                .attr("text-anchor", "middle")  
                .style("font-size", "30px") 
                .text("Sulphates vs. pH (log-scaled)");   

            // Legend
              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Good");

              svg.append("text")  
                .attr("x", w-padding/2)
                .attr("y",   padding+20)
                .attr("text-anchor", "left")  
                .style("font-size", "15px") 
                .text("Bad");   
          
          // Legend Symbol:

      });
}
//------------------------------------------------------------------------------------------
// helper function (s) (Used during developing and debugging)
function dispSize(name, array){
    console.log(name+" size = ("+array.length+","+array[0].length+")");
}
function printMat(matrix){
	for (var i = 0; i < matrix.length; i++){
		console.log(i+"  ->  "+matrix[i][0]+"  "+matrix[i][1]+"  "+matrix[i][2]);
	}
}
//------------------------------------------------------------------------------------------