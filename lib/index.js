var moment$827 = require('moment');
var identity$828 = require('lodash.identity');
var Block$829 = require('./block.js');
var Rule$830 = require('./rule.js');
var BlockArray$831 = require('./block-array.js');
function freebusy$832(args$833) {
    // defaults
    args$833.events = args$833.events || [];
    var rules$834 = args$833.rules ? args$833.rules.map(Rule$830.fromObject) : [Rule$830.true];
    var busyEvents$841 = args$833.events.filter(function (event$844) {
        return rules$834.some(function (a$845) {
            return a$845.match(event$844);
        });
    });
    var // create free days from start till end
    freeDays$842 = BlockArray$831.days(args$833.start, args$833.end, args$833.startOfDay, args$833.endOfDay);
    var // reduce freeDays by busy events
    // returning this full expression directly breaks sweetjs!
    finalFreeTime$843 = busyEvents$841.reduce(function (remainingTime$846, nextEvent$847) {
        return remainingTime$846.subtract(new Block$829(nextEvent$847.start, nextEvent$847.end));
    }, freeDays$842);
    return finalFreeTime$843.toObject();
}
module.exports = freebusy$832;