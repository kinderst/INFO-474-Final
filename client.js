(function() {

    $(document).ready(function() {

        //initial settings for graphs
        var width = 700;
        var height = 400;

        //initial circles
        var initialCircles = [
            { 'x': 175, 'y': 150, 'color': 'blue', 'lbl': 'Blue'},
            { 'x': 525, 'y': 150, 'color': 'red', 'lbl': 'Red'}];    

        //create nn diagram
        svg = d3.select('#nnDiagram').append("svg");
        svg = svg
                .attr("width", width)
                .attr("height", height);

        //append border path
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

        //create labels
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

        //auto scroll button 1
        $("#scroll1").click(function() {
            $('html,body').animate({
                scrollTop: $(".InfoAndGraph").offset().top},
                    'slow');
        });

        //auto scroll button 2
        $("#scroll2").click(function() {
            $('html,body').animate({
                scrollTop: $(".InfoAndGraph2").offset().top},
                    'slow');
        });

        //first checkpoint button for nn graph
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

        //second checkpoint button for nn graph
        $('#btn2').on('click', function() {
            document.getElementById('part3').style.display = "inline";
            document.getElementById('part2').style.opacity = '.3';
            document.getElementById('newcircle').style.fill = 'blue';
            document.getElementById('newcircle').style.stroke = 'none';
            document.getElementById('newlabel').innerHTML = 'Blue';
        });

        //third checkpoint button for nn graph
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

        //define points for voronoi graph, random x, y points in pixels
        var vertices = d3.range(num).map(function(d) {
            return [Math.random() * width, Math.random() * height];
        });

        //voronoi chart call
        voronoiChart = Voronoi().width(width).height(height).rectColor(allColors).rectOpacity(0.5).circleSize(4);
        //.rectColor(['rgb(255,255,0)', 'rgb(0,255,0)']).rectOpacity(0.7);

        //voronoi wrapper call
        var voronoiWrapper = d3.select("#voronoiDiagram")
              .datum(vertices)
              .call(voronoiChart);

        //reshuffles vertices for voronoi graph
        $("#voronoiReshuffle").on("click", function() {
            vertices = d3.range(num).map(function(d) {
                return [Math.random() * width, Math.random() * height];
            });
            voronoiWrapper.datum(vertices).call(voronoiChart);
        });

        //Slider for voronoi circle size (https://jqueryui.com/slider/)
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

        //Slider for number of voronoi points (https://jqueryui.com/slider/)
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
        //define knn variables
        var knnNum = 100;
        var k = 3;
        //define initial points to use for knn graph
        var points = d3.range(knnNum).map(function(d) {
            return [Math.random() * width, Math.random() * height, randInt(0, 2)];
        });
        //define knn chart and knn wrapper
        var knnChart = knn().outerWidth(width).outerHeight(height).k(k);
        var knnWrapper = d3.select("#knnDiagram")
              .datum(points)
              .call(knnChart);

        //display pseudo random basketball data
        $("#basketball").on("click", function() {
            basketballPlayers = d3.range(knnNum).map(function(d) {
                //create pseudo random weights, heights, and positions
                //this was created based off looking at a few select players
                //and calculating good averages
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
    
        //display iris data set, x1 = sepal length, x2 = petal length, y = iris type
        $("#iris").on("click", function() {
            //read csv data
            d3.csv("iris.csv", function(d) {
                var iris = [];
                //for each element in the csv dataset, populate iris 2d array
                for (var i = 0; i < d.length; i++) {
                    singleIris = [d[i].SepalLengthCm, d[i].PetalLengthCm, d[i].Species];
                    iris.push(singleIris);
                }
                knnChart.xAxisLabel("Sepal Length (cm)").yAxisLabel("Petal Length (cm)");
                knnWrapper.datum(iris).call(knnChart);
            });
            $("#knngraphtitle").html("Iris Flower Classification"); 
        });

        //display titanic dataset, x1 = age, x2 = fare, y = survived
        $("#titanic").on("click", function() {
            //read csv data
            d3.csv("titanic.csv", function(d) {
                var titanic = [];
                //for each element in the csv dataset, populate titanic 2d array
                for (var i = 0; i < d.length / 10; i++) {
                    //check if age is positive, fair is positive, and that it is less than 150 because
                    //those were some serious outliers that made graph look bad and there were
                    //only a few point
                    if (+d[i].Age > 0 && +d[i].Fare > 0 && +d[i].Fare < 150) {
                        var survived = "Died";
                        if (d[i].Survived == 1) {
                            survived = "Survived";
                        }
                        singleTitanic = [d[i].Age, Math.round(d[i].Fare), survived];
                        titanic.push(singleTitanic);
                    }
                }
                knnChart.xAxisLabel("Age (years)").yAxisLabel("Fare (1912 US dollars)");
                knnWrapper.datum(titanic).call(knnChart);
            });
            $("#knngraphtitle").html("Who survived the Titanic?");
        });
    
        //display boston dataset, x1 = average rooms per dwelling, x2 = lstat, y = medv (categorical)
        $("#boston").on("click", function() {
            //read csv data
            d3.csv("boston.csv", function(d) {
                var boston = [];
                //for each element in csv dataset, populate boston 2d array
                for (var i = 0; i < d.length; i++) {
                    if (d[i].rm > 5.2) {
                        var medv = "";
                        //define categorical values for medv
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
        
        //Reshuffles the KNN points
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
                    //if num is less than current points array size, truncate array
                    if (knnNum < points.length) {
                        points = points.slice(0, knnNum);
                    } else if (knnNum > points.length) { //else populate up to num
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
                    //set k value
                    k = $(this).slider('values', 0);
                    knnChart.k(k);
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
                    //set k value
                    decisionK = $(this).slider('values', 0);
                    $("#decisionkvalue").html("" + decisionK);
                    $("#knndecisionboundary").attr("src", "http://students.washington.edu/kinders/i474/r/k" + decisionK + ".jpeg");
                }
            });
        });

        //Button to increase k by 1, up to 50
        $("#increasek").on("click", function() {
            if (decisionK < 50) {
                decisionK += 1;
            }
            $("#decisionKSlider").slider('value',decisionK);
        });

        //Button to decrease k by up, down to 1
        $("#decreasek").on("click", function() {
            if (decisionK > 1) {
                decisionK -= 1;
            }
            $("#decisionKSlider").slider('value',decisionK);
        });
        //END DECISION BOUNDARY

    });
    
    //Function to generate a random int between a min and max value
    function randInt(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    
})();