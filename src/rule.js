var _ = require('lodash')

/**
 * @param args.field
 * @param args.value
 * @param args.conditionType (default: exact)
 * @param args.caseSensitive (default: false)
 * @param args.exceptions    (optional)
 */
function Rule(args) {
  args = args || {}
  this.field = args.field
  this.value = args.value
  this.conditionType = args.conditionType || 'exact'
  this.caseSensitive = 'caseSensitive' in args ? args.caseSensitive : false
  this.exceptions = args.exceptions || []
}

Rule.fromObject = function (args) {
  return new Rule(args)
}

Rule.prototype.match = function(event) {
  var that = this;

  function isMatch(x,y) {
    if(typeof y === 'string' && !that.caseSensitive) {
      x = x.toLowerCase()
      y = y.toLowerCase()
    }
    return y instanceof RegExp ? y.test(x) :
      that.conditionType === 'exact' ? x === y :
      that.conditionType === 'startsWith' ? _.startsWith(x, y) :
      that.conditionType === 'endsWith' ? _.endsWith(x, y) :
      that.conditionType === 'contains' ? _.contains(x, y) :
      new Error('Invalid conditionType: ' + that.conditionType)
  }

  return isMatch(event[this.field], this.value) &&  // current rule is a match and
    !this.exceptions.some(λ.match(event)) // every exception is not a match
}

// a rule that always matches
Rule.true = (function () {
  var rule = new Rule()
  rule.match = λ -> true
  return rule
})()

module.exports = Rule
