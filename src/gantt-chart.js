'use strict';

var ganttChart = function(conf) {
    var self = {},
        toStr = Object.prototype.toString,
        astr = "[object Array]",
        ostr = "[object Object]",
        chart, main, itemRects, tooltipDiv, xAxis, xScale, yAxis, yScale, zoom;

    self.items = null;
    self.lanes = null;
    self.renderTo = '#gantt_chart';
    self.sublanes = 1;

    self.isAutoResize = true;
    self.isEnableZoom = true;
    self.isShowXGrid = true;
    self.isShowYGrid = true;
    self.isShowLaneLabel = true;
    self.isShowTooltip = true;

    self.height = $(self.renderTo).height() || 480;
    self.width = $(self.renderTo).width() || 640;
    self.margin = {
        top: 20,
        right: 15,
        bottom: 20,
        left: 20
    };

    (function init() {
        copySameProp(self, conf);

        self.items = self.items || [];
        self.lanes = self.lanes || [];
        self.lanes.length = getLaneLength();

        build();
        enableZoom(self.isEnableZoom);
        autoresize(self.isAutoResize);
        showTooltip(self.isShowTooltip);
        showLaneLabel(self.isShowLaneLabel);
        showXGrid(self.isShowXGrid);
        showYGrid(self.isShowYGrid);
        redraw();
    })();

    function addItems(newItems) {
        var itemsType = toStr.call(newItems);
        if (itemsType !== astr && itemsType !== ostr) throwError('Expected object or array. Got: ' + itemsType);
        (itemsType === astr) ? self.items = self.items.concat(newItems) : self.items.push(newItems);
        onItemsChange();
    }

    function autoresize(isAutoResize) {
        if (!arguments.length) return self.isAutoResize;
        d3.select(window).on('resize', (isAutoResize !== false) ? resize : null);
        self.isAutoResize = isAutoResize;
    }

    function build() {
        var laneLength = self.lanes.length,
            marginWidth = getMarginWidth(),
            marginHeight = getMarginHeight();

        chart = d3.select(self.renderTo)
            .append("svg")
            .attr("width", self.width)
            .attr("height", self.height)
            .attr("class", "chart");

        chart.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", marginWidth)
            .attr("height", marginHeight);

        main = chart.append("g")
            .attr("transform", "translate(" + self.margin.bottom + "," + self.margin.top + ")")
            .attr("width", marginWidth)
            .attr("height", marginHeight)
            .attr("class", "main");

        itemRects = main.append("g")
            .attr("clip-path", "url(#clip)");

        tooltipDiv = d3.select("body").append("div")
            .attr("class", "gantt-tooltip")
            .style("opacity", 0);

        xScale = d3.time.scale()
            .domain(getTimeDomain())
            .range([0, marginWidth]);

        yScale = d3.scale.linear()
            .domain([0, laneLength])
            .range([0, marginHeight]);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(5)

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(laneLength)
            .tickFormat("");

        zoom = d3.behavior.zoom()
            .x(xScale);

        main.append('g')
            .attr('transform', 'translate(0,' + marginHeight + ')')
            .attr('class', 'main axis date')
            .call(xAxis)

        main.append('g')
            .attr('class', 'main axis lane')
            .call(yAxis);

        main.append('g')
            .attr('class', 'laneLabels');

        chart.call(zoom);

        chart.on("click", function(d) {
            if (!self.isShowTooltip) return;
            if (!$(event.target).closest('svg rect').length) {
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            }
        });
    }

    function copySameProp(copyTo, copyFrom) {
        var p;

        for (p in copyFrom) {
            if (copyTo.hasOwnProperty(p)) {
                if (toStr.call(copyFrom[p]) === ostr) {
                    copySameProp(copyTo[p], copyFrom[p]);
                }
                else {
                    copyTo[p] = copyFrom[p];
                }
            }
        }
    }

    function enableZoom(isEnableZoom) {
        if (!arguments.length) return self.isEnableZoom;
        zoom.on("zoom", (isEnableZoom) ? redraw : null);
        self.isEnableZoom = isEnableZoom;
    }

    function getLaneLength() {
        return (d3.max(self.items, function(d) { return d.lane }) + 1) || 0;
    }

    function getMarginWidth() {
        return self.width - self.margin.right - self.margin.left;
    }

    function getMarginHeight() {
        return self.height - self.margin.top - self.margin.bottom;
    }

    function getTimeDomain() {
        return [
            d3.min(self.items, function(d) { return d.start }),
            d3.max(self.items, function(d) { return d.end })
        ];
    }

    function items(newItems) {
        var itemsType = toStr.call(newItems);

        if (!arguments.length) return self.items;
        if (itemsType !== astr) throwError('Expected array. Got: ' + itemsType);
        self.items = newItems;

        onItemsChange();
    }

    function lanes(newLanes) {
        var lanesType = toStr.call(newLanes);
        if (!arguments.length) return self.lanes;
        if (lanesType !== astr) throwError('Expected array. Got: ' + lanesType);
        self.lanes = newLanes;
        self.lanes.length = getLaneLength() || self.lanes.length;
        showLaneLabel(!self.isShowLaneLabel);
        showLaneLabel(!self.isShowLaneLabel);
    }

    function margin(newMargin) {
        var msg = "Some of the margin value is incorrect. All numbers should be type of number";
        if (!arguments.length) return self.margin;
        self.margin.top = (typeof newMargin.top === 'number') ? newMargin.top : throwError(msg);
        self.margin.right = (typeof newMargin.right === 'number') ? newMargin.right : throwError(msg);
        self.margin.bottom = (typeof newMargin.bottom === 'number') ? newMargin.bottom : throwError(msg);
        self.margin.left = (typeof newMargin.left === 'number') ? newMargin.left : throwError(msg);

        resize();
    }

    function onItemsChange() {
        var laneLength = getLaneLength();
        self.lanes.length = laneLength;
        xScale.domain(getTimeDomain());
        yAxis.ticks(laneLength);
        yScale.domain([0, laneLength]);
        zoom.x(xScale);
        redraw();
    }

    function redraw() {
        var itemHeight = getMarginHeight() / (self.lanes.length || 1) / (self.sublanes || 1),
            rects;

        rects = itemRects.selectAll("rect")
            .data(self.items, function (d) { return d.id; })
            .attr("x", function (d) { return xScale(d.start); })
            .attr("y", function (d) {
                return (self.sublanes < 2) ? yScale(d.lane) : yScale(d.lane) + d.sublane*itemHeight;
            })
            .attr("width", function (d) { return xScale(d.end) - xScale(d.start); })
            .attr("height", function (d) { return itemHeight; })
            .on("click", (self.isShowTooltip) ? tooltip : null);
        rects.enter().append("rect")
            .attr("class", function (d) { return d.class + ' main'; })
            .attr("x", function (d) { return xScale(d.start); })
            .attr("y", function (d) {
                return (self.sublanes < 2) ? yScale(d.lane) : yScale(d.lane) + d.sublane*itemHeight;
            })
            .attr("width", function (d) { return xScale(d.end) - xScale(d.start); })
            .attr("height", function (d) { return  itemHeight; })
            .attr("opacity", .75)
            .on("click", (self.isShowTooltip) ? tooltip : null);
        rects.exit().remove();

        main.select('g.main.axis.date').call(xAxis);
        main.select('g.main.axis.lane').call(yAxis);
    }

    function resize() {
        if (self.isAutoResize) {
            self.width = $(self.renderTo).width();
            self.height = $(self.renderTo).height();
        }
        var marginWidth = getMarginWidth(),
            marginHeight = getMarginHeight();

        xScale.range([0, marginWidth]);
        yScale.range([0, marginHeight]);
        chart.attr("width", self.width);
        chart.attr("height", self.height);
        chart.select('defs').select('clipPath').select('rect').attr("width", marginWidth);
        chart.select('defs').select('clipPath').select('rect').attr("height", marginWidth);
        main.attr("width", marginWidth);
        main.attr("height", marginHeight);

        main.select('g.main.axis.date')
            .attr('transform', 'translate(0,' + getMarginHeight() + ')');

        main.select('g.laneLabels')
            .selectAll(".laneText")
            .data(self.lanes)
            .attr("y", function(d, i) {return yScale(i + .5);})

        zoom.x(xScale);

        showXGrid(self.isShowYGrid);
        showYGrid(self.isShowYGrid);

        redraw();
    }

    function showLaneLabel(isShowLaneLabel) {
        if (!arguments.length) return self.isShowLaneLabel;
        self.isShowLaneLabel = isShowLaneLabel;
        if (isShowLaneLabel === false) {
            main.selectAll(".laneText").remove();
            return;
        }

        main.select('g.laneLabels').selectAll(".laneText")
            .data(self.lanes)
            .enter().append("text")
            .text(function(d) {return d;})
            .attr("x", -self.margin.right)
            .attr("y", function(d, i) {return yScale(i + .5);})
            .attr("dy", ".5ex")
            .attr("text-anchor", "start")
            .attr("class", "laneText");
    }

    function showTooltip(isShowTooltip) {
        if (!arguments.length) return self.isShowTooltip;
        self.isShowTooltip = isShowTooltip;
        redraw();
    }

    function tooltip(d) {
        tooltipDiv.transition()
            .duration(200)
            .style("opacity", .9);
        tooltipDiv.html((typeof d.tooltip === 'function') ? d.tooltip() : d.tooltip)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
    }

    function throwError(msg) {
        throw TypeError(msg);
    }

    function showXGrid(isShowXGrid) {
        if (!arguments.length) return self.isShowXGrid;
        var height = (isShowXGrid !== false) ? -getMarginHeight() : -6;
        xAxis.tickSize(height, 0, 0);
        self.isShowXGrid = isShowXGrid;
        main.select('g.main.axis.date').call(xAxis);
    }

    function showYGrid(isShowYGrid) {
        if (!arguments.length) return self.isShowYGrid;
        var width = (isShowYGrid !== false) ? -getMarginWidth() : -6;
        yAxis.tickSize(width, 0, 0);
        self.isShowYGrid = isShowYGrid;
        main.select('g.main.axis.lane').call(yAxis);
    }

    function size(width, height) {
        if (!arguments.length) return [self.width, self.height];
        self.width = parseInt(width) || self.width;
        self.height = parseInt(height) || self.height;
        autoresize(false);
        resize();
    }

    function sublanes(newSublanes) {
        if (!arguments.length) return self.sublanes;
        self.sublanes = newSublanes;
        redraw();
    }

    return {
        addItems: addItems,
        autoresize: autoresize,
        enableZoom: enableZoom,
        chart: function() { return main },
        items: items,
        lanes: lanes,
        margin: margin,
        showLaneLabel: showLaneLabel,
        showTooltip: showTooltip,
        showXGrid: showXGrid,
        showYGrid: showYGrid,
        size: size,
        sublanes: sublanes,
        svg: function() { return chart },
        redraw: redraw,
        renderTo: function() { return self.renderTo },
        resize: resize,
        xAxis: function() { return xAxis },
        xScale: function() { return xScale },
        yScale: function() { return yScale },
        yAxis: function() { return yAxis },
        zoom: function() { return zoom },
    }
}
