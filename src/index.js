var moment     = require('moment')
var identity   = require('lodash.identity')
var Block      = require('./block.js')
var Rule       = require('./rule.js')
var BlockArray = require('./block-array.js')

/**
 * @param args.start
 * @param args.end
 * @param args.events
 * @param args.rules
 * @param args.startOfDay
 * @param args.endOfDay
 */
function freebusy(args) {

  // defaults
  args.events     = args.events || []

  var rules = args.rules ? args.rules.map(Rule.fromObject) : [Rule.true]
  var busyEvents = args.events.filter(λ(event) -> rules.some(λ.match(event)))

  // create free days from start till end
  var freeDays = BlockArray.days(args.start, args.end, args.startOfDay, args.endOfDay)

  // reduce freeDays by busy events
  // returning this full expression directly breaks sweetjs!
  var finalFreeTime = busyEvents.reduce(function (remainingTime, nextEvent) {
    return remainingTime.subtract(new Block(nextEvent.start, nextEvent.end))
  }, freeDays)

  return finalFreeTime.toObject()
}

module.exports = freebusy
