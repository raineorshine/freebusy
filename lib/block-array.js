var moment$827 = require('moment');
var range$828 = require('lodash.range');
var Block$829 = require('./block.js');
function defaultWeek$830(x$832) {
    return x$832 && !Array.isArray(x$832) ? range$828(x$832, x$832 + 7, 0) : x$832;
}
function BlockArray$831(blocks$833) {
    this.blocks = blocks$833 || [];
}
BlockArray$831.prototype.subtract = function (subtrahend$834) {
    return new BlockArray$831(Array.prototype.concat.apply([], this.blocks.map(function (a$837) {
        return a$837.subtract(subtrahend$834);
    })));
};
BlockArray$831.prototype.toObject = function () {
    return this.blocks.map(function (a$840) {
        return a$840.toObject();
    });
};
BlockArray$831.prototype.getBlocks = function () {
    return Array.prototype.slice.call(this.blocks);
};
BlockArray$831.days = function (startDate$841, endDate$842, startOfDay$843, endOfDay$844) {
    startOfDay$843 = defaultWeek$830(startOfDay$843 || 0);
    endOfDay$844 = defaultWeek$830(endOfDay$844 || 24);
    var blocks$845 = [];
    var current$846 = moment$827(startDate$841);
    while (current$846 < endDate$842) {
        var day$847 = (current$846.day() + 6) % 7;
        var // rotate number to use Sun as beginning of week
        start$848 = current$846.clone().add(startOfDay$843[day$847], 'hours');
        var end$849 = current$846.clone().add(endOfDay$844[day$847], 'hours');
        blocks$845.push(new Block$829(start$848.toDate(), end$849.toDate()));
        current$846 = current$846.clone().add(1, 'days');
    }
    return new BlockArray$831(blocks$845);
};
module.exports = BlockArray$831;