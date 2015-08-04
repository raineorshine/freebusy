var chai       = require('chai')
var should     = chai.should()
var moment     = require('moment')
var freebusy   = require('../lib/index.js')
var Block      = require('../lib/block.js')
var BlockArray = require('../lib/block-array.js')
var Rule       = require('../lib/rule.js')

var day0 = new Date;
var day1 = moment(day0).subtract(1, 'days').toDate();
var day2 = moment(day0).subtract(2, 'days').toDate();
var day3 = moment(day0).subtract(3, 'days').toDate();
var day7 = moment(day0).subtract(7, 'days').toDate();

var day1event = {
  title: 'School',
  description: 'Time to go to school!',
  start: moment(day1).add(2, 'hours').toDate(),
  end: moment(day1).add(3, 'hours').toDate()
}

function toObject(block) {
  return block.toObject()
}

describe('Block', function() {

  describe('toObject', function() {
    it('should convert the block to a simple object', function() {
      (new Block(day1, day0)).toObject().should.eql({
        start: day1,
        end: day0
      })
    })
  })

  describe('subtract', function() {

    it('should return an empty array for an exact subtraction', function() {
      var lastDay = new Block(day1, day0)
      lastDay.subtract(lastDay).should.eql([])
    })

    it('should return an array with the same block for a missed subtraction', function() {
      var lastDay = new Block(day1, day0)
      var blocks = lastDay.subtract(new Block(day7, day3))
      blocks.map(toObject).should.eql([
        { start: day1, end: day0 }
      ])
    })

    it('should return an array with the same block for an adjacent subtraction', function() {
      var lastDay = new Block(day1, day0)
      var blocks = lastDay.subtract(new Block(day2, day1))
      blocks.map(toObject).should.eql([
        { start: day1, end: day0 }
      ])
    })

    it('should return an empty array if a larger block is subtracted', function() {
      (new Block(day2, day1))
      .subtract(new Block(day3, day0))
      .should.eql([])
    })

    it('should return an array with a smaller block if subtracting a block that overlaps the start', function() {
      var blocks = (new Block(day2, day0))
        .subtract(new Block(day3, day1))
      blocks.map(toObject).should.eql([
        { start: day1, end: day0 }
      ])
      blocks.should.have.length(1) // needed in case blocks is empty and map never runs
    })

    it('should return an array with a smaller block if subtracting a block that overlaps the end', function() {
      var blocks = (new Block(day3, day1))
        .subtract(new Block(day2, day0))
      blocks.map(toObject).should.eql([
        { start: day3, end: day2 }
      ])
      blocks.should.have.length(1) // needed in case blocks is empty and map never runs
    })

    it('should return an array with two blocks if subtracting a block in the middle', function() {
      var blocks = (new Block(day3, day0))
        .subtract(new Block(day2, day1))
      blocks.map(toObject).should.eql([
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
      BlockArray.days(day3, day0)
        .toObject()
        .should.eql([
          { start: day3, end: day2 },
          { start: day2, end: day1 },
          { start: day1, end: day0 }
        ])
    })
  })

  describe('subtract', function() {

    it('should completely remove blocks that are subsumed by the given block', function() {
      BlockArray.days(day2, day1)
        .subtract(new Block(day3, day0))
        .toObject()
        .should.have.length(0)
    })

    it('should remove first half of blocks', function() {
      BlockArray.days(day3, day0)
        .subtract(new Block(day3, day2))
        .toObject()
        .should.eql([
          { start: day2, end: day1 },
          { start: day1, end: day0 }
        ])
    })

    it('should remove second half of blocks', function() {
      BlockArray.days(day3, day0)
        .subtract(new Block(day1, day0))
        .toObject()
        .should.eql([
          { start: day3, end: day2 },
          { start: day2, end: day1 }
        ])
    })

    it('should remove middle block', function() {
      BlockArray.days(day3, day0)
        .subtract(new Block(day2, day1))
        .toObject()
        .should.eql([
          { start: day3, end: day2 },
          { start: day1, end: day0 }
        ])
    })

  })

})

describe('Rule', function() {

  describe('match', function() {

    it('should match the title of an event', function() {
      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'exact' })
      rule.match({ title: 'test' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'exact' })
      rule.match({ title: 'other' }).should.equal(false)
    })

    it('should default to an exact match', function() {
      var rule = new Rule({ field: 'title', value: 'test' })
      rule.match({ title: 'test' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: 'test' })
      rule.match({ title: 'other' }).should.equal(false)
    })

    it('should do a startsWith match', function() {
      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'startsWith' })
      rule.match({ title: 'testing' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'startsWith' })
      rule.match({ title: 'whattest' }).should.equal(false)
    })

    it('should do an endsWith match', function() {
      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'endsWith' })
      rule.match({ title: 'whattest' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'endsWith' })
      rule.match({ title: 'testing' }).should.equal(false)
    })

    it('should do a contains match', function() {
      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'contains' })
      rule.match({ title: 'what\'s in a test?' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: 'test', conditionType: 'contains' })
      rule.match({ title: 'nothing to see here' }).should.equal(false)
    })

    it('should do a regex match', function() {
      var rule = new Rule({ field: 'title', value: /\d{3}/, conditionType: 'exact' })
      rule.match({ title: '#000' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: /\d{3}/, conditionType: 'exact' })
      rule.match({ title: '#0' }).should.equal(false)

      var rule = new Rule({ field: 'title', value: /\d{3}/ })
      rule.match({ title: '#000' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: /\d{3}/ })
      rule.match({ title: '#0' }).should.equal(false)
    })

    it('should default to case insensitive', function() {
      var rule = new Rule({ field: 'title', value: 'TEST', conditionType: 'contains' })
      rule.match({ title: 'test' }).should.equal(true)
    })

    it('should allow configurable case sensitivity', function() {
      var rule = new Rule({ field: 'title', value: 'TEST', conditionType: 'contains', caseSensitive: false })
      rule.match({ title: 'test' }).should.equal(true)

      var rule = new Rule({ field: 'title', value: 'TEST', conditionType: 'contains', caseSensitive: true })
      rule.match({ title: 'test' }).should.equal(false)
    })

    it('should exclude exceptions', function() {

      var rule = new Rule({
        field: 'title',
        value: 'TEST',
        conditionType: 'contains',
        exceptions: [
          new Rule({ field: 'description', value: 'hi' })
        ]
      })
      rule.match({ title: 'test', description: 'hi' }).should.equal(false)

      var rule = new Rule({
        field: 'title',
        value: 'TEST',
        conditionType: 'contains',
        exceptions: [
          new Rule({ field: 'description', value: 'blah' })
        ]
      })
      rule.match({ title: 'test', description: 'hi' }).should.equal(true)

      var rule = new Rule({
        field: 'title',
        value: 'TEST',
        conditionType: 'contains',
        exceptions: [
          new Rule({ field: 'description', value: 'blah' }),
          new Rule({ field: 'description', value: 'hi' }),
          new Rule({ field: 'description', value: 'blah' })
        ]
      })
      rule.match({ title: 'test', description: 'hi' }).should.equal(false)

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

  it('should return two free slots when there is an event in the middle of one day', function() {
    freebusy(day1, day0, [day1event]).should.eql([
      {
        start: day1,
        end: day1event.start
      },
      {
        start: day1event.end,
        end: day0
      }
    ])
  })

  it('should mark events that match a title rule as busy', function() {
    true.should.equal(false)
  })

  it('should ignore events that do not match a title rule', function() {
    true.should.equal(false)
  })

})
