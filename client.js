(function() {

    $(document).ready(function() {


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


        var vertices = d3.range(3).map(function(d) {
            return [Math.random() * width, Math.random() * height];
        });

        myChart = Voronoi().width(width).height(height).rectColor(allColors).rectOpacity(0.5).circleSize(4);
        //.rectColor(['rgb(255,255,0)', 'rgb(0,255,0)']).rectOpacity(0.7);
        var chartWrapper = d3.select("#voronoiDiagram")
              .datum(vertices)
              .call(myChart);

        $("#voronoiReshuffle").on("click", function() {
            vertices = d3.range(num).map(function(d) {
                return [Math.random() * width, Math.random() * height];
            });
            //myChart.width(width).rectColor(colors).rectOpacity(0.3).circleSize(50);
            chartWrapper.datum(vertices).call(myChart);
        });

        //Slider for circle size (https://jqueryui.com/slider/)
        $(function() {
            $("#circleSizeSlider").slider({
                min: 2,
                max: 20,
                change: function(event, ui) {
                    myChart.circleSize($(this).slider('values', 0));
                    chartWrapper.datum(vertices).call(myChart);
                }
            });
        });

        //Slider for number of points (https://jqueryui.com/slider/)
        $(function() {
            $("#numPointsSlider").slider({
                min: 3,
                max: 30,
                change: function(event, ui) {
                    num = $(this).slider('values', 0)
                    vertices = d3.range(num).map(function(d) {
                        return [Math.random() * width, Math.random() * height];
                    });
                    // if ($(this).slider('values', 0) > 8) {
                    //     myChart.rectColor(allColors);
                    // } else if ($(this).slider('values', 0) > 8) {
                    // } else {
                    //     myChart.rectColor(allColors);
                    // }
                    chartWrapper.datum(vertices).call(myChart);
                }
            });
        });


        //END VORONOI INITIALIZAION

    });

    
})();