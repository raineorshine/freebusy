var moment = require('moment')
var Block = require('./block.js')

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

module.exports = BlockArray
