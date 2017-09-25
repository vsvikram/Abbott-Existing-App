abbottApp.service('customChartThemeService', ['$state', function($state) {
    this.barChart = function(svgBar, data, config) {
        var barWidth = window.innerWidth * 0.016666667,
            textGap = window.innerWidth * 0.008333333;
        yAxisValue = -window.innerWidth * 0.083333333;
        formatSuffixDecimal2 = d3.format(".3s");
        var ticksLimit = config.ticksLimit || 8;
        var maxYValue = d3.max(data, function(d) {
            return d.value;
        });
        var minYValue = d3.min(data, function(d) {
            return d.value;
        });
        if (minYValue % config.yGap > 0)
            minYValue -= (minYValue % config.yGap);
        else
            minYValue -= config.yGap

        if (maxYValue % config.yGap > 0)
            maxYValue += (config.yGap - (maxYValue % config.yGap));
        else {
            maxYValue += config.yGap;
        }
        minYValue -= config.tickStart != undefined ? config.tickStart : 0;
        maxYValue += config.tickEnd != undefined ? config.tickEnd : 0;
        ticksLimit = (maxYValue - minYValue) / config.yGap;

        var tickHeight = window.innerWidth * 0.041666667;
        var tXValue = -(window.innerWidth * 0.013888889)


        var chartDimen = {
            margin: {
                top: window.innerWidth * 0.055555556,
                right: window.innerWidth * 0.055555556,
                bottom: window.innerWidth * 0.083333333,
                left: window.innerWidth * 0.125
            },
            width: window.innerWidth * 0.907407407,
            height: (ticksLimit + 4) * tickHeight

        }


        svgBar.attr("width", chartDimen.width);
        svgBar.attr("height", chartDimen.height);
        svgBar.attr("class", 'chart chart-bar ' + (config.className != undefined ? config.className : ''));
        var margin = chartDimen.margin,
            width = +svgBar.attr("width") - margin.left - margin.right,
            height = +svgBar.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svgBar.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) {
            return d.names;
        }));



        y.domain([minYValue, maxYValue]);
        y.domain([minYValue, maxYValue]);
        if (data.length > 10) {
            g.append("g")
                .attr("class", "axis axis--x trans")
                .attr("transform", "translate(" + tXValue + "," + (height + tXValue) + ")")
                .call(d3.axisBottom(x));

        } else {
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

        }


        if (maxYValue > 999) {
            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(ticksLimit).tickFormat(d3.format(".2s")))
                .append("text")
                .attr("transform", "rotate(-90)")
                .text(config.yAxis)
                .attr("y", yAxisValue)
                .attr("x", function(d) {
                    var widthCheck = height / 2;
                    var tWidth = this.getBBox().width / 2;
                    return -(widthCheck - tWidth);
                });

        } else {
            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(ticksLimit))
                .append("text")
                .attr("transform", "rotate(-90)")
                .text(config.yAxis)
                .attr("y", yAxisValue)
                .attr("x", function(d) {
                    var widthCheck = height / 2;
                    var tWidth = this.getBBox().width / 2;
                    return -(widthCheck - tWidth);
                });
        }

        g.selectAll('.axis--y .tick text')
            .attr('dy', '-2')
            .attr('x', function(x) {
                var cX = this.getAttribute('x');
                if (cX != null) {
                    cX = parseInt(cX) * 2;
                    return cX;
                }
            })
            .attr('text-anchor', 'start');
        g.selectAll('.axis--y .tick line')
            .attr('x2', function(x) {
                var cX = this.nextSibling.getAttribute('x');
                if (cX != null) {
                    cX = parseInt(cX);
                    return cX;
                }
            })


        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(ticksLimit)
        }

        g.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )


        var barG = g.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr('width', width / data.length)
            .attr('class', 'rect-g ' + (config.className != undefined ? config.className : '') + "-rect")
            .attr("x", function(d) {
                return x(d.names);
            })
            .attr("y", function(d) {
                return y(d.value);
            })

        barG
            .append("rect")
            .attr("class", "bar")
            .attr("width", barWidth)
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .attr("x", function(d) {
                var xPos = x(d.names)
                var widthCheck = (width / data.length) / 2;
                return xPos + widthCheck - (barWidth / 2);
            })
            .attr("y", function(d) {

                return y(d.value);
            })


        if (maxYValue > 999) {
            barG
                .append('text')
                .attr("width", barWidth)
                .text(function(d) {
                    return (formatSuffixDecimal2(d.value))
                })
                .attr("x", function(d) {
                    var xPos = x(d.names)
                    var widthCheck = (width / data.length) / 2;
                    var tWidth = this.getBBox().width / 2;
                    return xPos + widthCheck - tWidth;
                })
                .attr("y", function(d) {
                    return y(d.value) - textGap;
                })
                .attr('text-anchor', 'center')
        } else {
            barG
                .append('text')
                .attr("width", barWidth)
                .text(function(d) {
                    return (d.value)
                })
                .attr("x", function(d) {
                    var xPos = x(d.names)
                    var widthCheck = (width / data.length) / 2;
                    var tWidth = this.getBBox().width / 2;
                    return xPos + widthCheck - tWidth;
                })
                .attr("y", function(d) {
                    return y(d.value) - textGap;
                })
                .attr('text-anchor', 'center')

        }
        if(config.clickAllowed){
            svgBar.selectAll(".rect-g").on('click', function(d,i){ 
                if(config.dataToNext){
                    config.dataToNext[config.dataToNextKey] = {
                        names : d.names,
                        value : d.value,
                        userTerritory: d.userTerritory
                    }; 
                }
                if(config.stateToGo){
                    $state.go(config.stateToGo,{object : encodeURI(JSON.stringify(config.dataToNext))});
                }
            });
        }
    }

    this.lineChart = function(svgBar, data, config) {

        var tickLimit = 11,
            xTickLimit = 4,
            barWidth = window.innerWidth * 0.016666667,
            textGap = window.innerWidth * 0.008333333
        dotRadius = window.innerWidth * 0.042;
        medianTextX = -(window.innerWidth * 0.041666667);
        medianTextY = -(window.innerWidth * 0.077777778);
        medianBoxX = -(window.innerWidth * 0.055555556);
        medianBoxY = -(window.innerWidth * 0.105555556);
        medianBoxR = window.innerWidth * 0.013888889;
        axisPos = -(window.innerWidth) * 0.166666667;
        yAxisValue = -window.innerWidth * 0.083333333;

        var maxYValue = d3.max(data, function(d) {
            return d.value;
        });
        var minYValue = d3.min(data, function(d) {
            return d.value;
        });
        var midLineMax = maxYValue;
        var midLineMin = minYValue;

        if (minYValue % config.yGap > 0)
            minYValue -= (minYValue % config.yGap);
        else
            minYValue -= config.yGap

        if (maxYValue % config.yGap > 0)
            maxYValue += (config.yGap - (maxYValue % config.yGap));
        else {
            maxYValue += config.yGap;
        }
        minYValue -= config.tickStart != undefined ? config.tickStart : 0;
        maxYValue += config.tickEnd != undefined ? config.tickEnd : 0;
        tickLimit = (tickLimit) ? tickLimit : (maxYValue - minYValue) / config.yGap;

        var tickHeight = window.innerWidth * 0.041666667
        var medianAdd = window.innerWidth * 0.083333333;
        var chartDimen = {
            margin: {
                top: window.innerWidth * 0.055555556,
                right: window.innerWidth * 0.055555556,
                bottom: window.innerWidth * 0.083333333,
                left: window.innerWidth * 0.125
            },
            width: window.innerWidth * 0.907407407,
            height: (tickLimit + 4) * tickHeight
        }
        if (config.median) {
            chartDimen.margin.top += medianAdd;
            chartDimen.height += medianAdd;
        }


        svgBar.attr("width", chartDimen.width);
        svgBar.attr("height", chartDimen.height);
        svgBar.attr("class", 'chart chart-line');
        var margin = chartDimen.margin,
            width = +svgBar.attr("width") - margin.left - margin.right,
            height = +svgBar.attr("height") - margin.top - margin.bottom;


        var parseTime = d3.timeParse("%b");
        var monthFormat = d3.timeFormat("%b");

        var pWidth = width - (width * .2);

        var x = d3.scaleTime().rangeRound([0, pWidth]);
        var y = d3.scaleLinear().rangeRound([height, 0]);

        var valueline = d3.line()
            .x(function(d) {
                return x(d.names);
            })
            .y(function(d) {
                return y(d.value);
            });


        svgBar = svgBar
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var cYear = new Date().getFullYear();

        data.forEach(function(d) {
            d.names = parseTime(d.names);
            d.value = +d.value;
        });

        x.domain(d3.extent(data, function(d) {
            return d.names;
        }));



        y.domain([minYValue, maxYValue]);

        svgBar.append("g")
            .attr("transform", "translate(" + (width * 0.08) + "," + height + ")")
            .attr('class', 'axis axis--x')
            .call(d3.axisBottom(x).ticks(xTickLimit).tickFormat(d3.timeFormat("%b")));

        svgBar.append("g")
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y).ticks(tickLimit))
            .append("text")
            .attr("transform", "rotate(-90)")
            .text(config.yAxis)
            .attr("y", yAxisValue)
            .attr("x", function(d) {
                var widthCheck = height / 2;
                var tWidth = this.getBBox().width / 2;
                return -(widthCheck - tWidth);
            });;

        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(tickLimit)
        }

        function make_x_gridlines() {
            return d3.axisTop(x)
                .ticks(xTickLimit)
        }


        var svgxGrid = svgBar.append("g")
            .attr("class", "grid x-grid")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )

        svgxGrid.selectAll('g')
            .attr("class", "grid-box grid-box-x")
            .insert("rect")
            .attr("width", width)
            .attr("height", height);

        svgBar.append("g")
            .attr("class", "grid y-grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            );

        if (config.median) {

            var avgValue = (config.medianValue) ? Math.round(config.medianValue) : Math.round((midLineMax + midLineMin) / 2);

            var svgMid = svgBar.select('.grid.y-grid')
                .append("rect")
                .attr('class', 'data-mid')
                .attr('x', '0')
                .attr('y', y(avgValue))
                .attr('width', width)
                .attr('height', '1');

            svgBar.select('.grid.y-grid')
                .append('text')
                .attr('class', 'text-mid')
                .text('YTD - ' + avgValue + '%')
                .attr('x', width)
                .attr('y', function(d) {
                    return y(avgValue) - tickLimit;
                });

            svgMed = svgBar.append("g")
                .attr('class', 'median-box')

            svgMed
                .append('text')
                .attr('id', 'median-text')
                .text('YTD - ' + avgValue + '%')
                .attr('x', medianTextX)
                .attr('y', medianTextY)



            var textBox = document.getElementById("median-text");
            var bBox = textBox.getBBox();


            medianBoxW = bBox.width + (window.innerWidth * 0.022222222);
            medianBoxH = bBox.height + (window.innerWidth * 0.008333333);

            svgMed
                .append("rect")
                .attr('class', 'median-border')
                .attr('x', medianBoxX)
                .attr('y', medianBoxY)
                .attr('rx', medianBoxR)
                .attr('ry', medianBoxR)
                .attr('width', medianBoxW)
                .attr('height', medianBoxH)
        }

        svgBar.selectAll('.grid.x-grid')
            .attr("transform", "translate(" + (width * 0.08) + ",0)");

        var svgData = svgBar.append("g")
            .attr('class', 'data-chart')
            .attr("transform", "translate(" + (width * 0.08) + ",0)");

        svgData.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        var svgDots = svgData.append('g')
            .attr('class', 'dots');

        svgDots
            .selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", dotRadius)
            .attr("cx", function(d) {
                return x(d.names);
            })
            .attr("cy", function(d) {
                return y(d.value);
            });

        svgDots
            .selectAll("text")
            .data(data)
            .enter()
            .append('text')
            .text(function(d) {
                return (d.value)
            })
            .attr("x", function(d) {
                var xpos = x(d.names) - (this.getBBox().width / 2);
                return xpos;
            })
            .attr("y", function(d) {
                var ypos = y(d.value) + (width * 0.01);
                return ypos;
            })
            .attr('text-anchor', 'center');
    }

    this.barLineChart = function(svgBar, data, config) {
        this.tickCalculation(svgBar, data, config);
        this.barLine_barChart(svgBar, data.barData, config);
        this.barLine_lineChart(svgBar, data.lineData, config);
    }
    var maximumValue, minimumValue, tickLimit, minYValueB, minYValueL, maxYValueB, maxYValueL;

    this.tickCalculation = function(svgBar, data, config) {

        maxYValueB = d3.max(data.barData, function(d) {
            return d.value;
        });
        minYValueB = d3.min(data.barData, function(d) {
            return d.value;
        });

        maxYValueL = d3.max(data.lineData, function(d) {
            return d.value;
        });
        minYValueL = d3.min(data.lineData, function(d) {
            return d.value;
        });

        // minYValueB <  minYValueL ? minimumValue=minYValueB : minimumValue = minYValueL;
        // maxYValueB >  maxYValueL ? maximumValue=maxYValueB : maximumValue = maxYValueL;

        // console.log(minimumValue);
        // console.log(maximumValue);

        //BAR CHART
        if (minYValueB % config.yGapB > 0)
            minYValueB -= (minYValueB % config.yGapB);
        else
            minYValueB -= config.yGapB

        if (maxYValueB % config.yGapB > 0)
            maxYValueB += (config.yGapB - (maxYValueB % config.yGapB));
        else {
            maxYValueB += config.yGapB;
        }
        minYValueB -= config.tickStartB != undefined ? config.tickStartB : 0;
        maxYValueB += config.tickEndB != undefined ? config.tickEndB : 0;

        var tickLimitB = (maxYValueB - minYValueB) / config.yGapB;

        //LINE CHART
        if (minYValueL % config.yGapL > 0)
            minYValueL -= (minYValueL % config.yGapL);
        else
            minYValueL -= config.yGapL

        if (maxYValueL % config.yGapL > 0)
            maxYValueL += (config.yGapL - (maxYValueL % config.yGapL));
        else {
            maxYValueL += config.yGapL;
        }
        minYValueL -= config.tickStartL != undefined ? config.tickStartL : 0;
        maxYValueL += config.tickEndL != undefined ? config.tickEndL : 0;

        var tickLimitL = (maxYValueL - minYValueL) / config.yGapL;

        //MAXIMUM TICK VALUE

        tickLimitL > tickLimitB ? tickLimit = tickLimitL : tickLimit = tickLimitB;
        console.log(tickLimit)


    }



    this.barLine_barChart = function(svgBar, data, config) {
        var barWidth = window.innerWidth * 0.052777778,
            textGap = window.innerWidth * 0.005;
        yAxisValue = -window.innerWidth * 0.083333333;



        var tickHeight = window.innerWidth * 0.041666667

        var chartDimen = {
            margin: {
                top: window.innerWidth * 0.055555556,
                right: window.innerWidth * 0.055555556,
                bottom: window.innerWidth * 0.083333333,
                left: window.innerWidth * 0.125
            },
            width: window.innerWidth * 0.907407407,
            height: (tickLimit + 4) * tickHeight
        }

        svgBar.attr("width", chartDimen.width);
        svgBar.attr("height", chartDimen.height);
        svgBar.attr("class", 'chart chart-bar-line');
        var margin = chartDimen.margin,
            width = +svgBar.attr("width") - margin.left - margin.right,
            height = +svgBar.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svgBar.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) {
            return d.names;
        }));



        y.domain([minYValueB, maxYValueB]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var yAxis = g.append("g")
            .attr("class", "axis axis--y bar-line")
            .call(d3.axisLeft(y).ticks(tickLimit));

        yAxis
            .append("text")
            .attr("transform", "rotate(-90)")
            .text(config.yAxisOne)
            .attr('class', 'bar-line')
            .attr("y", yAxisValue)
            .attr("x", function(d) {
                var widthCheck = height / 2;
                var tWidth = this.getBBox().width / 2;
                return -(widthCheck - tWidth);
            });


        if (config.yAxisTwo) {
            yAxis
                .append("text")
                .attr("transform", "rotate(90)")
                .text(config.yAxisTwo)
                .attr('class', 'bar-line')
                .attr('text-anchor', 'start')
                .attr("y", -(width + (window.innerWidth * 0.025)))
                .attr("x", function(d) {
                    var widthCheck = height / 2;
                    var tWidth = this.getBBox().width / 2;
                    return (widthCheck - tWidth);
                });

        }



        g.selectAll('.axis--y .tick text')
            .attr('dy', '-2')
            .attr('x', function(x) {
                var cX = this.getAttribute('x');
                if (cX != null) {
                    cX = parseInt(cX) * 2;
                    return cX;
                }
            })
            .attr('text-anchor', 'start');
        g.selectAll('.axis--y .tick line')
            .attr('x2', function(x) {
                var cX = this.nextSibling.getAttribute('x');
                if (cX != null) {
                    cX = parseInt(cX);
                    return cX;
                }
            })

        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr('width', width / data.length)
            .attr('class', 'bg-rect-g')
            .attr("x", function(d) {
                return x(d.names);
            })
            .attr("y", function(d) {
                return y(d.value);
            })
            .append("rect")
            .attr("class", "bar-bg")
            .attr("width", barWidth)
            .attr("height", height)
            .attr("x", function(d) {
                var xPos = x(d.names)
                var widthCheck = (width / data.length) / 2;
                return xPos + widthCheck - (barWidth / 2);
            })
            .attr("y", '0');


        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(tickLimit)
        }

        g.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )


        var barG = g.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr('width', width / data.length)
            .attr('class', 'rect-g')
            .attr("x", function(d) {
                return x(d.names);
            })
            .attr("y", function(d) {
                return y(d.value);
            })


        barG
            .append("rect")
            .attr("class", "bar")
            .attr("width", barWidth)
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .attr("x", function(d) {
                var xPos = x(d.names)
                var widthCheck = (width / data.length) / 2;
                return xPos + widthCheck - (barWidth / 2);
            })
            .attr("y", function(d) {
                return y(d.value);
            });

        barG
            .append('text')
            .attr("width", barWidth)
            .text(function(d) {
                return (d.value)
            })
            .attr("x", function(d) {
                var xPos = x(d.names)
                var widthCheck = (width / data.length) / 2;
                var tWidth = this.getBBox().width / 2;
                return xPos + widthCheck - tWidth;
            })
            .attr("y", function(d) {
                var cPos = y(d.value) + textGap;
                var tHg = this.getBBox().height;
                return cPos + tHg;
            })
            .attr('text-anchor', 'center')

    }

    this.barLine_lineChart = function(svgBar, data, config) {
        var svgEle = svgBar;
        var xTickLimit = 4,
            barWidth = window.innerWidth * 0.016666667,
            textGap = window.innerWidth * 0.008333333,
            dotRadius = window.innerWidth * 0.027777778;

        var tickHeight = window.innerWidth * 0.041666667;
        yAxisValue = -window.innerWidth * 0.083333333;

        var chartDimen = {
            margin: {
                top: window.innerWidth * 0.055555556,
                right: window.innerWidth * 0.055555556,
                bottom: window.innerWidth * 0.083333333,
                left: window.innerWidth * 0.125
            },
            width: window.innerWidth * 0.907407407,
            height: (tickLimit + 4) * tickHeight
        }


        var margin = chartDimen.margin,
            width = +svgBar.attr("width") - margin.left - margin.right,
            height = +svgBar.attr("height") - margin.top - margin.bottom;



        var parseTime = d3.timeParse("%b");
        var monthFormat = d3.timeFormat("%b");

        var pWidth = width - (width * .25);

        var x = d3.scaleTime().rangeRound([0, pWidth]);
        var y = d3.scaleLinear().rangeRound([height, 0]);

        var valueline = d3.line()
            .x(function(d) {
                return x(d.names);
            })
            .y(function(d) {
                return y(d.value);
            });


        svgBar = svgBar
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var cYear = new Date().getFullYear();

        data.forEach(function(d) {
            d.names = parseTime(d.names);
            d.value = +d.value;
        });

        x.domain(d3.extent(data, function(d) {
            return d.names;
        }));

        var diffValue = maxYValueL - minYValueL;

        if (tickLimit > diffValue) {
            var diffMedian = (tickLimit - diffValue) / 2;
            var roundMax = Math.ceil(diffMedian);
            var roundMin = Math.floor(diffMedian);
            maxYValueL += roundMax;
            minYValueL -= roundMin;
        }

        y.domain([minYValueL, maxYValueL]);

        svgBar.append("g")
            .attr('class', 'axis axis--y axis-right')
            .attr("transform", "translate( " + (width - (width * 0.1)) + ", 0 )")
            .call(d3.axisRight(y).ticks(tickLimit));

        svgBar.selectAll('.axis--y .tick text')
            .attr('dy', '-2')
            .attr('x', function(x) {
                var cX = this.getAttribute('x');
                if (cX != null) {
                    cX = parseInt(cX) * 2;
                    return cX;
                }
            })
            .attr('text-anchor', 'start');

        var svgData = svgBar.append("g")
            .attr('class', 'data-chart')
            .attr("transform", "translate(" + (width * 0.12) + ",-" + (width * 0.04) + ")");

        svgData.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        var svgDots = svgData.append('g')
            .attr('class', 'dots');

        svgDots
            .selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", dotRadius)
            .attr("cx", function(d) {
                return x(d.names);
            })
            .attr("cy", function(d) {
                return y(d.value);
            });

        svgDots
            .selectAll("text")
            .data(data)
            .enter()
            .append('text')
            .text(function(d) {
                return (d.value)
            })
            .attr("x", function(d) {
                var xpos = x(d.names) - (this.getBBox().width / 2);
                return xpos;
            })
            .attr("y", function(d) {
                var ypos = y(d.value) + (width * 0.01);
                return ypos;
            })
            .attr('text-anchor', 'center');

    }

    this.multibarChart = function(svgBar, data, config) {

        var barWidth = window.innerWidth * 0.016666667,
            textGap = window.innerWidth * 0.008333333,
            barSpace = window.innerWidth * 0.01388889,
            modNum = 5,
            tickLimit = 8;
        yAxisValue = -window.innerWidth * 0.083333333;

        var yMin = d3.min(data, function(d) {
            return Math.min.apply(null, d.value);
        });
        var yMax = d3.max(data, function(d) {
            return Math.max.apply(null, d.value);
        });

        var yMin = yMin - (yMin % modNum) - modNum;
        var yMaxMod = (yMax % modNum);
        if (yMaxMod > 0)
            yMaxMod = modNum - (yMax % modNum)
        var yMax = yMax + yMaxMod + modNum;

        yMin -= config.tickStart != undefined ? config.tickStart : 0;
        yMax += config.tickEnd != undefined ? config.tickEnd : 0;

        tickLimit = Math.round((yMax - yMin) / config.yGap);
        var tickHeight = window.innerWidth * 0.041666667

        var chartDimen = {
            margin: {
                top: window.innerWidth * 0.055555556,
                right: window.innerWidth * 0.055555556,
                bottom: window.innerWidth * 0.083333333,
                left: window.innerWidth * 0.125
            },
            width: window.innerWidth * 0.907407407,
            height: (tickLimit + 4) * tickHeight
        }

        svgBar.attr("width", chartDimen.width);
        svgBar.attr("height", chartDimen.height);
        svgBar.attr("class", 'chart chart-bar');
        var margin = chartDimen.margin,
            width = +svgBar.attr("width") - margin.left - margin.right,
            height = +svgBar.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svgBar.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) {
            return d.names;
        }));
        var arrayLength = d3.max(data, function(d) {
            return d.value.length;
        })


        y.domain([yMin, yMax]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(tickLimit))
            .append("text")
            .attr("transform", "rotate(-90)")
            .text("CLAIMS")
            .attr("y", yAxisValue)
            .attr("x", function(d) {
                var widthCheck = height / 2;
                var tWidth = this.getBBox().width / 2;
                return -(widthCheck - tWidth);
            });

        g.selectAll('.axis--y .tick text')
            .attr('dy', '-2')
            .attr('x', function(x) {
                var cX = this.getAttribute('x');
                if (cX != null) {
                    cX = parseInt(cX) * 2;
                    return cX;
                }
            })
            .attr('text-anchor', 'start');
        g.selectAll('.axis--y .tick line')
            .attr('x2', function(x) {
                var cX = this.nextSibling.getAttribute('x');
                if (cX != null) {
                    cX = parseInt(cX);
                    return cX;
                }
            })


        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(tickLimit)
        }

        g.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )


        var barG1 = g.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr('width', width / data.length)
            .attr('class', 'rect-g')
            .attr("x", function(d) {
                return x(d.names);
            })
        var secWidth = 0;

        for (var i = 0; i < arrayLength; i++) {
            if (i == (arrayLength - 1))
                secWidth += barWidth;
            else
                secWidth += barWidth + barSpace;
        }
        secWidth -= window.innerWidth * 0.0138888889;
        secWidth = secWidth.toFixed(2);

        for (var i = 0; i < arrayLength; i++) {
            barG1
                .append("rect")
                .attr("class", "bar bar-" + i)
                .attr("width", barWidth)
                .attr("height", function(d) {
                    return height - y(d.value[i]);
                })
                .attr("x", function(d) {
                    var xPos = x(d.names) + (barWidth * i) + (barSpace * i);
                    var widthCheck = (width / data.length) / 2;
                    return xPos + widthCheck - (barWidth / 2) - (secWidth / 2);
                })
                .attr("y", function(d) {
                    return y(d.value[i]);
                })

            barG1
                .append('text')
                .attr("class", "bar-text bar-text-" + i)
                .attr("width", barWidth)
                .text(function(d) {
                    return (d.value[i])
                })
                .attr("x", function(d) {
                    var xPos = x(d.names) + (barWidth * i) + (barSpace * i);
                    var widthCheck = (width / data.length) / 2;
                    var tWidth = this.getBBox().width / 2;
                    return xPos + widthCheck - tWidth - (secWidth / 2);
                })
                // .attr("x", function(d) {
                //     var xPos = x(d.names) + (barWidth * i) + (barSpace * i);
                //     var widthCheck = (width / data.length) / 2;
                //     return xPos + widthCheck - (barWidth / 2) - (secWidth / 2);
                // })
                .attr("y", function(d) {
                    return y(d.value[i]) - textGap;
                })
                .attr('text-anchor', 'center')
        }
    }

}]);
