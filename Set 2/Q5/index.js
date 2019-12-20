/*
Note: The main part of code is based on the suggested example
(https://bl.ocks.org/mbostock/4339083); however, I understood it and got the main ideas, 
then I used it as the skeleton and have written my own code;
in particular, the sections (b) and (c) and the recursive function to
finde the ancestors.

*/

// Canvas:
var w = 1000;
var h = 800;

var margin = {top: 20, right: 100, bottom: 20, left: 100};
var width  = w - margin.right - margin.left;
var height = h - margin.top - margin.bottom;

var i = 0; 
var duration = 500;

var tree = d3.layout.tree().size([height, width]);
var diagonal = d3.svg.diagonal().projection(function(d) {return [d.y, d.x];});


var svg = d3.select("#tree")
            .append("svg")
            .attr("width" ,w)
            .attr("height",h)
            .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");


var root;

// Reading json file:
d3.json("sushi.json", function(error, sushi) {
  if (error) throw error;

  root = sushi;
  root.x0 = height/2;
  root.y0 = 0;

  
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  root.children.forEach(collapse);
  update(root);
});

d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
   nodes = tree.nodes(root).reverse();
   links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 150; });

  // Update the nodes
  var node = svg.selectAll("g.node").data(nodes, function(d) {
                        return d.id || (d.id = ++i); 
                      });


  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {return "translate("+source.y0+","+source.x0+")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
   
  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) {
        return d.id; 
      })
      .style("font-size",function(d){             // Changing with respect to depth
        return 30/(Math.sqrt(+d.depth)+1)+"px";
      })
      .style("fill-opacity", 1e-6)
      .on("mouseover", function(d){               // Changing the text color to blue
          d3.select(this).style("fill","blue");
          ancestors(d);                           // Changing the color of the ancestors 

          //local recursive function to find ancestors
          function ancestors (p){
            console.log("parent: "+p.id)
            if (p.parent){
              d3.selectAll("g.node").filter(function(k){
                if (k.id==p.parent.id){
                  return k;
                }
              }).style("fill","blue");

              // This one is another way:

              // d3.selectAll("g.node").each(function(k){    
              //   // console.log(k.id)
              //   if (k.id==p.parent.id){
              //     d3.select(this).style("fill","blue");
              //   }
              // })
              a = ancestors (p.parent);
            }
            return p.parent;
          }
        
      })
      .on("mouseout", function(d){                     // Resetting labels
          d3.select(this).style("fill","black");
          ancestors(d);

          //local recursive function to find ancestors
          function ancestors (p){
            console.log("parent: "+p.id)
            if (p.parent){
              d3.selectAll("g.node").filter(function(k){
                if (k.id==p.parent.id){
                  return k;
                }
              }).style("fill","black");
              a = ancestors (p.parent);
            }
            return p.parent;
          }
      });



  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });


  nodeUpdate.select("circle")    // Just in case of changing the node sizes
      .attr("r", function(d){ 
        // return rScale(d.depth);
        // 20/(Math.sqrt(d.depth)+1)
        return 5;
      })
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parents new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parents previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parents new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  //console.log("Click on"+ d.id)
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}