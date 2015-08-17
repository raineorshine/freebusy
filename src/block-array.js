var moment = require('moment')
var range  = require('lodash.range')
var Block  = require('./block.js')

// returns an 7-day array of the given value, or the value itself if it is already an array (converted from [Sun...Sat] to [Mon...Sun])
function defaultWeek(x) {
  return x && !Array.isArray(x) ? range(x, x+7, 0) : x
}

function BlockArray(blocks) {
  this.blocks = blocks || []
}

BlockArray.prototype.subtract = function (subtrahend) {
  return new BlockArray(Array.prototype.concat.apply([],
    this.blocks.map(λ.subtract(subtrahend))
  ))
}

BlockArray.prototype.toObject = function () {
  return this.blocks.map(λ.toObject())
}

BlockArray.prototype.getBlocks = function () {
  return Array.prototype.slice.call(this.blocks)
}

BlockArray.days = function (startDate, endDate, startOfDay, endOfDay) {

  startOfDay = defaultWeek(startOfDay || 0)
  endOfDay   = defaultWeek(endOfDay || 24)

  var blocks = []
  var current = moment(startDate);
  while(current < endDate) {
    var day = (current.day()+6)%7 // rotate number to use Sun as beginning of week
    var start = current.clone().add(startOfDay[day], 'hours')
    var end   = current.clone().add(endOfDay[day], 'hours')
    blocks.push(new Block(start.toDate(), end.toDate()))
    current = current.clone().add(1, 'days')
  }

  return new BlockArray(blocks)
}

module.exports = BlockArray
