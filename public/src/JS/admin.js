/*jshint esversion: 6*/

/*
  MASONRY
*/

$(window).on("load", function(){
  $('#browse').masonry({
    itemSelector: '.item',
    columnWidth: 250,
    gutter: 20,
    horizontalOrder: true,
    fitWidth: true,
    transitionDuration: '0.2s'
  });
  $("#browse").css("visibility", "visible");
});

/*
  PIE CHART
*/

var data = [
  {name: "Completed", value: $("#pie").data("completed"), color: "#188977", hover: "#0c7362"},
  {name: "Verified", value: $("#pie").data("verified"), color: "#39A96B", hover: "#299559"},
  {name: "Transcribed", value: $("#pie").data("transcribed"), color: "#BFE1B0", hover: "#a7c998"},
  {name: "Raw", value: $("#pie").data("raw"), color: "#f4f4f4", hover: "#ebebeb"},
];
var text = "";

var width = 260;
var height = 260;
var thickness = 40;
var duration = 750;

var radius = Math.min(width, height) / 2;

var svg = d3.select("#pie")
  .append('svg')
    .attr('class', 'pie')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g')
  .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

var arc = d3.arc()
  .innerRadius(radius - thickness)
  .outerRadius(radius);

var pie = d3.pie()
  .value(function(d) { return d.value; })
  .sort(null);

var path = g.selectAll('path')
  .data(pie(data))
  .enter()
  .append("g")
  .on("mouseover", function(d) {
      let g = d3.select(this)
        .style("cursor", "pointer")
        .style("fill", "white")
        .append("g")
        .attr("class", "text-group");

      g.append("text")
        .attr("class", "value-text")
        .text(`${d.data.value}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '0em');

      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.name}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '1.5em');
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .style("fill", d.data.color)
        .select(".text-group").remove();
    })
  .append('path')
  .attr('d', arc)
  .attr('fill', (d,i) => d.data.color)
  .on("mouseover", function(d) {
      d3.select(this)
        .style("cursor", "pointer")
        .style("fill", d.data.hover);
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .style("fill", d.color);
    })
  .each(function(d, i) { this._current = i; });


g.append('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .text(text);
