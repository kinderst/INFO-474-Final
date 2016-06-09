/*
Scott Kinder, INFO 474 Visualization Software
Reusable Voronoi Diagram
massive credit to: https://bl.ocks.org/mbostock/4060366 for having a great voronoi diagram
example, but of course I had to manipulate it and make it reusable.
See https://github.com/kinderst/d3-Reusable-Voronoi-Diagram for more documentation
*/

window.Voronoi = (function() {
    var chart = function() {
        //set global variables
        var svg, path, voronoi; //xScale, yScale;
        //define default globals
        var width = 500;
        var height = 500;
        var rectColor = ['rgb(197,27,125)',
                        'rgb(222,119,174)',
                        'rgb(241,182,218)',
                        'rgb(253,224,239)',
                        'rgb(247,247,247)',
                        'rgb(230,245,208)',
                        'rgb(184,225,134)',
                        'rgb(127,188,65)',
                        'rgb(77,146,33)'];
        var rectOpacity = 0.8;
        var circleSize = 1.5;


        //graph call
        var my = function(selection) {
            //d is data, 'this' is dom element
            selection.each(function(d, i) {
                //only if svg doesn't already exist
                if (svg == null) {
                    //append svg, path placeholder
                    svg = d3.select(this).append("svg");
                    path = svg.append("g");
                }

                //voronoi calculator scale
                voronoi = d3.geom.voronoi()
                    .clipExtent([[0, 0], [width, height]]);

                //set svg height, width, and mouseover event
                svg = svg
                        .attr("width", width)
                        .attr("height", height)
                        .on("mousemove", function() { d[0] = d3.mouse(this); redraw(d); });

                //setScales(d);

                //Select all points (except first one, because that is the assumed mouse position)
                var circles = svg.selectAll("circle")
                    .data(d.slice(1));
                    

                circles.enter()
                    .append("circle");
                    // .attr('cx', function(e){return xScale(e[0])})
                    // .attr('cy', function(e){return yScale(e[1])})
                    

                circles.exit().remove();

                circles.transition()
                    .attr("transform", function(e) { return "translate(" + e + ")"; })
                    .attr("r", circleSize);
                    // .attr('cx', function(e){return xScale(e[0])})
                    // .attr('cy', function(e){return yScale(e[1])});

                //select all geometric paths of voronoi polygons
                paths = path.selectAll("path");
                
                //redraw voronoi paths for the data, d
                redraw(d);

            });
        }

        //Function for drawing the voronoi paths on selected area
        //Data is the coordinates of the data points
        //credit: https://bl.ocks.org/mbostock/4060366
        function redraw(data) {
            paths = paths.data(voronoi(data), polygon);

            paths.enter().append("path")
                .attr("fill", function(d, i) { return rectColor[i % rectColor.length]; })
                .attr("opacity", rectOpacity)
                .attr("d", polygon);

            paths.exit().remove();

            paths.transition()
                .attr("d", polygon);

            //order so that mouse event is top of dom for path (first-child) so that it gets a different color
            //polygon square
            paths.order();
        }

        //function for calculating the position and path of a voronoi polygon
        //credit: https://bl.ocks.org/mbostock/4060366
        function polygon(data) {
            return "M" + data.join("L") + "Z";
        }

        //Set scales for graph
        //Would have set scales so that user could enter in their own points and not have them be actual
        //x, y coordinates on screen. However, the polygon function which is crucial to drawing
        //the voronoi polygons, as you can see, is not very condusive to accepting scaled integers.
        //I will most likely come into office hours or ask in lab how to fix this
        /*
        var setScales = function(data) {
            var x = [];
            data.map(function(array) {
                x.push(array[0]);
            });
            var xMax = d3.max(x);
            var xMin = d3.min(x);
            //console.log(xMin)
            xScale = d3.scale.linear().range([0, width]).domain([xMin, xMax]);

            var y = [];
            data.map(function(array) {
                y.push(array[1]);
            });
            var yMax = d3.max(y);
            var yMin = d3.min(y);
            yScale = d3.scale.linear().range([height, 0]).domain([yMin, yMax]);
        }
        */
        

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

        //Sets color of rectangles, value is array of string 'rgb(x,x,x)' values or named colors ie. 'blue'
        //Even if you just want one color for all the polygons, must pass an array
        //If value is not set, returns current rectangle colors, else returns voronoi object
        my.rectColor = function(value) {
            if (!arguments.length) {
                return rectColor;
            }
            if (value instanceof Array) {
                rectColor = value;
            }
            return my;
        };

        //Sets opacity of the rectangles, value is an integer or float that must be between 0 and 1
        //If value is not set, returns current rectangle opacity, else returns voronoi object
        my.rectOpacity = function(value) {
            if (!arguments.length) {
                return rectOpacity;
            }
            if (value >= 0 && value <= 1) {
                rectOpacity = value;
            }
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

        return my;
    };

    return chart;
})();