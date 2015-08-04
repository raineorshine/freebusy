var _$827 = require('lodash');
function Rule$828(args$829) {
    args$829 = args$829 || {};
    this.field = args$829.field;
    this.value = args$829.value;
    this.conditionType = args$829.conditionType || 'exact';
    this.caseSensitive = 'caseSensitive' in args$829 ? args$829.caseSensitive : false;
    this.exceptions = args$829.exceptions || [];
}
Rule$828.fromObject = function (args$830) {
    return new Rule$828(args$830);
};
Rule$828.prototype.match = function (event$831) {
    var that$832 = this;
    function isMatch$833(x$836, y$837) {
        if (typeof y$837 === 'string' && !that$832.caseSensitive) {
            x$836 = x$836.toLowerCase();
            y$837 = y$837.toLowerCase();
        }
        return y$837 instanceof RegExp ? y$837.test(x$836) : that$832.conditionType === 'exact' ? x$836 === y$837 : that$832.conditionType === 'startsWith' ? _$827.startsWith(x$836, y$837) : that$832.conditionType === 'endsWith' ? _$827.endsWith(x$836, y$837) : that$832.conditionType === 'contains' ? _$827.contains(x$836, y$837) : new Error('Invalid conditionType: ' + that$832.conditionType);
    }
    return isMatch$833(event$831[this.field], this.value) && !// current rule is a match and
    this.exceptions.some(function (a$838) {
        return a$838.match(event$831);
    });
};
// a rule that always matches
Rule$828.true = function () {
    var rule$839 = new Rule$828();
    rule$839.match = function () {
        return true;
    };
    return rule$839;
}();
module.exports = Rule$828;