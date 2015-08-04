function Block$827(start$828, end$829) {
    this.start = start$828;
    this.end = end$829;
}
Block$827.prototype.clone = function () {
    return new Block$827(this.start, this.end);
};
Block$827.prototype.subtract = function (subtrahend$830) {
    var nonoverlapping$831 = subtrahend$830.start > this.end || subtrahend$830.end < this.start;
    return nonoverlapping$831 ? [this.clone()] : [
        new Block$827(this.start, subtrahend$830.start),
        new Block$827(subtrahend$830.end, this.end)
    ].filter(function (b$836) {
        return b$836.end > b$836.start;
    });
};
Block$827.prototype.toObject = function () {
    return {
        start: this.start,
        end: this.end
    };
};
module.exports = Block$827;