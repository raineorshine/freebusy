var moment = require('moment')

function Event() {
}

function Rule() {
}

function Block(start, end) {
  this.start = start
  this.end = end
}

Block.prototype.subtract = function (subtrahend) {
  return [
    new Block(this.start, subtrahend.start),
    new Block(subtrahend.end, this.end)
  ]
  .filter(λ(b) -> b.end > b.start)
}

Block.prototype.toObject = function () {
  return {
    start: this.start,
    end:   this.end
  }
}

function BlockArray() {
  this.blocks = []
}

BlockArray.prototype.subtract = function (subtrahend) {
  return this.blocks
    .map(function (minuend) {
      return minuend.subtract(subtrahend)
    })
    .filter(λ(b) -> b.end > b.start)
}

BlockArray.prototype.toObject = function () {
  return this.blocks.map(λ.toObject())
}

BlockArray.days = function (start, end) {
  var blockArray = new BlockArray()

  var current = moment(start);
  while(current < end) {
    var next = current.clone().add(1, 'days')
    blockArray.blocks.push(new Block(current.toDate(), next.toDate()))
    current = next
  }

  return blockArray
}

function freebusy(start, end, events, rules) {

}

freebusy.Event = Event
freebusy.Block = Block
freebusy.BlockArray = BlockArray
freebusy.Rule = Rule

module.exports = freebusy
