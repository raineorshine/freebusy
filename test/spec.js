var chai       = require('chai')
var should     = chai.should()
var moment     = require('moment')
var freebusy   = require('../lib/index.js')
var Block      = require('../lib/block.js')
var BlockArray = require('../lib/block-array.js')
var Rule       = require('../lib/rule.js')

var jan8 = new Date('2015-01-08 00:00:00');
var jan7 = moment(jan8).subtract(1, 'days').toDate()
var jan6 = moment(jan8).subtract(2, 'days').toDate()
var jan5 = moment(jan8).subtract(3, 'days').toDate()
var jan1 = moment(jan8).subtract(7, 'days').toDate()

function toObject(block) {
  return block.toObject()
}

describe('Block', function() {

  describe('toObject', function() {
    it('should convert the block to a simple object', function() {
      (new Block(jan7, jan8)).toObject().should.eql({
        start: jan7,
        end: jan8
      })
    })
  })

  describe('subtract', function() {

    it('should return an empty array for an exact subtraction', function() {
      var day = new Block(jan7, jan8)
      day.subtract(day).should.eql([])
    })

    it('should return an array with the same block for a missed subtraction', function() {
      var day = new Block(jan7, jan8)
      var blocks = day.subtract(new Block(jan1, jan5))
      blocks.map(toObject).should.eql([
        { start: jan7, end: jan8 }
      ])
    })

    it('should return an array with the same block for an adjacent subtraction', function() {
      var day = new Block(jan7, jan8)
      var blocks = day.subtract(new Block(jan6, jan7))
      blocks.map(toObject).should.eql([
        { start: jan7, end: jan8 }
      ])
    })

    it('should return an empty array if a larger block is subtracted', function() {
      (new Block(jan6, jan7))
      .subtract(new Block(jan5, jan8))
      .should.eql([])
    })

    it('should return an array with a smaller block if subtracting a block that overlaps the start', function() {
      var blocks = (new Block(jan6, jan8))
        .subtract(new Block(jan5, jan7))
      blocks.map(toObject).should.eql([
        { start: jan7, end: jan8 }
      ])
      blocks.should.have.length(1) // needed in case blocks is empty and map never runs
    })

    it('should return an array with a smaller block if subtracting a block that overlaps the end', function() {
      var blocks = (new Block(jan5, jan7))
        .subtract(new Block(jan6, jan8))
      blocks.map(toObject).should.eql([
        { start: jan5, end: jan6 }
      ])
      blocks.should.have.length(1) // needed in case blocks is empty and map never runs
    })

    it('should return an array with two blocks if subtracting a block in the middle', function() {
      var blocks = (new Block(jan5, jan8))
        .subtract(new Block(jan6, jan7))
      blocks.map(toObject).should.eql([
        { start: jan5, end: jan6 },
        { start: jan7, end: jan8 }
      ])
      blocks.should.have.length(2) // needed in case blocks is empty and map never runs
    })

  })

})

