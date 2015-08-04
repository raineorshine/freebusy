var moment$827 = require('moment');
function Event$828() {
}
function Rule$829() {
}
function Block$830(start$833, end$834) {
    this.start = start$833;
    this.end = end$834;
}
Block$830.prototype.clone = function () {
    return new Block$830(this.start, this.end);
};
Block$830.prototype.subtract = function (subtrahend$835) {
    var nonoverlapping$836 = subtrahend$835.start > this.end || subtrahend$835.end < this.start;
    return nonoverlapping$836 ? [this.clone()] : [
        new Block$830(this.start, subtrahend$835.start),
        new Block$830(subtrahend$835.end, this.end)
    ].filter(function (b$841) {
        return b$841.end > b$841.start;
    });
};
Block$830.prototype.toObject = function () {
    return {
        start: this.start,
        end: this.end
    };
};
function BlockArray$831(blocks$842) {
    this.blocks = blocks$842 || [];
}
BlockArray$831.prototype.subtract = function (subtrahend$843) {
    return new BlockArray$831(Array.prototype.concat.apply([], this.blocks.map(function (a$846) {
        return a$846.subtract(subtrahend$843);
    })));
};
BlockArray$831.prototype.toObject = function () {
    return this.blocks.map(function (a$849) {
        return a$849.toObject();
    });
};
BlockArray$831.days = function (start$850, end$851) {
    var blockArray$852 = new BlockArray$831();
    var current$853 = moment$827(start$850);
    while (current$853 < end$851) {
        var next$854 = current$853.clone().add(1, 'days');
        blockArray$852.blocks.push(new Block$830(current$853.toDate(), next$854.toDate()));
        current$853 = next$854;
    }
    return blockArray$852;
};
function freebusy$832(start$855, end$856, events$857, rules$858) {
}
freebusy$832.Event = Event$828;
freebusy$832.Block = Block$830;
freebusy$832.BlockArray = BlockArray$831;
freebusy$832.Rule = Rule$829;
module.exports = freebusy$832;