var moment$827 = require('moment');
var identity$828 = require('lodash.identity');
var range$829 = require('lodash.range');
var Block$830 = require('./block.js');
var Rule$831 = require('./rule.js');
var BlockArray$832 = require('./block-array.js');
function defaultWeek$833(x$835) {
    return x$835 && !Array.isArray(x$835) ? range$829(x$835, x$835 + 7, 0) : x$835;
}
function freebusy$834(args$836) {
    // defaults
    args$836.events = args$836.events || [];
    args$836.startOfDay = defaultWeek$833(args$836.startOfDay);
    args$836.endOfDay = defaultWeek$833(args$836.endOfDay);
    var rules$837 = args$836.rules ? args$836.rules.map(Rule$831.fromObject) : [Rule$831.true];
    var busyEvents$844 = args$836.events.filter(function (event$847) {
        return rules$837.some(function (a$848) {
            return a$848.match(event$847);
        });
    });
    var freeDays$845 = // create free days from start till end
    BlockArray$832.days(args$836.start, args$836.end).getBlocks().map(args$836.startOfDay || args$836.endOfDay ? function (day$849) {
        var startDate$850 = day$849.getStart();
        var day$849 = (startDate$850.getDay() + 6) % 7;
        var // rotate number to use Sun as beginning of week
        startOfDay$851 = args$836.startOfDay && args$836.startOfDay[day$849] || 0;
        var endOfDay$852 = args$836.endOfDay && args$836.endOfDay[day$849] || 24;
        var truncatedStart$853 = moment$827(startDate$850).add(startOfDay$851, 'hours').toDate();
        var truncatedEnd$854 = moment$827(startDate$850).add(endOfDay$852, 'hours').toDate();
        return new Block$830(truncatedStart$853, truncatedEnd$854);
    } : identity$828);
    var // reduce freeDays by busy events
    // returning this full expression directly breaks sweetjs!
    finalFreeTime$846 = busyEvents$844.reduce(function (remainingTime$855, nextEvent$856) {
        return remainingTime$855.subtract(new Block$830(nextEvent$856.start, nextEvent$856.end));
    }, new BlockArray$832(freeDays$845));
    return finalFreeTime$846.toObject();
}
module.exports = freebusy$834;