describe('BlockArray', function() {

  describe('days', function() {
    it('should generate a BlockArray of individual days from the given start and end times', function() {
      BlockArray.days(jan5, jan8)
        .toObject()
        .should.eql([
          { start: jan5, end: jan6 },
          { start: jan6, end: jan7 },
          { start: jan7, end: jan8 }
        ])
    })
  })

  describe('subtract', function() {

    it('should completely remove blocks that are subsumed by the given block', function() {
      BlockArray.days(jan6, jan7)
        .subtract(new Block(jan5, jan8))
        .toObject()
        .should.have.length(0)
    })

    it('should remove first half of blocks', function() {
      BlockArray.days(jan5, jan8)
        .subtract(new Block(jan5, jan6))
        .toObject()
        .should.eql([
          { start: jan6, end: jan7 },
          { start: jan7, end: jan8 }
        ])
    })

    it('should remove second half of blocks', function() {
      BlockArray.days(jan5, jan8)
        .subtract(new Block(jan7, jan8))
        .toObject()
        .should.eql([
          { start: jan5, end: jan6 },
          { start: jan6, end: jan7 }
        ])
    })

    it('should remove middle block', function() {
      BlockArray.days(jan5, jan8)
        .subtract(new Block(jan6, jan7))
        .toObject()
        .should.eql([
          { start: jan5, end: jan6 },
          { start: jan7, end: jan8 }
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

  var day1event = {
    title: 'School',
    description: 'Time to go to school!',
    start: moment(jan7).add(2, 'hours').toDate(),
    end: moment(jan7).add(3, 'hours').toDate()
  }

  describe('basic functionality', function() {

    it('should return a free day', function() {
      freebusy({ start: jan7, end: jan8 })
      .should.eql([
        { start: jan7, end: jan8 }
      ])
    })

    it('should return two free slots when there is an event in the middle of one day', function() {
      freebusy({
        start: jan7,
        end: jan8,
        events: [day1event]
      })
      .should.eql([
        { start: jan7, end: day1event.start },
        { start: day1event.end, end: jan8 }
      ])
    })

    it('should mark events that match a rule as busy', function() {
      freebusy({
        start: jan7,
        end: jan8,
        events: [day1event],
        rules: [{ field: 'title', value: 'school' }]
      })
      .should.eql([
        { start: jan7, end: day1event.start },
        { start: day1event.end, end: jan8 }
      ])
    })

    it('should ignore events that do not match a rule', function() {
      freebusy({
        start: jan7,
        end: jan8,
        events: [day1event],
        rules: [{ field: 'title', value: 'blah' }]
      })
      .should.eql([
        { start: jan7, end: jan8 }
      ])
    })

  })

  describe('startOfDay, endOfDay', function() {

    it('should mark times before startOfDay as busy', function() {
      freebusy({
        start: jan7,
        end: jan8,
        startOfDay: 9
      })
      .should.eql([
        {
          start: moment(jan7).add(9, 'hours').toDate(),
          end: jan8
        }
      ])
    })

    it('should mark times after endOfDay as busy', function() {
      freebusy({
        start: jan7,
        end: jan8,
        endOfDay: 20
      })
      .should.eql([
        {
          start: jan7,
          end: moment(jan7).add(20, 'hours').toDate()
        }
      ])
    })

    it('should mark times outside of startOfDay and endOfDay as busy', function() {
      freebusy({
        start: jan7,
        end: jan8,
        startOfDay: 9,
        endOfDay: 20
      })
      .should.eql([
        {
          start: moment(jan7).add(9, 'hours').toDate(),
          end: moment(jan7).add(20, 'hours').toDate()
        }
      ])
    })

    it('should respect startOfDay and endOfDay across multiple days', function() {
      freebusy({
        start: jan6,
        end: jan8,
        startOfDay: 9,
        endOfDay: 20
      })
      .should.eql([
        {
          start: moment(jan6).add(9, 'hours').toDate(),
          end: moment(jan6).add(20, 'hours').toDate()
        },
        {
          start: moment(jan7).add(9, 'hours').toDate(),
          end: moment(jan7).add(20, 'hours').toDate()
        }
      ])
    })

    it('should accept an array of startOfDay and and endOfDay hours for each day of the week', function() {
      freebusy({
        start: jan1,
        end:   jan8,
        startOfDay: [8,8,8,8,8,10,10],
        endOfDay: [20,20,20,20,22,22,20]
      })
      .should.eql([
        {
          start: moment(jan1).add(8, 'hours').toDate(),
          end: moment(jan1).add(20, 'hours').toDate()
        },
        {
          start: moment(jan1).add(1, 'days').add(8, 'hours').toDate(),
          end: moment(jan1).add(1, 'days').add(22, 'hours').toDate()
        },
        {
          start: moment(jan1).add(2, 'days').add(10, 'hours').toDate(),
          end: moment(jan1).add(2, 'days').add(22, 'hours').toDate()
        },
        {
          start: moment(jan1).add(3, 'days').add(10, 'hours').toDate(),
          end: moment(jan1).add(3, 'days').add(20, 'hours').toDate()
        },
        {
          start: moment(jan1).add(4, 'days').add(8, 'hours').toDate(),
          end: moment(jan1).add(4, 'days').add(20, 'hours').toDate()
        },
        {
          start: moment(jan1).add(5, 'days').add(8, 'hours').toDate(),
          end: moment(jan1).add(5, 'days').add(20, 'hours').toDate()
        },
        {
          start: moment(jan1).add(6, 'days').add(8, 'hours').toDate(),
          end: moment(jan1).add(6, 'days').add(20, 'hours').toDate()
        }
      ])
    })

  })

})
