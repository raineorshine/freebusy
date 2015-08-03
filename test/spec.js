var chai     = require('chai')
var should   = chai.should()
var moment   = require('moment')
var freebusy = require('../index.js')

var day0 = new Date;
var day1 = moment(day0).subtract(1, 'days').toDate();
var day2 = moment(day0).subtract(2, 'days').toDate();
var day3 = moment(day0).subtract(3, 'days').toDate();
var day7 = moment(day0).subtract(7, 'days').toDate();

function blockToObject(block) {
  return block.toObject()
}

describe('Block', function() {

  describe('toObject', function() {
    it('should convert the block to a simple object', function() {
      (new freebusy.Block(day1, day0)).toObject().should.eql({
        start: day1,
        end: day0
      })
    })
  })

  describe('subtract', function() {

    it('should return an empty array for an exact subtraction', function() {
      var lastDay = new freebusy.Block(day1, day0)
      lastDay.subtract(lastDay).should.eql([])
    })

    it('should return an empty array if a larger block is subtracted', function() {
      (new freebusy.Block(day2, day1))
      .subtract(new freebusy.Block(day3, day0))
      .should.eql([])
    })

    it('should return an array with a smaller block if subtracting a block that overlaps the start', function() {
      var blocks = (new freebusy.Block(day2, day0))
        .subtract(new freebusy.Block(day3, day1))
      blocks.map(blockToObject).should.eql([
        { start: day1, end: day0 }
      ])
      blocks.should.have.length(1) // needed in case blocks is empty and map never runs
    })

    it('should return an array with a smaller block if subtracting a block that overlaps the end', function() {
      var blocks = (new freebusy.Block(day3, day1))
        .subtract(new freebusy.Block(day2, day0))
      blocks.map(blockToObject).should.eql([
        { start: day3, end: day2 }
      ])
      blocks.should.have.length(1) // needed in case blocks is empty and map never runs
    })

    it('should return an array with a two blocks if subtracting a block in the middle', function() {
      var blocks = (new freebusy.Block(day3, day0))
        .subtract(new freebusy.Block(day2, day1))
      blocks.map(blockToObject).should.eql([
        { start: day3, end: day2 },
        { start: day1, end: day0 }
      ])
      blocks.should.have.length(2) // needed in case blocks is empty and map never runs
    })

  })

})

describe('BlockArray', function() {

  describe('days', function() {
    it('should generate a BlockArray of individual days from the given start and end times', function() {
      freebusy.BlockArray.days(day3, day0)
        .toObject()
        .should.eql([
          { start: day3, end: day2 },
          { start: day2, end: day1 },
          { start: day1, end: day0 }
        ])
    })
  })

})

describe('freebusy', function() {

  it('should return a free day', function() {
    freebusy(day1, day0, []).should.eql([
      {
        start: day1,
        end: day0
      }
    ])
  })

})
