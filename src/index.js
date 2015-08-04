var moment = require('moment')
var Block = require('./block.js')
var BlockArray = require('./block-array.js')

function freebusy(start, end, events, rules) {

  events = events || []
  rules = rules || []

  var freeDays = BlockArray.days(start, end)

  events.forEach(function (event) {
    freeDays = freeDays.subtract(new Block(event.start, event.end))
  })

  return freeDays.toObject()
}

module.exports = freebusy
