'use strict';

var ganttChart = function(conf) {
    var self = {},
        chart, main, itemRects, xAxis, xScale, yAxis, yScale, zoom;

    self.items = null;
    self.lanes = null;
    self.renderTo = '#gantt_chart';
    self.sublanes = 1;

    self.isAutoResize = true;
    self.isEnableZoom = true;
    self.isShowXGrid = true;
    self.isShowYGrid = true;
    self.isShowLaneLabel = true;
    self.isTooltip = true;

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
        setAutoResize(self.isAutoResize);
        setTooltip(self.isTooltip);
        showLaneLabel(self.isShowLaneLabel);
        showXGrid(self.isShowXGrid);
        showYGrid(self.isShowYGrid);
        redraw();
    })();

    function addItem(item) {
        self.items.push(item);
        onItemsChange();
    }

    function addItems(newItems) {
        self.items = self.items.concat(newItems);
        onItemsChange();
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
            .tickSize(-6, 0, 0)
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
    }

    function copySameProp(copyTo, copyFrom) {
        var p,
            toStr = Object.prototype.toString,
            ostr = ['object Object'];

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
        if (isEnableZoom !== false) {
            zoom.on("zoom", redraw);
            chart.call(zoom);
        }
        else {
            zoom.on("zoom", null);
        }
        self.isEnableZoom = isEnableZoom;
    };

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

    function onItemsChange() {
        self.lanes.length = getLaneLength();
        xScale.domain(getTimeDomain());
        yScale.domain([0, self.lanes.length]);
        zoom.x(xScale);
        redraw();
        setTooltip(self.isTooltip);
    }

    function redraw() {
        var itemHeight = getMarginHeight() / (self.lanes.length || 1) / (self.sublanes || 1),
            rects;

        main.select('g.main.axis.date').call(xAxis);
        main.select('g.main.axis.lane').call(yAxis);

        rects = itemRects.selectAll("rect")
            .data(self.items, function (d) { return d.id; })
            .attr("x", function (d) { return xScale(d.start); })
            .attr("y", function (d) {
                return (self.sublanes < 2) ? yScale(d.lane) : yScale(d.lane) + d.sublane*itemHeight;
            })
            .attr("width", function (d) { return xScale(d.end) - xScale(d.start); })
            .attr("height", function (d) { return itemHeight; });
        rects.enter().append("rect")
            .attr("class", function (d) { return d.class + ' main'; })
            .attr("x", function (d) { return xScale(d.start); })
            .attr("y", function (d) {
                return (self.sublanes < 2) ? yScale(d.lane) : yScale(d.lane) + d.sublane*itemHeight;
            })
            .attr("width", function (d) { return xScale(d.end) - xScale(d.start); })
            .attr("height", function (d) { return  itemHeight; })
            .attr("opacity", .75);
        rects.exit().remove();
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

    function setAutoResize(isAutoResize) {
        d3.select(window).on('resize', (isAutoResize !== false) ? resize : null);
        self.isAutoResize = isAutoResize;
    }

    function setItems(items) {
        self.items = items;
        onItemsChange();
    }

    function setLanes(lanes) {
        self.lanes = lanes;
        self.lanes.length = getLaneLength() || self.lanes.length;
        showLaneLabel(!self.isShowLaneLabel);
        showLaneLabel(!self.isShowLaneLabel);
    }

    function setMargin(margin, isRedraw) {
        self.margin = margin;
        if (isRedraw === false) return;
        resize();
    }

    function setSize(width, height, isRedraw) {
        self.width = width || self.width;
        self.height = height || self.height;
        setAutoResize(false);
        if (isRedraw === false) return;
        resize();
    }

    function setSublanes(sublanes, isRedraw) {
        self.sublanes = sublanes;
        if (isRedraw === false) return;
        redraw();
    }

    function setTooltip(isTooltip) {
        self.isTooltip = isTooltip;
        if (isTooltip === false) return;

        $('svg.chart rect').on('click', function () {
            $('.gantt-tooltip').remove();
            if (this.classList[1] === 'main') {
                var d = this.__data__,
                    eOffset = $(this).offset(),
                    tooltip = '<div class="gantt-tooltip">' + d.tooltip + '</div>';
                $('body').append(tooltip);
                $('.gantt-tooltip').css({
                    'top': eOffset.top + this.height.baseVal.value + 5 + 'px',
                    'left': eOffset.left + 'px'
                });
            }
        });

        $(document).on('click', function (e) {
            if (!$(event.target).closest('svg rect').length) {
                $('.gantt-tooltip').remove();
            }
        });
    }

    function showLaneLabel(isShowLaneLabel) {
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

    function showXGrid(isShowXGrid, isRedraw) {
        var height = (isShowXGrid !== false) ? -getMarginHeight() : -6;
        xAxis.tickSize(height, 0, 0);
        self.isShowXGrid = isShowXGrid;
        if (isRedraw === false) return;
        redraw();
    }

    function showYGrid(isShowYGrid, isRedraw) {
        var width = (isShowYGrid !== false) ? -getMarginWidth() : -6;
        yAxis.tickSize(width, 0, 0);
        self.isShowYGrid = isShowYGrid;
        if (isRedraw === false) return;
        redraw();
    }


    return {
        addItem: addItem,
        addItems: addItems,
        enableZoom: enableZoom,
        getChart: function() { return main },
        getItems: function() { return self.items },
        getLanes: function() { return self.lanes },
        getMargin: function() { return self.margin },
        getSize: function() { return [self.width, self.height] },
        getSublanes: function() { return self.sublanes },
        getSvg: function() { return chart },
        getXAxis: function() { return xAxis },
        getXScale: function() { return xScale },
        getYAxis: function() { return yAxis },
        getYScale: function() { return yScale },
        isAutoResize: function() { return self.isAutoResize },
        isEnableZoom: function() { return self.isEnableZoom },
        isShowXGrid: function() { return self.isShowXGrid },
        isShowYGrid: function() { return self.isShowYGrid },
        isShowLaneLabel: function() { return self.isShowLaneLabel },
        isTooltip: function() { return self.isTooltip },
        renderTo: function() { return self.renderTo },
        redraw: redraw,
        setAutoResize: setAutoResize,
        setItems: setItems,
        setLanes: setLanes,
        setMargin: setMargin,
        setSize: setSize,
        setSublanes: setSublanes,
        setTooltip: setTooltip,
        showLaneLabel: showLaneLabel,
        showXGrid: showXGrid,
        showYGrid: showYGrid
    }
}
