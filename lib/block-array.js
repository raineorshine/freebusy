var moment$827 = require('moment');
var Block$828 = require('./block.js');
function BlockArray$829(blocks$830) {
    this.blocks = blocks$830 || [];
}
BlockArray$829.prototype.subtract = function (subtrahend$831) {
    return new BlockArray$829(Array.prototype.concat.apply([], this.blocks.map(function (a$834) {
        return a$834.subtract(subtrahend$831);
    })));
};
BlockArray$829.prototype.toObject = function () {
    return this.blocks.map(function (a$837) {
        return a$837.toObject();
    });
};
BlockArray$829.prototype.getBlocks = function () {
    return Array.prototype.slice.call(this.blocks);
};
BlockArray$829.days = function (start$838, end$839) {
    var blockArray$840 = new BlockArray$829();
    var current$841 = moment$827(start$838);
    while (current$841 < end$839) {
        var next$842 = current$841.clone().add(1, 'days');
        blockArray$840.blocks.push(new Block$828(current$841.toDate(), next$842.toDate()));
        current$841 = next$842;
    }
    return blockArray$840;
};
module.exports = BlockArray$829;