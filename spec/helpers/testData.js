'use strict';

function testData() {
    return {
        getItem: getItem,
        getItems: getItems
    }

    function getItem() {
        var startDate = Date.parse('2012-01-01T00:30:00'),
            i;

        return {
            id: 100,
            lane: 2,
            start: startDate + 180000,
            end: startDate + 524000,
            tooltip: "второй",
            class: 'success',
            sublane: 0
        }
    }

    function getItems() {
        var items = [],
            startDate = Date.parse('2012-01-01T00:30:00'),
            i,
            N = 1;

        for (i = 0; i < N; i++) {
            items.push({
                id: i,
                lane: 0,
                start: startDate + 180000,
                end: startDate + 444000,
                tooltip: "первый",
                class: 'danger',
                sublane: 0
            });
            startDate += 1800000;
        }

        startDate = Date.parse('2012-01-01T00:30:00');

        for (i = N; i < 2*N; i++) {
            items.push({
                id: i,
                lane: 2,
                start: startDate + 180000,
                end: startDate + 524000,
                tooltip: "второй",
                class: 'success',
                sublane: 0
            });
            startDate += 1800000;
        }

        startDate = Date.parse('2012-01-01T00:30:00');

        for (i = 2*N; i < 3*N; i++) {
            items.push({
                id: i,
                lane: 0,
                start: startDate,
                end: startDate + 389000,
                tooltip: "третий",
                class: 'success',
                sublane: 1
            });
            startDate += 1800000;
        }

        return items;
    }
}
