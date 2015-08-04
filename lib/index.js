var moment$827 = require('moment');
var Block$828 = require('./block.js');
var BlockArray$829 = require('./block-array.js');
function freebusy$830(start$831, end$832, events$833, rules$834) {
    events$833 = events$833 || [];
    rules$834 = rules$834 || [];
    var freeDays$835 = BlockArray$829.days(start$831, end$832);
    events$833.forEach(function (event$836) {
        freeDays$835 = freeDays$835.subtract(new Block$828(event$836.start, event$836.end));
    });
    return freeDays$835.toObject();
}
module.exports = freebusy$830;