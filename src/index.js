var moment     = require('moment')
var Block      = require('./block.js')
var Rule       = require('./rule.js')
var BlockArray = require('./block-array.js')

function freebusy(start, end, events, rules) {

  events = events || []
  rules = rules ? rules.map(Rule.fromObject) : [Rule.true]

  var busyEvents = events.filter(λ(event) -> rules.some(λ.match(event)))
  var freeDays = BlockArray.days(start, end)

  var remainingTime = busyEvents.reduce(function (remainingTime, nextEvent) {
    return remainingTime.subtract(new Block(nextEvent.start, nextEvent.end))
  }, freeDays)

  return remainingTime.toObject()
}

module.exports = freebusy
