var moment$827 = require('moment');
var Block$828 = require('./block.js');
var Rule$829 = require('./rule.js');
var BlockArray$830 = require('./block-array.js');
function freebusy$831(start$832, end$833, events$834, rules$835) {
    events$834 = events$834 || [];
    rules$835 = rules$835 ? rules$835.map(Rule$829.fromObject) : [Rule$829.true];
    var busyEvents$842 = events$834.filter(function (event$845) {
        return rules$835.some(function (a$846) {
            return a$846.match(event$845);
        });
    });
    var freeDays$843 = BlockArray$830.days(start$832, end$833);
    var remainingTime$844 = busyEvents$842.reduce(function (remainingTime$847, nextEvent$848) {
        return remainingTime$847.subtract(new Block$828(nextEvent$848.start, nextEvent$848.end));
    }, freeDays$843);
    return remainingTime$844.toObject();
}
module.exports = freebusy$831;