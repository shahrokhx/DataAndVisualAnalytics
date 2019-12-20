
var w = 900; 
var h = 600;

var margin = {top: 20, right: 90, bottom: 30, left: 50};
var width  = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;


var gradNum = 9;
var step = height / gradNum;

xName = d3.range(1,11);
yName = ["Baratheon", "Greyjoy", "Lannister", "Stark", "Targaryen", "Tyrell"];

//color from colorbrewer
color = ['#f7fcf0','#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081'];



var svg = d3.select("#heatmap")
            .append("svg")
            .attr("class", "svgClass")
            .attr("width", w)
            .attr("height",h)
            .append("g")
            .attr("transform", "translate(" + margin.left + ")");

// X and Y Labels (CLASS: label)
var xLabel = svg.selectAll("xLabel")
                        .data(xName)
                        .enter()
                        .append("text")
                        .attr("class","label")
                        .text(function(d) {return d; })
                        .attr("x", function(d, i) { return i * step; })
                        .attr("y", h-2*step)
                        .style("text-anchor", "middle")
                        .attr("transform", "translate(" + 200+", -5)");

var yLabel = svg.selectAll("yLabel")
                     .data(yName)
                     .enter()
                     .append("text")
                     .attr("class","label")
                     .text(function(d) {return d; })
                     .attr("x", margin.left)
                     .attr("y", function (d, i) { return margin.top + (i-1)*step; })
                     .style("text-anchor", "end")
                     .attr("transform", "translate(100," + step*2.5 + ")");


// House and Episode (CLASS: Category)
svg.append("text")  
		   	.attr("x", w/2+40)
		   	.attr("y", h - 3* margin.bottom)
		   	.attr("text-anchor", "middle") 
		   	.attr("class","category") 
		   	.text("Episode");

svg.append("text")  
		   	.attr("x", -h/2+40)
		   	.attr("y",  0)
		   	.attr("transform", "rotate(-90)")
		   	.attr("text-anchor", "middle")  
		   	.attr("class","category") 
		   	.text("House");                    


// Reading CSV File AND Select Box
d3.csv("heatmap.csv", function(d) {
            return { Baratheon:     +d.Baratheon,
                     Greyjoy:       +d.Greyjoy,
                     Lannister:     +d.Lannister,
                     Stark:         +d.Stark,
                     Targaryen:     +d.Targaryen,
                     Tyrell:        +d.Tyrell,
                     episode:       +d.episode,
                     season:        +d.season,};
                    },
        function(error, rows) {
            var default_select = 1;
            heatmap(rows, default_select);

            var seasonList = []
            for (var i=1; i<7; i++){
            	seasonList.push("Season "+i);
            }
            
            var select = d3.select("#seasons")
                           .append("select")
                           .attr("class", "select")
                           .on("change", update);

            var option = select.selectAll("option")
                                .data(seasonList)
                                .enter()
                                .append("option")
                                .text(function (d) {return d; });

            function update() {
                value = d3.select("select").property("value");
                heatmap(rows, +value.substr(7,7));
            };
        }
    );


// Heatmap Function
var heatmap = function(data, season) {
	//console.log(data.length);
	var data = data.filter(function(d) {return d.season == season;}),

	seasonData = [];
    for (var i = 0; i < data.length; i++) {
        seasonData.push([data[i].Baratheon , data[i].episode, 1]);
        seasonData.push([data[i].Greyjoy   , data[i].episode, 2]);
        seasonData.push([data[i].Lannister , data[i].episode, 3]);
        seasonData.push([data[i].Stark     , data[i].episode, 4]);
        seasonData.push([data[i].Targaryen , data[i].episode, 5]);
        seasonData.push([data[i].Tyrell    , data[i].episode, 6]);
    }
    // console.log(seasonData);
    var maxAppear = d3.max(seasonData, function (d) {return d[0];})
    console.log("Max Apprea in Season: "+season+"  -->  "+maxAppear)
    var colorScale = d3.scale.quantile()
                             .domain([0, gradNum-1, maxAppear])
              				 .range(color);
              				 
	var box = svg.selectAll("box").data(seasonData);
	box.enter().append("rect")
               .attr("class", "border")
               .attr("x", function(d) { return 100+(d[1]) * step; })
               .attr("y", function(d) { return margin.top + (d[2]) * step; })
               .attr("rx", 5)
               .attr("ry", 5)
               .attr("width", step)
               .attr("height",step)
               .style("fill", color[0])
               .append("title")
               .text(function(d) {return d[0]; });

    box.transition().duration(400)
                    .style("fill", function(d) { return colorScale(d[0]); });

    box.exit().remove();  

    // Legend
	var legend = svg.selectAll("legend")
                    .data([0].concat(colorScale.quantiles()),
                     function(d) { return d; });

    legend.enter()
          .append("g")
          .attr("class", "legend");

    legend.append("rect")
          .attr("x", function(d, i) { return 150+(i+1) * step; })
          .attr("y", h-margin.bottom-20)
          .attr("width", step)
          .attr("height", step/2)
          .style("fill", function(d, i) { return color[i]; });

    legend.append("text")
          .attr("class", "legend")
          .text(function(d) { return Math.round(d); })
          .attr("x", function(d, i) { return 150+step * (i+1); })
          .attr("y", h );

    legend.append("text")
          .attr("class", "legend")
          .text("Number of appearances")
          .attr("x", 150+step)
          .attr("y", h - step);

    legend.exit().remove();

     
}










