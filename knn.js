/*
Scott Kinder, INFO 474 Visualization Software
Reusable KNN Diagram
With help from: http://bl.ocks.org/curran/1fb2ae1dfc1471972904
*/

window.knn = (function() {
    var chart = function() {
        //set global variables
        var g; //global g variable needed to reference in helper methods
        var predictText; //prediction text for which class to predict
        var predictText2; //prediction text for how much certainty in that class
        var infoLegend; //prediction legend area
        var circleSize = 5; //default circle size
        var outerWidth = 700; //default width
        var outerHeight = 400; //default height
        var margin = { left: 60, top: 5, right: 200, bottom: 60 }; //default margin
        var xColumn = "No X column configured"; //default x column
        var yColumn = "No Y column configured"; //default y column
        var xAxisLabel = "No X axis label configured"; //default xAxisLabel
        var xAxisLabelOffset = 40; //default x axis label offset
        var yAxisLabel = "No Y axis label configured"; //default y axis label offset
        var yAxisLabelOffset = 40; //default y axis label offset
        var xScale = d3.scale.linear(); //x axis scale
        var yScale = d3.scale.linear(); //y axis scale
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
            .tickFormat(d3.format("s"))
            .outerTickSize(0);
        var xTicks = 5;
        var yAxis = d3.svg.axis().scale(yScale).orient("left")
            .tickFormat(d3.format("s"))
            .outerTickSize(0);
        var yTicks = 5;
        //default colors for classes
        var getColor = ["cyan", "blue", "red", "purple", "orange", "grey", "black", "olive"];


        //graph call
        var my = function(selection) {
            //set inner width and height
            var innerWidth  = outerWidth  - margin.left - margin.right;
            var innerHeight = outerHeight - margin.top  - margin.bottom;

            //set x and y scales
            xScale.range([0, innerWidth]);
            yScale.range([innerHeight, 0]);

            //set x and y ticks
            xAxis.ticks(xTicks);
            yAxis.ticks(yTicks);

            //d is data, 'this' is dom element
            selection.each(function(d, i) {

                //data bind
                var svg = d3.select(this).selectAll("svg").data([d]);
                var gEnter = svg.enter().append("svg").append("g").attr("class", "knng");
                g = svg.select("g");
                var circles = g.selectAll(".point").data(d);

                //Get all unique y values
                var yValues = getCol(d, 2);
                yValues = yValues.filter(getUnique);

                //Create a legend
                //remove any existing old legend items
                d3.selectAll('.legenditem').remove();
                d3.selectAll('#pt').remove();
                d3.selectAll('#ptoutter').remove();

                var legend = svg.selectAll(".legend").data(yValues);
                
                legend.enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(e, j) { return "translate(0," + j * 20 + ")"; });

                legend.exit().remove();

                // draw legend colored circles
                legend.append("circle")
                    .attr("class", "legenditem")
                    .attr("cx", outerWidth - 18)
                    .attr("cy", circleSize * 2)
                    .attr("r", circleSize)
                    .style('fill', function(e, j) { 
                        return getColor[yValues.indexOf(yValues[j])];
                    });

                // draw legend text
                legend.append("text")
                    .attr("class", "legenditem")
                    .attr("x", outerWidth - 26)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(e) { return e;})

                //check if predict legend already exists, if not create it, else clear it
                if (predictText == null) {
                    infoLegend = svg.append("g")
                        .attr("class", "infolegend")
                        .attr("transform", "translate(" + (outerWidth - margin.right + 20) + "," + ((yValues.length * 20) + 20) + ")");


                    predictText = infoLegend.append("text")
                        .text("predict: ");
                    predictText2 = infoLegend.append("text")
                        .attr('y', 20)
                        .text("");
                } else {
                    infoLegend.attr("transform", "translate(" + (outerWidth - margin.right + 20) + "," + ((yValues.length * 20) + 20) + ")");
                    predictText.text("predict: ");
                    predictText2.text("");
                }

                //x axis append
                gEnter.append("g")
                    .attr("class", "x axis")
                    .append("text")
                    .attr("class", "label")
                    .style("text-anchor", "middle");

                //y axis append
                gEnter.append("g")
                    .attr("class", "y axis")
                    .append("text")
                    .attr("class", "label")
                    .style("text-anchor", "middle");

                //set scales
                xScale.domain(d3.extent(d, function (e){ return +e[0]; }));
                yScale.domain(d3.extent(d, function (e){ return +e[1]; }));

                //define svg dimensions and on click property
                svg.attr("width", outerWidth)
                    .attr("height", outerHeight)
                    .on("click", function (e) {
                        var xy = d3.mouse(d3.selectAll('.knng')[0][0]);
                        if (validPoint(xy)) {
                            g.selectAll("#pt")
                                .attr("cx", xy[0])
                                .attr("cy", xy[1]);
                            redraw(e);
                        }
                    });

                //set g area for drawing
                g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //set x axis
                g.select(".x.axis")
                    .attr("transform", "translate(0," + innerHeight + ")")
                    .call(xAxis)
                    .select("text")
                    .attr("x", innerWidth / 2)
                    .attr("y", xAxisLabelOffset)
                    .text(xAxisLabel);

                //set y axis
                g.select(".y.axis")
                    .call(yAxis)
                    .select("text")
                    .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
                    .text(yAxisLabel);

                //append circles
                circles.enter().append("circle");

                //give initial properties
                circles.attr("class", "point");
                    //.attr("opacity", 0.1);
                    //.attr("cx", 0)
                    //.attr("cy", innerHeight)
                    //.attr("r", circleSize);

                //remove nonexistent items
                circles.exit().remove();

                //transition
                circles.transition()
                    .attr("opacity", 0.5)
                    .attr("cx", function (e){ return xScale(e[0]); })
                    .attr("cy", function (e){ return yScale(e[1]); })
                    .attr("r", circleSize)
                    .style("fill", function(e) {
                        return getColor[yValues.indexOf(e[2])];
                    });

                //Initial Mouseclick Point
                g.append("circle")
                    .attr("id", "pt")
                    .attr("r", circleSize)
                    .attr("cx", innerWidth/2)
                    .attr("cy", innerHeight/2)
                    .style("fill", "green");

                //Initial Mouseclick KNN radius circle
                g.append("circle")
                    .attr("id", "ptoutter")
                    .attr("opacity", 0.2)
                    .style("fill", "green");
                //}
            });
        }

        //Function for drawing the KNN paths and coloring points
        function redraw(data) {
            //declare array for euclidean distances of all points
            var distances = [];

            //declare counters for count of classes in K range

            var classValues = {};

            //get point
            pt = d3.selectAll('#pt');

            //get x and y coordinates of point
            var x = +pt.attr('cx');
            var y = +pt.attr('cy');

            //define distance array
            var distances = [];

            //for each data point
            for (i = 0; i < data.length; i++) {
                //calculate euclidean distance
                var distance = euclidDistance(x, y, xScale(data[i][0]), yScale(data[i][1]));
                //add euclidean distance to an array
                distances.push(distance);
            }

            //sort array
            distances = distances.sort(compareNumbers);

            //get the k'th furthest away point
            var max = distances[k - 1];
            var totalObserved = k;
            if (distances.length < k) {
                max = distances[distances.length - 1];
                totalObserved = distances.length;
            }

            //select circles, data bind
            circles = g.selectAll(".point").data(data);

            //append circles
            circles.enter().append("circle").attr("class", "point");

            //remove nonexistent items
            circles.exit().remove();

            //transition items that are in k radius
            circles.transition()
                .attr("opacity", function(e) {
                    if (euclidDistance(x, y, xScale(e[0]), yScale(e[1])) <= max) {
                        if (e[2] in classValues) {
                            classValues[e[2]] = classValues[e[2]] + 1;
                        } else {
                            classValues[e[2]] = 1;
                        }
                        return 1;
                    } else {
                        return 0.5;
                    }
                });

            //get counts of each class in k radius
            var valueCounts = Object.keys(classValues).map(function (key) { return classValues[key]; });
            //get best count in k radius
            var bestCount = Math.max.apply(null, valueCounts);
            //define array for the predicted class, or multiple classes if there is a tie
            var predictedClass = [];

            //go through the class count array
            for (classValue in classValues) {
                //if it's count was equal to the max
                if (classValues[classValue] == bestCount) {
                    predictedClass.push(classValue);
                }
            }

            //quick fix for small bug (sometimes best count is greater than total observed
            //I think because it is grabbing an element in the legend)
            if (bestCount > totalObserved) {
                bestCount = totalObserved;
            }

            //Set the prediction text
            predictText.text("predict: " + predictedClass[randInt(0, predictedClass.length - 1)]);
            predictText2.text("" + bestCount + "/" + totalObserved + " (" + 
                    ((bestCount/totalObserved) * 100).toFixed(1) + "%) " + " certainty"); 

            //Draw the k range circle
            g.selectAll("#ptoutter")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", max)
                .attr("opacity", 0.2)
                .style("fill", "green");           
        }

        //Function for getting a random int
        function randInt(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }

        //Get unique values in array
        function getUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        //Check to make sure point click isn't on the scales
        function validPoint(point) {
            if (point[0] >= 0 && point[1] <= outerHeight - margin.top  - margin.bottom) {
                return true;
            } else {
                return false;
            }
        }

        // calculate euclidean distance of two points with coordinates: a(ax, ay) and b(bx, by)
        function euclidDistance(ax, ay, bx, by) {
            return Math.sqrt(Math.pow(ax-bx, 2) + Math.pow(ay-by, 2));
        }

        //Compare two numbers
        function compareNumbers(a, b) {
            return a - b;
        }

        //Get a column of an array
        function getCol(matrix, col){
            var column = [];
            for (var i = 0; i < matrix.length; i++) {
                column.push(matrix[i][col]);
            }
            return column;
        }

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

        //Sets circle size of point in the diagram, value is int or float
        //If value is not set, returns current circle size, else returns voronoi object.
        my.getColor = function(value) {
            if (!arguments.length) {
                return getColor;
            }
            getColor = value;
            return my;
        };

        //Sets width of svg
        my.outerWidth = function(_) {
            if (!arguments.length) return outerWidth;
            outerWidth = _;
            return my;
        };

        //Sets height of svg
        my.outerHeight = function(_) {
            if (!arguments.length) return outerHeight;
            outerHeight = _;
            return my;
        };

        //Sets x column
        my.xColumn = function(_) {
            if (!arguments.length) return xColumn;
            xColumn = _;
            return my;
        };

        //Sets y column
        my.yColumn = function(_) {
            if (!arguments.length) return yColumn;
            yColumn = _;
            return my;
        };

        //sets x axis label
        my.xAxisLabel = function(_) {
            if (!arguments.length) return xAxisLabel;
            xAxisLabel = _;
            return my;
        };

        //sets y axis label
        my.yAxisLabel = function(_) {
            if (!arguments.length) return yAxisLabel;
            yAxisLabel = _;
            return my;
        };

        //sets x axis label offset
        my.xAxisLabelOffset = function(_) {
            if (!arguments.length) return xAxisLabelOffset;
            xAxisLabelOffset = _;
            return my;
        };

        //sets x axis label offset
        my.yAxisLabelOffset = function(_) {
            if (!arguments.length) return yAxisLabelOffset;
            yAxisLabelOffset = _;
            return my;
        };

        //sets x axis
        my.xTicks = function(_) {
            if (!arguments.length) return xTicks;
            xTicks = _;
            return my;
        };

        //sets y ticks
        my.yTicks = function(_) {
            if (!arguments.length) return yTicks;
            yTicks = _;
            return my;
        };

        //sets margin
        my.margin = function(_) {
            if (!arguments.length) return margin;
            margin = _;
            return my;
        };

        return my;
    };

    return chart;
})();