var moment     = require('moment')
var identity   = require('lodash.identity')
var range      = require('lodash.range')
var Block      = require('./block.js')
var Rule       = require('./rule.js')
var BlockArray = require('./block-array.js')

// returns an 7-day array of the given value, or the value itself if it is already an array (converted from [Sun...Sat] to [Mon...Sun])
function defaultWeek(x) {
  return x && !Array.isArray(x) ? range(x, x+7, 0) : x
}

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
  args.startOfDay = defaultWeek(args.startOfDay)
  args.endOfDay   = defaultWeek(args.endOfDay)

  var rules = args.rules ? args.rules.map(Rule.fromObject) : [Rule.true]
  var busyEvents = args.events.filter(λ(event) -> rules.some(λ.match(event)))

  var freeDays =

    // create free days from start till end
    BlockArray.days(args.start, args.end).getBlocks()

    // reduce the free time by startOfDay and endOfDay each day
    .map(args.startOfDay || args.endOfDay ? function (day) {
      var startDate = day.getStart()
      var day = (startDate.getDay()+6)%7 // rotate number to use Sun as beginning of week
      var startOfDay = args.startOfDay && args.startOfDay[day] || 0
      var endOfDay   = args.endOfDay && args.endOfDay[day] || 24
      var truncatedStart = moment(startDate).add(startOfDay, 'hours').toDate()
      var truncatedEnd   = moment(startDate).add(endOfDay, 'hours').toDate()
      return new Block(truncatedStart, truncatedEnd)
    } : identity)

  // reduce freeDays by busy events
  // returning this full expression directly breaks sweetjs!
  var finalFreeTime = busyEvents.reduce(function (remainingTime, nextEvent) {
    return remainingTime.subtract(new Block(nextEvent.start, nextEvent.end))
  }, new BlockArray(freeDays))

  return finalFreeTime.toObject()
}

module.exports = freebusy
