/*jshint esversion: 6*/

var data = [
  {name: "Completed", value: $("#pie").data("completed"), color: "#1f3a93"},
  {name: "Verified", value: $("#pie").data("verified"), color: "#446cb3"},
  {name: "Transcribed", value: $("#pie").data("transcribed"), color: "#89c4f4"},
  {name: "Raw", value: $("#pie").data("raw"), color: "#e4f1fe"},
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
        .style("fill", "black")
        .append("g")
        .attr("class", "text-group");

      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.name}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '-1.2em');

      g.append("text")
        .attr("class", "value-text")
        .text(`${d.data.value}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '.6em');
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
        .style("fill", "black");
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