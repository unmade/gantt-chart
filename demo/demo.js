'use strict';


$(document).ready(function() {
    var xAxis,
        localeFormatter, tickFormat,
        gantt = ganttChart({
            items: testData().getItems()
        });

    xAxis = gantt.getXAxis();

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
        "months": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        "shortMonths": ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Ноя", "Дек"]
    });

    tickFormat = localeFormatter.timeFormat.multi([
        ["%H:%M", function(d) { return d.getMinutes(); }],
        ["%H:%M", function(d) { return d.getHours(); }],
        ["%d.%m.%Y", function(d) { return d.getDay() && d.getDate() != 1; }],
        ["%d.%m.%Y", function(d) { return d.getDate() != 1; }],
        ["%B", function(d) { return d.getMonth(); }],
        ["%Y", function() { return true; }]
    ]);

    xAxis.tickFormat(tickFormat);

});
