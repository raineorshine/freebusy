var _$827 = require('lodash');
function Rule$828(args$829) {
    args$829 = args$829 || {};
    this.field = args$829.field;
    this.value = args$829.value;
    this.conditionType = args$829.conditionType || 'exact';
    this.caseSensitive = 'caseSensitive' in args$829 ? args$829.caseSensitive : false;
    this.exceptions = args$829.exceptions || [];
}
Rule$828.prototype.match = function (event$830) {
    var that$831 = this;
    function isMatch$832(x$835, y$836) {
        if (typeof y$836 === 'string' && !that$831.caseSensitive) {
            x$835 = x$835.toLowerCase();
            y$836 = y$836.toLowerCase();
        }
        return y$836 instanceof RegExp ? y$836.test(x$835) : that$831.conditionType === 'exact' ? x$835 === y$836 : that$831.conditionType === 'startsWith' ? _$827.startsWith(x$835, y$836) : that$831.conditionType === 'endsWith' ? _$827.endsWith(x$835, y$836) : that$831.conditionType === 'contains' ? _$827.contains(x$835, y$836) : new Error('Invalid conditionType: ' + that$831.conditionType);
    }
    return isMatch$832(event$830[this.field], this.value) && !// current rule is a match and
    this.exceptions.some(function (a$837) {
        return a$837.match(event$830);
    });
};
module.exports = Rule$828;