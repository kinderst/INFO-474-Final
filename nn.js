/*
Scott Kinder, INFO 474 Visualization Software
Reusable nn Diagram
Note: This needs a bit of work, not completely reusable, but will work first time thru
*/

window.nn = (function() {
    var chart = function() {
        //set global variables
        var svg;
        //define default globals
        var width = 700;
        var height = 400;
        var k = 10;
        var circleSize = 5;


        //graph call
        var my = function(selection) {
            //d is data, 'this' is dom element
            selection.each(function(d, i) {
                var initialCircles = [
                    { 'x': 175, 'y': 200, 'color': 'blue', 'lbl': 'Blue'},
                    { 'x': 525, 'y': 200, 'color': 'red', 'lbl': 'Red'}];    

                svg = d3.select(this).append("svg");
                svg = svg
                        .attr("width", width)
                        .attr("height", height);

                var borderPath = svg.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", height)
                    .attr("width", width)
                    .style("stroke", 'black')
                    .style("fill", "none")
                    .style("stroke-width", 1);

                //Select all points
                var circles = svg.selectAll("circle")
                    .data(initialCircles)
                    .enter()
                    .append("circle")
                    .attr("class", "npoint")
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
                    .attr("r", 4)
                    .style("fill", function(d) { return d.color; });

                var labels = svg.selectAll("lbl")
                    .data(initialCircles)
                    .enter()         
                    .append("text")
                    .attr("class", "lbl")
                    .attr("x", function (d) { return d.x; })
                    .attr("y", function (d) { return d.y - 5; })
                    .text(function(d){
                        return d.lbl;
                    });
            });
        }

        // calculate euclidean distance of two points with coordinates: a(ax, ay) and b(bx, by)
        function euclidDistance(ax, ay, bx, by) {
            return Math.sqrt(Math.pow(ax-bx, 2) + Math.pow(ay-by, 2));
        }

        function compareNumbers(a, b) {
            return a - b;
        }

        //Function for drawing the nn paths and coloring points
        function redraw(data) {
            //get point
            pt = d3.selectAll('#npt');
            //get x and y coordinates of point
            var x = +pt.attr('cx');
            var y = +pt.attr('cy');

            var distances = [];

            //for each data point
            for (i = 0; i < data.length; i++) {
                //calculate euclidean distance
                var distance = euclidDistance(x, y, data[i][0], data[i][1]);
                //add euclidean distance to an array
                distances.push(distance);
            }
            //sort array
            distances = distances.sort(compareNumbers);

            //get the k'th furthest away point
            var max = distances[k - 1];

            circles = svg.selectAll(".npoint").data(data);

            circles.enter().append("circle").attr("class", "npoint");

            circles.exit().remove();

            circles.transition()
                .style("fill", function(e) {
                    if (euclidDistance(x, y, e[0], e[1]) <= max) {
                        return "red";
                    } else {
                        return "black";
                    }
                });

            svg.selectAll("#nptoutter")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", max);
        }

        //Sets width of graphic, value is width in pixels
        //If value is not set, returns current width, else returns voronoi object
        my.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            return my;
        };

        //Sets height of graphic, value is height in pixels
        //If value is not set, returns current height, else returns voronoi object
        my.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            return my;
        };

        //Sets circle size of point in the diagram, value is int or float
        //If value is not set, returns current circle size, else returns voronoi object.
        my.circleSize = function(value) {
            if (!arguments.length) {
                return circleSize;
            }
            circleSize = value;
            return my;
        };

        //Sets circle size of point in the diagram, value is int or float
        //If value is not set, returns current circle size, else returns voronoi object.
        my.k = function(value) {
            if (!arguments.length) {
                return k;
            }
            k = value;
            return my;
        };

        return my;
    };

    return chart;
})();