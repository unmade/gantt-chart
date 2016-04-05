'use strict';


describe('test the Gantt Chart', function() {
    var gantt,
        conf;

    beforeEach(function() {
        var margin = {top: 0, right: 1, bottom: 2, left: 3};
        conf = {
            items: testData().getItems(),
            isAutoResize: false,
            isEnableDrag: false,
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
        gantt = ganttChart(conf);
    });

    afterEach(function() {
        d3.selectAll('svg').remove();
    });

    it('should check defaults values', function() {
        var translate = 'translate(' + conf.margin.left + ',' + conf.margin.top + ')';
        expect(gantt.autoresize()).toBe(conf.isAutoResize);
        expect(gantt.enableDrag()).toBe(conf.isEnableDrag);
        expect(gantt.enableTooltip()).toBe(conf.isEnableTooltip);
        expect(gantt.enableZoom()).toBe(conf.isEnableZoom);
        expect(gantt.chart()).not.toBe(undefined);
        expect(gantt.items().length).toBe(conf.items.length);
        expect(gantt.lanes().length).toBe(conf.items.length);
        expect(gantt.margin()).toEqual(conf.margin);
        expect(d3.select('svg g.main').attr('transform')).toEqual(translate);
        expect(gantt.showLaneLabel()).toBe(conf.isShowLaneLabel);
        expect(gantt.showXGrid()).toBe(conf.isShowXGrid);
        expect(gantt.showYGrid()).toBe(conf.isShowYGrid);
        expect(gantt.size()).toEqual([conf.width, conf.height]);
        expect(gantt.size()).toEqual(getSize());
        expect(gantt.sublanes()).toBe(conf.sublanes);
        expect(gantt.svg()).not.toBe(undefined);
        expect(gantt.renderTo()).toEqual(conf.renderTo);
        expect(typeof d3.select(window).on('resize')).toBe('undefined');
        expect(typeof gantt.xAxis()).toEqual('function');
        expect(typeof gantt.xScale()).toEqual('function');
        expect(typeof gantt.yAxis()).toEqual('function');
        expect(typeof gantt.yScale()).toEqual('function');
        expect(typeof gantt.zoom()).toEqual('function');
        expect(gantt.zoom().on("zoom")).toBe(undefined);
        expect(getRects()[0].__onclick).toBe(undefined);
    });

});
