
w = 1100
h = 600


var margin = {top: 100, right: 40, bottom: 20, left: 20};
var width  = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;


var path = d3.geo.path();

// color ranges from: (http://colorbrewer2.org/):
//colors = ['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#8c2d04'];   
colors = ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17','#666666'];         


var svg = d3.select("#map")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

d3.queue()
  .defer(d3.json, "world_countries.json")
  .defer(d3.tsv,  "world_population.tsv")
  .defer(d3.tsv,  "literacy_rate.tsv")
  .await(ready);

function ready(error, worldmap, population, literacy) {
    if (error) throw error;
    
    mp = worldmap;
    pop = population;
    
    nStep = colors.length;

    minPopulation = d3.min(population, function(d){return +d.population;})
    maxPopulation = d3.max(population, function(d){return +d.population;})
    rangeStep = (maxPopulation - minPopulation)/(nStep-1);
    
    populationRange=d3.range(minPopulation,maxPopulation,rangeStep);
    // populationRange=d3.range(1,maxPopulation,rangeStep);
    populationRange.push(maxPopulation+1);
    //populationRange.forEach(function(d){d=Math.log(d);})
    //console.log(populationRange);
    var colorScale  = d3.scale.threshold()
            		.domain(populationRange)
            		.range(colors);

   	var tip = d3.tip()
                .attr('class', 'd3tooltip')
                .offset([0, 0])
                .html(function(d) {
                  	var tipText="";
	                for (var i=0; i<literacy.length; i++){
	                    if (d.id == literacy[i].id){
	                    	id_literacy = i;
	                    	break;
                    	}
                    }
                    for (var i=0; i<population.length; i++){
	                    if (d.id == population[i].id){
	                    	id_population = i;
	                    	break;
                    	}
                    }
                    //console.log(d.id);
                    tipText += "Country:       "+literacy[id_literacy].Country+"<br />";
                    tipText += "Population:    "+population[id_population].population+"<br />";
                    tipText += "Literacy Rate: "+literacy[id_literacy].Rate+"<br />";
                    return tipText; 
                });

    svg.call(tip);

	//projection types: cylindricalStereographic / mercator / equirectangular /
    var projection = d3.geo.mercator().scale([160]);

    //Define path generator
    var path = d3.geo.path().projection(projection);
  	
  	svg.selectAll("path")
       .data(mp.features)
       .enter()
       .append("path")
       .attr("d", path)
       .style("fill", function(d){
       		//console.log(d.id);
       		if (d.id==-99) return colors[0]; //handling Null ids 
                for (var i=0; i<population.length; i++){
                    if (d.id == population[i].id){
                        idPopulation = +population[i].population;
                        //console.log(d.id+": "+idPopulation+" c= "+colorScale(idPopulation));
                        return colorScale(idPopulation);                        
                    }
                }
       	})
       	.attr("transform", "translate(20,80)")
       	.on("mouseover", tip.show)
        .on("mouseout",  tip.hide);	               


    // Legend
    var x = 40, y = x/3;
    var formatter = d3.format(".2s");
    legend = svg.selectAll(".legend")
                    .data(populationRange)
                    .enter()
                    .append("g")
                    .attr("class", "legend");

    legend.append("rect")
          .attr("x", function(d, i) { return 600 + i*x;})
          .attr("y", 550)
          .attr("width", x)
          .attr("height", y)
          .style("fill", function(d,i) { return colors[i]; })

    legend.append("text")
          .attr("x", function(d, i) { return 600 + i*x;})
          .attr("y", 545)
          .text(function(d, i) { return formatter(populationRange[i]); })
          .attr("class","legend");

}

         
          







