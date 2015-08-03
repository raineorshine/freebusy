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
  this.blocks = []
}

BlockArray.prototype.subtract = function (block) {

}

BlockArray.prototype.toObject = function () {
  return this.blocks.map(function (block) {
    return block.toObject()
  })
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
