var moment = require('moment')

function Event() {
}

function Rule() {
}

function Block(start, end) {
  this.start = start
  this.end = end
}

Block.prototype.subtract = function (block) {
  return [
    new Block(this.start, block.start),
    new Block(block.end, this.end)
  ].filter(function (block) {
    return block.end > block.start
  })
}

Block.prototype.toObject = function () {
  return {
    start: this.start,
    end:   this.end
  }
}

function BlockArray() {
}

function freebusy(start, end, events, rules) {

}

freebusy.Event = Event
freebusy.Block = Block
freebusy.BlockArray = BlockArray
freebusy.Rule = Rule

module.exports = freebusy
