(function() {

    $(document).ready(function() {

        var width = 700;
        var height = 400;
        var num = 3;
        var k = 1;

        var initialCircles = [
            { 'x': 175, 'y': 150, 'color': 'blue', 'lbl': 'Blue'},
            { 'x': 525, 'y': 150, 'color': 'red', 'lbl': 'Red'}];    

        svg = d3.select('#nnDiagram').append("svg");
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
            .attr("y", function (d) { return d.y - 6; })
            .text(function(d){
                return d.lbl;
            });


        $("#scroll1").click(function() {
            $('html,body').animate({
                scrollTop: $(".InfoAndGraph").offset().top},
                    'slow');
        });

        $("#scroll2").click(function() {
            $('html,body').animate({
                scrollTop: $(".InfoAndGraph2").offset().top},
                    'slow');
        });


        $('#btn1').on("click", function() {
            document.getElementById('part2').style.display = "inline";
            document.getElementById('part1').style.opacity = '.3';
            svg.append("circle")
                .attr("class", "npoint")
                .attr("id", 'newcircle')
                .attr("cx", 250)
                .attr("cy", 250)
                .attr("r", 4)
                .style("fill", 'white')
                .style("stroke", 'black');
            svg.append("text")
                .attr("class", "lbl")
                .attr('id', 'newlabel')
                .attr("x", 250)
                .attr("y", 250 - 6)
                .text('?');
        });

        $('#btn2').on('click', function() {
            document.getElementById('part3').style.display = "inline";
            document.getElementById('part2').style.opacity = '.3';
            document.getElementById('newcircle').style.fill = 'blue';
            document.getElementById('newcircle').style.stroke = 'none';
            document.getElementById('newlabel').innerHTML = 'Blue';
        });

        $('#btn3').on('click', function() {
            document.getElementById('part4').style.display = "inline";
            document.getElementById('part3').style.opacity = '.3';
            document.getElementById('newcircle').style.display = 'none';
            document.getElementById('newlabel').style.display = 'none';
            svg.append("line")
                .attr('x1', 350)
                .attr('y1', 0)
                .attr('x2', 350)
                .attr('y2', 400)
                .attr('stroke', 'gray')
                .attr('stroke-width', 3)
                .style("stroke-dasharray", ("3, 3"));

            svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width / 2)
                .style("fill", "blue")
                .style("opacity", .1);

            svg.append("rect")
                .attr("x", width / 2)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width)
                .style("fill", "red")
                .style("opacity", .1);
        });

        //VORONOI INITIALIZATION
        var width = 700;
        var height = 400;
        var num = 3;
        var colors = ['rgb(255,0,0)', 'rgb(10,0,255)'];
        // var allColors = ['rgb(197,27,125)',
        //                 'rgb(127,188,65)',
        //                 'rgb(201,10,118)',
        //                 'rgb(230,245,100)',
        //                 'rgb(165,233,238)',
        //                 'rgb(214,245,129)',
        //                 'rgb(184,225,134)',
        //                 'rgb(222,119,174)',
        //                 'rgb(77,146,33)'];


        var allColors = ['rgb(197,27,125)',
                        'rgb(127,188,65)',
                        'rgb(201,10,118)',
                        'rgb(230,245,100)',
                        'rgb(165,233,238)',
                        'rgb(214,245,129)',
                        'rgb(184,225,134)',
                        'rgb(222,119,174)',
                        'rgb(255,182,193)',
                        'rgb(65,105,225)',
                        'rgb(176,196,222)',
                        'rgb(77,146,33)'];


        var vertices = d3.range(num).map(function(d) {
            return [Math.random() * width, Math.random() * height];
        });

        voronoiChart = Voronoi().width(width).height(height).rectColor(allColors).rectOpacity(0.5).circleSize(4);
        //.rectColor(['rgb(255,255,0)', 'rgb(0,255,0)']).rectOpacity(0.7);
        var voronoiWrapper = d3.select("#voronoiDiagram")
              .datum(vertices)
              .call(voronoiChart);

        $("#voronoiReshuffle").on("click", function() {
            vertices = d3.range(num).map(function(d) {
                return [Math.random() * width, Math.random() * height];
            });
            voronoiWrapper.datum(vertices).call(voronoiChart);
        });

        //Slider for circle size (https://jqueryui.com/slider/)
        $(function() {
            $("#voronoiCircleSizeSlider").slider({
                min: 2,
                max: 20,
                change: function(event, ui) {
                    voronoiChart.circleSize($(this).slider('values', 0));
                    voronoiWrapper.datum(vertices).call(voronoiChart);
                }
            });
        });

        //Slider for number of points (https://jqueryui.com/slider/)
        $(function() {
            $("#voronoiNumPointsSlider").slider({
                min: 3,
                max: 30,
                change: function(event, ui) {
                    num = $(this).slider('values', 0);
                    if (num < vertices.length) {
                        vertices = vertices.slice(0, num);
                    } else if (num > vertices.length) {
                        var difference = num - vertices.length;
                        for (var i = 0; i < difference; i++) {
                            vertices.push([Math.random() * width, Math.random() * height]);
                        }
                    }
                    voronoiWrapper.datum(vertices).call(voronoiChart);
                }
            });
        });


        //END VORONOI INITIALIZAION

        //KNN INITIALIZATION
        var width = 700;
        var height = 400;
        var knnNum = 100;
        var k = 3;
        var points = d3.range(knnNum).map(function(d) {
            return [Math.random() * width, Math.random() * height, randInt(0, 2)];
        });

        var knnChart = knn().outerWidth(width).outerHeight(height).k(k);
        var knnWrapper = d3.select("#knnDiagram")
              .datum(points)
              .call(knnChart);

        $("#basketball").on("click", function() {
            basketballPlayers = d3.range(knnNum).map(function(d) {
                var y = randInt(0, 4);
                var height = 0;
                var weight = 0;
                if (y == 0) {
                    height = randInt(82, 86) + Math.random();
                    weight = height * 3.3 + randInt(-20, 20) + Math.random();
                    y = "Center";
                } else if (y == 1) {
                    height = randInt(80, 83) + Math.random();
                    weight = height * 3 + randInt(-15, 15) + Math.random();
                    y = "Power Forward";
                } else if (y == 2) {
                    height = randInt(78, 81) + Math.random();
                    weight = height * 2.9 + randInt(-12, 12) + Math.random();
                    y = "Small Forward";
                } else if (y == 3) {
                    height = randInt(73, 79) + Math.random();
                    weight = height * 2.8 + randInt(-12, 12) + Math.random();
                    y = "Shooting Guard";
                } else {
                    height = randInt(67, 76) + Math.random();
                    weight = (height * 2.6) + randInt(-10, 10) + Math.random();
                    y = "Point Guard";
                }
                return [weight, height, y];
            });
            knnChart.xAxisLabel("weight (lbs.)").yAxisLabel("height (inches)");
            knnWrapper.datum(basketballPlayers).call(knnChart);
            $("#knngraphtitle").html("Basketball Player Position Classification"); 
        });

        $("#iris").on("click", function() {
            d3.csv("iris.csv", function(d) {
                var iris = [];
                for (var i = 0; i < d.length; i++) {
                    singleIris = [d[i].SepalLengthCm, d[i].PetalLengthCm, d[i].Species];
                    iris.push(singleIris);
                }
                knnChart.xAxisLabel("Sepal Length (cm)").yAxisLabel("Petal Length (cm)");
                knnWrapper.datum(iris).call(knnChart);
            });
            $("#knngraphtitle").html("Iris Flower Classification"); 
        });

        $("#titanic").on("click", function() {
            d3.csv("titanic.csv", function(d) {
                var titanic = [];
                for (var i = 0; i < d.length / 10; i++) {
                    if (+d[i].Age > 0 && +d[i].Fare > 0 && +d[i].Fare < 150) {
                        var survived = "Died";
                        if (d[i].Survived == 1) {
                            survived = "Survived";
                        }
                        singleTitanic = [d[i].Age, Math.round(d[i].Fare), survived];
                        titanic.push(singleTitanic);
                    }
                }
                knnChart.xAxisLabel("Age").yAxisLabel("Fare");
                knnWrapper.datum(titanic).call(knnChart);
            });
            $("#knngraphtitle").html("Who survived the Titanic?");
        });

        $("#boston").on("click", function() {
            d3.csv("boston.csv", function(d) {
                var boston = [];
                for (var i = 0; i < d.length; i++) {
                    if (d[i].rm > 5.2) {
                        var medv = "";
                        if (d[i].medv < 10) {
                            medv = "Cheap (less than $10k)"
                        } else if (d[i].medv < 20) {
                            medv = "Below Average ($10k-$20k)"
                        } else if (d[i].medv < 30) {
                            medv = "Average ($20k-$30k)";
                        } else if (d[i].medv < 40) {
                            medv = "Above Average ($30k-$40k)";
                        } else {
                            medv = "Expensive (more than $40k)";
                        }
                        var singleBoston = [d[i].rm, d[i].lstat, medv];
                        boston.push(singleBoston);
                    }
                }
                knnChart.xAxisLabel("average number of rooms per dwelling").yAxisLabel("% lower status of the population");
                knnWrapper.datum(boston).call(knnChart);
            });
            $("#knngraphtitle").html("Boston Housing Prices");
        });

        $("#knnReshuffle").on("click", function() {
            points = d3.range(knnNum).map(function(d) {
                return [Math.random() * width, Math.random() * height, randInt(0, 2)];
            });
            knnWrapper.datum(points).call(knnChart);
            $("#knngraphtitle").html("Random Points, 3 classes");
        });

        // //Slider for circle size (https://jqueryui.com/slider/)
        // $(function() {
        //     $("#knnCircleSizeSlider").slider({
        //         min: 2,
        //         max: 15,
        //         change: function(event, ui) {
        //             knnChart.circleSize($(this).slider('values', 0));
        //             knnWrapper.datum(points).call(knnChart);
        //         }
        //     });
        // });

        //Slider for number of points (https://jqueryui.com/slider/)
        $(function() {
            $("#knnNumPointsSlider").slider({
                min: 3,
                max: 100,
                change: function(event, ui) {
                    knnNum = $(this).slider('values', 0);
                    if (knnNum < points.length) {
                        points = points.slice(0, knnNum);
                    } else if (knnNum > points.length) {
                        var difference = knnNum - points.length;
                        for (var i = 0; i < difference; i++) {
                            points.push([Math.random() * width, Math.random() * height, randInt(0, 2)]);
                        }
                    }
                    knnWrapper.datum(points).call(knnChart);
                }
            });
        });

        //Slider for k value (https://jqueryui.com/slider/)
        $(function() {
            $("#knnKSlider").slider({
                min: 1,
                max: 25,
                change: function(event, ui) {
                    k = $(this).slider('values', 0);
                    knnChart.k(k);
                    //knnWrapper.datum(points).call(knnChart);
                    $("#kvalue").html("" + k);
                }
            });
        });
        //END KNN INITIALIZATION

        //DECISION BOUNDARY
        var decisionK = 1;

        //Slider for k value (https://jqueryui.com/slider/)
        $(function() {
            $("#decisionKSlider").slider({
                min: 1,
                max: 50,
                change: function(event, ui) {
                    decisionK = $(this).slider('values', 0);
                    $("#decisionkvalue").html("" + decisionK);
                    $("#knndecisionboundary").attr("src", "http://students.washington.edu/kinders/i474/r/k" + decisionK + ".jpeg");
                }
            });
        });


        $("#increasek").on("click", function() {
            if (decisionK < 50) {
                decisionK += 1;
            }
            $("#decisionKSlider").slider('value',decisionK);
        });

        $("#decreasek").on("click", function() {
            if (decisionK > 1) {
                decisionK -= 1;
            }
            $("#decisionKSlider").slider('value',decisionK);
        });
        //END DECISION BOUNDARY

    });

    function randInt(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    
})();