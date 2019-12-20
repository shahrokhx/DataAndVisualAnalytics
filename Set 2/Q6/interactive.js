//--------------------- Canvas ---------------------//
w = 900
h = 600
var margin = {top: 100, right: 200, bottom: 50, left: 200};
var width  = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

//----------------- Reading Data ------------------//
var data = [{franchise:'Harry Potter', revenue: {1:974, 2:878, 3:796, 4:896, 5:942, 6:935, 7:960, 8:1341 }},
            {franchise:'Transformers', revenue: {1:708, 2:836, 3:1123, 4:1104, 5:603 }},
            {franchise:'Mission Impossible', revenue: {1:457, 2:549, 3:397, 4:694, 5:700 }},
            {franchise:'Fast and the Furious', revenue: {1:206, 2:236, 3:363, 4:363, 5:629, 6:789, 7:1516, 8:1237 }},
            {franchise:'Hunger Games', revenue: {1:677, 2:864, 3:766, 4:650 }},
            {franchise:'Pirates of the Caribbean', revenue: {1:634, 2:1066, 3:963, 4:1045, 5:794 }}];

var overall=[];
var movieNames = [];
for (var i = 0; i < data.length; i++){ 
        var movie = data[i].franchise;
        movieNames.push(movie);
        var movieRev = dataOraganizer (data,movie);
        overall.push([movie,movieRev,d3.sum(movieRev)]);
};

//--------------- Bar Chart Settings --------------//

var bar = height / (1.5*overall.length);
var gap = bar/2;

var maxSum = d3.max(overall, function(d) {return d[2];});
var linScale = d3.scale.linear()
                 .domain([0, maxSum])
                 .range([0, width]);

//------------------ SVG Layout ------------------// 
var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip().attr("class", "tooltip");
svg.call(tip);

//---------------- bar chart -------------------//
var barChart = svg.selectAll("barChart")
	              .data(overall)
	              .enter()
	              .append("rect")
	              .attr("class", "bar")
	              .attr("x", 0)
	              .attr("y", function(d,i) {return margin.top +(i-3/2)*bar + i*gap;})
	              .attr("height", bar)
	              .attr("width", function(d) {return linScale(d[2]); })
	              .attr("transform", "translate(10," + -5 + ")")
	              .on("mouseover", function(d) {
              			//console.log("MouseOver!");
	              		tip.show() 
	                   	   .attr("position", "absolute")
	                   	   .style("top", "20px")
	                   	   .style("left","800px");
	                    var xValues = d3.range(1, d[1].length+1);
	                    var yValues = d[1];
                        linechart(xValues, yValues);
	                })
                  .on("mouseout", tip.hide);

//------------------- Labels --------------------//
var yLabel = svg.selectAll("label")
                .data(overall)
                .enter()
                .append("text")
                .attr("class","ylabel")
                .text(function (d) {return d[0]; })
                .attr("x", 0)
                .attr("y", function (d, i) {return margin.top + (i-1)*bar+i*gap; })
                .style("text-anchor", "end");

var xLabel = svg.selectAll(".valueLabel")
                .data(overall)
                .enter()
                .append("text")
                .attr("class","xlabel")
                .text(function (d) { return "$" + d[2]; })
                .attr("x", 20)
                .attr("y", function (d, i) {
                                return margin.top + (i-1) *bar + i*gap; })
                .style("text-anchor", "begin");

//------------------ Line Chart -----------------//
var linechart = function(xx,yy) {
		//console.log(xx);
		//console.log(yy);
        var plot = [];
        for (var i = 0; i < xx.length; i++) {
            plot.push([xx[i], yy[i]]);
        };

        var width = 350, height = 250, padding = 50;

        var xScale = d3.scale.linear()
                             .domain([d3.min(xx), d3.max(xx)])
                             .range([padding, width - padding]);
        var yScale = d3.scale.linear()
                             .domain([d3.min(yy), d3.max(yy)])
                             .range([height - padding, padding]);

        var lineFunc = d3.svg.line()
                     .x(function(d) { return xScale(d[0]); })
                     .y(function(d) { return yScale(d[1]); });

        var svg = d3.select(".tooltip")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

        svg.append("path")
            .attr("class", "line")
            .attr("d", lineFunc(plot));

        var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .tickFormat(d3.format("d"));

        var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .tickFormat(d3.format("d"))
                      .ticks(4);

        svg.append("g")
             .attr("transform", "translate(0," + (height-padding) + ")")
             .call(xAxis);
     	svg.append("g")
             .attr("transform", "translate(" + padding + ",0)")
             .call(yAxis);

        svg.append("text")
             .attr("x", (width + padding)/2)
             .attr("y", height)
             .attr("text-anchor", "middle")  
             .style("font-size", "16px") 
             .text("Movie");
        svg.append("text")
             .attr("x", padding * 1.2)
             .attr("y", padding / 2)
             .attr("text-anchor", "middle")  
             .style("font-size", "16px") 
             .text("Revenue");
        };
//------------------------------------------------------//

// Helper Function(s)
function dataOraganizer (data,key){
	row = data.filter(function(d){return d.franchise==key});
	row = row[0];
	for (n in row.revenue){
    }
    n=+n;
    var movieRev=[];
    for (var iter=1; iter<=n; iter++){
    	movieRev.push(row.revenue[iter]);
    }
    return movieRev;
}