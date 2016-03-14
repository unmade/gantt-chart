'use strict';

function getChart() {
    return d3.select('svg g.main');
}

function getRects() {
    return d3.selectAll('svg g.main rect')[0];
}

function getSize() {
    return [
        parseInt(d3.select('svg').attr('width')),
        parseInt(d3.select('svg').attr('height'))
    ];
}
