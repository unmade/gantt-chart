'use strict';

function testData() {
    var startDate = Date.parse('2012-01-01T00:30:00'),
        id = 0,
        classes = ['success', 'danger', 'warning', 'info', 'default'];

    return {
        getItem: getItem,
        getItems: getItems,
        getRandomItems: getRandomItems
    }

    function getItem() {
        return {
            id: id++,
            lane: 2,
            start: startDate + 180000,
            end: startDate + 524000,
            tooltip: "второй",
            class: 'success',
            sublane: 0
        }
    }

    function getItems(n) {
        var items = [],
            i,
            N = n || 1;

        for (i = 0; i < N; i++) {
            items.push({
                id: id++,
                lane: 0,
                start: startDate + 180000,
                end: startDate + 444000,
                tooltip: getTooltip,
                class: 'danger',
                sublane: 0
            });
            startDate += 1800000;
        }

        startDate = Date.parse('2012-01-01T00:30:00');

        for (i = N; i < 2*N; i++) {
            items.push({
                id: id++,
                lane: 2,
                start: startDate + 180000,
                end: startDate + 524000,
                tooltip: getTooltip,
                class: 'success',
                sublane: 0
            });
            startDate += 1800000;
        }

        startDate = Date.parse('2012-01-01T00:30:00');

        for (i = 2*N; i < 3*N; i++) {
            items.push({
                id: id++,
                lane: 0,
                start: startDate,
                end: startDate + 389000,
                tooltip: getTooltip,
                class: 'success',
                sublane: 1
            });
            startDate += 1800000;
        }

        return items;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomItems(n) {
        var items = [],
            i,
            N = n || 1;

        for (i = 0; i < N; i++) {
            items.push({
                id: id++,
                lane: getRandomInt(0, 5),
                start: startDate + 180000,
                end: startDate + 444000,
                tooltip: getTooltip,
                class: classes[getRandomInt(0, classes.length)],
                sublane: 0
            });
            startDate += 1800000;
        }

        return items;
    }

    function getTooltip() {
        return '<h4>Item #' + this.id + '</h4>' +
               '<table class="gantt-tooltip-table">' +
               '  <tr><td class="text-right">Start:</td><td>' + new Date(this.start) + '</td></tr>' +
               '  <tr><td class="text-right">End:</td><td>' + new Date(this.end) + '</td></tr>' +
               '  <tr><td class="text-right">Class:</td><td>' + this.class + '</td></tr>' +
               '</table>'

    }
}
