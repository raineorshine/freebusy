var moment$827 = require('moment');
var Block$828 = require('./block.js');
var Rule$829 = require('./rule.js');
var BlockArray$830 = require('./block-array.js');
function freebusy$831(args$832) {
    args$832.events = args$832.events || [];
    var rules$833 = args$832.rules ? args$832.rules.map(Rule$829.fromObject) : [Rule$829.true];
    var busyEvents$840 = args$832.events.filter(function (event$843) {
        return rules$833.some(function (a$844) {
            return a$844.match(event$843);
        });
    });
    var freeDays$841 = BlockArray$830.days(args$832.start, args$832.end);
    var remainingTime$842 = busyEvents$840.reduce(function (remainingTime$845, nextEvent$846) {
        return remainingTime$845.subtract(new Block$828(nextEvent$846.start, nextEvent$846.end));
    }, freeDays$841);
    return remainingTime$842.toObject();
}
module.exports = freebusy$831;