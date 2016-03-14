'use strict';

var gantt,
    data,
    zoom = true,
    autoresize = true,
    showLaneLabel = true,
    showTooltip = true,
    showXGrid = true,
    showYGrid = true;

(function init() {
    var xAxis,
        localeFormatter,
        tickFormat;

    data = testData();
    gantt = ganttChart({
        items: data.getItems()
    });

    xAxis = gantt.xAxis();

    localeFormatter = d3.locale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["€", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%d.%m.%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        "shortDays": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        "months": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                   "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        "shortMonths": ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Ноя", "Дек"]
    });

    tickFormat = localeFormatter.timeFormat.multi([
        ["%H:%M", function(d) { return d.getMinutes(); }],
        ["%d.%m.%Y", function(d) { return d.getHours(); }],
        ["%d.%m.%Y", function(d) { return d.getDay() && d.getDate() != 1; }],
        ["%d.%m.%Y", function(d) { return d.getDate() != 1; }],
        ["%B", function(d) { return d.getMonth(); }],
        ["%Y", function() { return true; }]
    ]);

    xAxis.tickFormat(tickFormat);
})();

function getElemAndSetText(id, text) {
    var elem = document.getElementById(id);
    elem.textContent = text;
}

function setAutoresize() {
    gantt.autoresize(autoresize = !autoresize);
    getElemAndSetText('autoresize', (autoresize) ? 'Turn autoresize off' : 'Turn autoresize on');
}

function toggleLaneLabels() {
    gantt.showLaneLabel(showLaneLabel = !showLaneLabel);
    getElemAndSetText('showLaneLabel', (showLaneLabel) ? 'Hide lane labels' : 'Show lane labels');
}

function toggleTooltip() {
    gantt.showTooltip(showTooltip = !showTooltip);
    getElemAndSetText('showTooltip', (showTooltip) ? 'Disable tooltip' : 'Enable tooltip');
}

function toggleXGrid() {
    gantt.showXGrid(showXGrid = !showXGrid);
    getElemAndSetText('showXGrid', (showXGrid) ? 'Hide X grid' : 'Show X grid');
}

function toggleYGrid() {
    gantt.showYGrid(showYGrid = !showYGrid);
    getElemAndSetText('showYGrid', (showYGrid) ? 'Hide Y grid' : 'Show Y grid');
}

function toggleZoom() {
    gantt.enableZoom(zoom = !zoom);
    getElemAndSetText('zoom', (zoom) ? 'Disable zoom' : 'Enable zoom');
}
