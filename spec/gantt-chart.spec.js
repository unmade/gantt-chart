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

    function getRects() {
        return d3.selectAll('svg g.main rect')[0];
    }

    describe('the svg', function() {
        it('should create svg', function() {
            expect(d3.select('svg')).not.toBeNull();
            expect(d3.select('svg g.main')).not.toBeNull();
            expect(d3.select('svg g.main.axis.date')).not.toBeNull();
            expect(d3.select('svg g.main.axis.lane')).not.toBeNull();
        });

        it('should check defaults values', function() {
            expect(gantt.getItems().length).toBe(0);
            expect(gantt.getLanes().length).toBe(0);
            expect(gantt.getSublanes()).toBe(1);
            expect(gantt.isAutoResize()).toBe(true);
            expect(gantt.isEnableZoom()).toBe(true);
            expect(gantt.isShowXGrid()).toBe(true);
            expect(gantt.isShowYGrid()).toBe(true);
            expect(gantt.isShowLaneLabel()).toBe(true);
            expect(gantt.isTooltip()).toBe(true);
            expect(gantt.renderTo()).toEqual('#gantt_chart');
        });

        it('should add item', function() {
            gantt.addItem(testData().getItem());
            expect(gantt.getItems().length).toBe(1);
            expect(getRects().length).toBe(1);
        });

        it('should add items', function() {
            gantt.addItems(testData().getItems());
            expect(gantt.getItems().length).toBe(3);
            expect(getRects().length).toBe(3);
        });

        it('should disable zoom and then enable again', function() {
            // TODO: check "zoom.on("zoom", null)"
            gantt.enableZoom(false);
            expect(gantt.isEnableZoom()).toBe(false);
            gantt.enableZoom(true);
            expect(gantt.isEnableZoom()).toBe(true);
        });

        it('should get chart', function() {
            expect(gantt.getChart()).toEqual(d3.select('svg g.main'));
        });

        it('should get items', function() {
            expect(gantt.getItems()).toEqual([]);
        });

        it('should get lanes', function() {
            expect(gantt.getLanes()).toEqual([]);
        });

        it('should get margin', function() {
            var margin = gantt.getMargin();
            expect(margin.top).toBe(20);
            expect(margin.right).toBe(15);
            expect(margin.bottom).toBe(20);
            expect(margin.left).toBe(20);
        });

        it('should get size', function() {
            var size = gantt.getSize();
            expect(size[0]).toBe(parseInt(d3.select('svg').attr('width')));
            expect(size[1]).toBe(parseInt(d3.select('svg').attr('height')));
        });

        it('should get sublanes number', function() {
            expect(gantt.getSublanes()).toBe(1);
        });

        it('should get svg itself', function() {
            expect(gantt.getSvg()).toEqual(d3.select('svg'));
        });

        it('should get axes and scales', function() {
            expect(typeof gantt.getXAxis()).toEqual('function');
            expect(typeof gantt.getXScale()).toEqual('function');
            expect(typeof gantt.getYAxis()).toEqual('function');
            expect(typeof gantt.getYScale()).toEqual('function');
        });

        it('should set autoresize', function() {
            gantt.setAutoResize(false);
            expect(gantt.isAutoResize()).toBe(false);
            gantt.setAutoResize(true);
            expect(gantt.isAutoResize()).toBe(true);
        });

        it('should set items', function() {
            expect(gantt.getItems().length).toBe(0);
            gantt.setItems(testData().getItems());
            expect(gantt.getItems().length).toBe(3);
        });

        it('should set lanes', function() {
            gantt.setLanes(['1', '2']);
            expect(gantt.getLanes().length).toBe(2);
        });

        it('should set margin', function() {
            gantt.setMargin({top: 0, right: 1, bottom: 2, left: 3});
            var margin = gantt.getMargin();
            expect(margin.top).toBe(0);
            expect(margin.right).toBe(1);
            expect(margin.bottom).toBe(2);
            expect(margin.left).toBe(3);
        });

        it('should set size', function() {
            gantt.setSize(320, 240);
            var size = gantt.getSize();
            expect(size[0]).toBe(320);
            expect(size[1]).toBe(240);
        });

        it('should set sublanes', function() {
            gantt.setSublanes(4);
            expect(gantt.getSublanes()).toBe(4);
        });

        it('should set tooltip', function() {
            gantt.setTooltip(false);
            expect(gantt.isTooltip()).toBe(false);
            gantt.setTooltip(true);
            expect(gantt.isTooltip()).toBe(true);
        });

        it('should show/hide lane labels', function() {
            gantt.showLaneLabel(false);
            expect(gantt.isShowLaneLabel()).toBe(false);
            gantt.showLaneLabel(true);
            expect(gantt.isShowLaneLabel()).toBe(true);
        });

        it('should show/hide x grid', function() {
            var xAxis = gantt.getXAxis();
            gantt.showXGrid(false);
            expect(gantt.isShowXGrid()).toBe(false);
            expect(xAxis.tickSize()).toBe(-6);

            gantt.showXGrid(true);
            expect(gantt.isShowXGrid()).toBe(true);
            expect(xAxis.tickSize()).not.toBe(-6);
        });

        it('should show/hide y grid', function() {
            gantt.showYGrid(false);
            expect(gantt.isShowYGrid()).toBe(false);
            gantt.showYGrid(true);
            expect(gantt.isShowYGrid()).toBe(true);
        });

    });
});
