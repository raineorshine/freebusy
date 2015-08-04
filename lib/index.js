var moment$827 = require('moment');
function Event$828() {
}
function Rule$829() {
}
function Block$830(start$833, end$834) {
    this.start = start$833;
    this.end = end$834;
}
Block$830.prototype.subtract = function (subtrahend$835) {
    return [
        new Block$830(this.start, subtrahend$835.start),
        new Block$830(subtrahend$835.end, this.end)
    ].filter(function (b$840) {
        return b$840.end > b$840.start;
    });
};
Block$830.prototype.toObject = function () {
    return {
        start: this.start,
        end: this.end
    };
};
function BlockArray$831() {
    this.blocks = [];
}
BlockArray$831.prototype.subtract = function (subtrahend$841) {
    return this.blocks.map(function (minuend$846) {
        return minuend$846.subtract(subtrahend$841);
    }).filter(function (b$847) {
        return b$847.end > b$847.start;
    });
};
BlockArray$831.prototype.toObject = function () {
    return this.blocks.map(function (a$850) {
        return a$850.toObject();
    });
};
BlockArray$831.days = function (start$851, end$852) {
    var blockArray$853 = new BlockArray$831();
    var current$854 = moment$827(start$851);
    while (current$854 < end$852) {
        var next$855 = current$854.clone().add(1, 'days');
        blockArray$853.blocks.push(new Block$830(current$854.toDate(), next$855.toDate()));
        current$854 = next$855;
    }
    return blockArray$853;
};
function freebusy$832(start$856, end$857, events$858, rules$859) {
}
freebusy$832.Event = Event$828;
freebusy$832.Block = Block$830;
freebusy$832.BlockArray = BlockArray$831;
freebusy$832.Rule = Rule$829;
module.exports = freebusy$832;