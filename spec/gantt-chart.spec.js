'use strict';


describe('test the Gantt Chart', function() {
    var gantt;

    beforeEach(function() {
        var container = document.createElement('div'),
            body = document.getElementsByTagName('body')[0];
        container.setAttribute('id', 'gantt_chart');
        body.appendChild(container);
        gantt = ganttChart();
    });

    afterEach(function() {
        d3.selectAll('svg').remove();
    });

    it('should check defaults values', function() {
        var margin = {top: 20, right: 15, bottom: 20, left: 20},
            translate = 'translate(' + margin.left + ',' + margin.top + ')';
        expect(gantt.autoresize()).toBe(true);
        expect(gantt.enableTooltip()).toBe(true);
        expect(gantt.enableZoom()).toBe(true);
        expect(gantt.chart()).not.toBe(undefined);
        expect(gantt.items().length).toBe(0);
        expect(gantt.lanes().length).toBe(0);
        expect(gantt.margin()).toEqual(margin);
        expect(d3.select('svg g.main').attr('transform')).toEqual(translate);
        expect(gantt.showLaneLabel()).toBe(true);
        expect(gantt.showXGrid()).toBe(true);
        expect(gantt.showYGrid()).toBe(true);
        expect(gantt.size()).toEqual(getSize());
        expect(gantt.sublanes()).toBe(1);
        expect(gantt.svg()).not.toBe(undefined);
        expect(gantt.renderTo()).toEqual('#gantt_chart');
        expect(typeof d3.select(window).on('resize')).toBe('function');
        expect(typeof gantt.xAxis()).toEqual('function');
        expect(typeof gantt.xScale()).toEqual('function');
        expect(typeof gantt.yAxis()).toEqual('function');
        expect(typeof gantt.yScale()).toEqual('function');
        expect(typeof gantt.zoom()).toEqual('function');
    });

    it('should add item', function() {
        var xDomain = gantt.xScale().domain(),
            yDomain = gantt.yScale().domain();
        gantt.addItems(testData().getItem());
        expect(gantt.items().length).toBe(1);
        expect(getRects().length).toBe(1);
        expect(gantt.lanes().length).toBe(3);
        expect(gantt.xScale().domain()).not.toEqual(xDomain);
        expect(gantt.yScale().domain()).not.toEqual(yDomain);
        expect(gantt.zoom().x()).toEqual(gantt.xScale());
    });

    it('should add items', function() {
        var xDomain = gantt.xScale().domain(),
            yDomain = gantt.yScale().domain();
        gantt.addItems(testData().getItems());
        expect(gantt.items().length).toBe(3);
        expect(getRects().length).toBe(3);
        expect(gantt.lanes().length).toBe(3);
        expect(gantt.xScale().domain()).not.toEqual(xDomain);
        expect(gantt.yScale().domain()).not.toEqual(yDomain);
        expect(gantt.zoom().x()).toEqual(gantt.xScale());
    });

    it('should throw error when incorrect items added', function() {
        function addIncorrectItems() { gantt.addItems(25); }
        expect(addIncorrectItems).toThrow(new TypeError('Expected object or array. Got: [object Number]'));
    });

    it('should set autoresize', function() {
        gantt.autoresize(false);
        expect(gantt.autoresize()).toBe(false);
        expect(d3.select(window).on('resize')).toBe(undefined);

        gantt.autoresize(true);
        expect(gantt.autoresize()).toBe(true);
        expect(d3.select(window).on('resize')).not.toBe(undefined);
    });

    it('should disable/enable tooltip', function() {
        gantt.items(testData().getItems());
        gantt.enableTooltip(false);

        expect(gantt.enableTooltip()).toBe(false);
        expect(getRects()[0].__onclick).toBe(undefined);

        gantt.enableTooltip(true);
        expect(gantt.enableTooltip()).toBe(true);
        expect(getRects()[0].__onclick).not.toBe(undefined);
    });

    it('should enable/disable zoom', function() {
        gantt.enableZoom(false);
        expect(gantt.enableZoom()).toBe(false);
        expect(gantt.zoom().on("zoom")).toBe(undefined);

        gantt.enableZoom(true);
        expect(gantt.enableZoom()).toBe(true);
        expect(gantt.zoom().on("zoom")).not.toBe(undefined);
    });

    it('should get chart', function() {
        expect(gantt.chart()).toEqual(getChart());
    });

    it('should set items', function() {
        gantt.addItems(testData().getItems());
        var xDomain = gantt.xScale().domain(),
            yDomain = gantt.yScale().domain();
        gantt.items([testData().getItem()]);
        expect(gantt.items().length).toBe(1);
        expect(getRects().length).toBe(1);
        expect(gantt.lanes().length).toBe(3);
        expect(gantt.xScale().domain()).not.toEqual(xDomain);
        expect(gantt.zoom().x()).toEqual(gantt.xScale());
    });

    it('should throw error of incorrect items set', function() {
        function addIncorrectItems() { gantt.items(25); }
        expect(addIncorrectItems).toThrow(new TypeError('Expected array. Got: [object Number]'));
    });

    it('should set new lanes', function() {
        var lanes = ['1', '2'];
        gantt.lanes(lanes);
        expect(gantt.lanes()).toEqual(lanes);
        expect(gantt.lanes().length).toBe(2);

        gantt.items(testData().getItems());
        expect(gantt.lanes().length).toBe(3);
    });

    it('should throw error of incorrect items type', function() {
        function addIncorrectLanes() { gantt.lanes(25); }
        expect(addIncorrectLanes).toThrow(new TypeError('Expected array. Got: [object Number]'));
    });

    it('should set margin', function() {
        var margin = {top: 0, right: 1, bottom: 2, left: 3},
            translate = 'translate(' + margin.left + ',' + margin.top + ')';
        gantt.margin(margin);
        expect(gantt.margin()).toEqual(margin);
        expect(getChart().attr('transform')).toEqual(translate);
        expect(+getChart().attr('width')).toEqual(getSize()[0] - margin.left - margin.right);
        expect(+getChart().attr('height')).toEqual(getSize()[1] - margin.top - margin.bottom);

        gantt.margin({bottom: 20});
        expect(gantt.margin().bottom).toEqual(20);
    });

    it('should throw error of incorrect margin', function() {
        var msg = "'Top' margin value is incorrect. All values should be numbers";
        function addIncorrectMargin() { gantt.margin({top: 'azaza'}); }
        expect(addIncorrectMargin).toThrow(new TypeError(msg));
    })

    it('should hide/show lane labes', function() {
        function getLaneLabels() {
            return d3.select('svg g.laneLabels').selectAll('text')[0];
        }
        gantt.lanes([1, 2]);
        gantt.showLaneLabel(false);
        expect(gantt.showLaneLabel()).toBe(false);
        expect(getLaneLabels().length).toBe(0);

        gantt.showLaneLabel(true);
        expect(gantt.showLaneLabel()).toBe(true);
        expect(getLaneLabels().length).toBe(2);
    });

    it('should hide/show the X grid', function() {
        function getAxisLine() {
            return d3.select('svg g.main.axis.date').selectAll('line')[0][0];
        }
        gantt.items(testData().getItems());
        gantt.showXGrid(false);
        expect(gantt.showXGrid()).toBe(false);
        expect(gantt.xAxis().tickSize()).toBe(-6);
        expect(getAxisLine().y2.baseVal.value).toBe(-6);

        gantt.showXGrid(true);
        expect(gantt.showXGrid()).toBe(true);
        expect(gantt.xAxis().tickSize()).toBe(-gantt.size()[1]+gantt.margin().top+gantt.margin().bottom);
        expect(getAxisLine().y2.baseVal.value).toBe(-gantt.size()[1]+gantt.margin().top+gantt.margin().bottom);
    });

    it('should hide/show the Y grid', function() {
        function getAxisLine() {
            return d3.select('svg g.main.axis.lane').selectAll('line')[0][0];
        }
        gantt.items(testData().getItems());
        gantt.showYGrid(false);
        expect(gantt.showYGrid()).toBe(false);
        expect(gantt.yAxis().tickSize()).toBe(-6);
        expect(getAxisLine().x2.baseVal.value).toBe(6);

        gantt.showYGrid(true);
        expect(gantt.showYGrid()).toBe(true);
        expect(gantt.yAxis().tickSize()).toBe(-gantt.size()[0]+gantt.margin().right+gantt.margin().left);
        expect(getAxisLine().x2.baseVal.value).toBe(gantt.size()[0]-gantt.margin().right-gantt.margin().left);
    });

    it('should get/set the size', function() {
        var size = gantt.size();
        expect(size).toEqual(getSize());
        gantt.size(320, 240);

        size = gantt.size();
        expect(size[0]).toBe(320);
        expect(size[1]).toBe(240);
        expect(size).toEqual(getSize());
        expect(gantt.autoresize()).toBe(false);

        gantt.size(640);
        size = gantt.size();
        expect(size[0]).toBe(640);
        expect(size[1]).toBe(240);
        expect(size).toEqual(getSize());

        gantt.size(0, 480);
        size = gantt.size();
        expect(size[0]).toBe(640);
        expect(size[1]).toBe(480);
        expect(size).toEqual(getSize());
    });

    it('should get/set sublanes', function() {
        expect(gantt.sublanes()).toBe(1);
        gantt.sublanes(4);
        expect(gantt.sublanes()).toBe(4);
    });

    it('should get svg element', function() {
        expect(gantt.svg()).toEqual(d3.select('svg'));
    });

    it('should test method chaining', function() {
        var data = testData(),
            margin = {top: 0, right: 1, bottom: 2, left: 3},
            conf = {
                items: data.getItems(),
                isAutoResize: false,
                isEnableTooltip: false,
                isEnableZoom: false,
                isShowXGrid: false,
                isShowYGrid: false,
                isShowLaneLabel: false,
                height: 240,
                lanes: [1, 2, 3],
                margin: margin,
                renderTo: 'body',
                sublanes: 2,
                width: 320,
            };
        var o = gantt.addItems(data.getItems())
            .autoresize(conf.isAutoResize)
            .enableTooltip(conf.isEnableTooltip)
            .enableZoom(conf.isEnableZoom)
            .items(data.getItems(10))
            .lanes(conf.lanes)
            .margin(margin)
            .showLaneLabel(conf.isShowLaneLabel)
            .showXGrid(conf.isShowXGrid)
            .showYGrid(conf.isShowYGrid)
            .size(conf.width, conf.height)
            .sublanes(conf.sublanes);

        expect(gantt.autoresize()).toBe(conf.isAutoResize);
        expect(gantt.enableTooltip()).toBe(conf.isEnableTooltip);
        expect(gantt.enableZoom()).toBe(conf.isEnableZoom);
        expect(gantt.items().length).toBe(30);
        expect(gantt.lanes().length).toBe(conf.items.length);
        expect(gantt.margin()).toEqual(conf.margin);
        expect(gantt.showLaneLabel()).toBe(conf.isShowLaneLabel);
        expect(gantt.showXGrid()).toBe(conf.isShowXGrid);
        expect(gantt.showYGrid()).toBe(conf.isShowYGrid);
        expect(gantt.size()).toEqual([conf.width, conf.height]);
        expect(gantt.sublanes()).toBe(conf.sublanes);
    });

});
