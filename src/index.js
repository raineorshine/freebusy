var moment     = require('moment')
var Block      = require('./block.js')
var Rule       = require('./rule.js')
var BlockArray = require('./block-array.js')

/**
 * @param args.start
 * @param args.end
 * @param args.events
 * @param args.rules
 */
function freebusy(args) {

  args.events = args.events || []

  var rules = args.rules ? args.rules.map(Rule.fromObject) : [Rule.true]
  var busyEvents = args.events.filter(λ(event) -> rules.some(λ.match(event)))
  var freeDays = BlockArray.days(args.start, args.end)

  var remainingTime = busyEvents.reduce(function (remainingTime, nextEvent) {
    return remainingTime.subtract(new Block(nextEvent.start, nextEvent.end))
  }, freeDays)

  return remainingTime.toObject()
}

module.exports = freebusy
