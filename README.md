# freebusy
[![npm version](https://img.shields.io/npm/v/freebusy.svg)](https://npmjs.org/package/freebusy) 
[![Build Status](https://travis-ci.org/metaraine/freebusy.svg?branch=master)](https://travis-ci.org/metaraine/freebusy)

> Determine free blocks from a list of events and free/busy rules.


## Install

```sh
$ npm install --save freebusy
```


## Usage

```js
var freebusy = require('freebusy')

// find all remaining free time from June 1-3 outside of an event that occurs from 12-1pm on June 2.
freebusy({ 
  start: new Date('2015-06-01 00:00'), 
  end: new Date('2015-06-04 00:00'), 
  events: [{ 
    start: new Date('2015-06-02 12:00'), 
    end: new Date('2015-06-02 13:00') 
  }] 
})

/*
[ 
  // June 1 is free
  { start: Mon Jun 01 2015 00:00:00 GMT-0600 (MDT),
    end: Tue Jun 02 2015 00:00:00 GMT-0600 (MDT) },
  // June 2 is free from 00:00 - 12:00 and 13:00 - 24:00
  { start: Tue Jun 02 2015 00:00:00 GMT-0600 (MDT),
    end: Tue Jun 02 2015 12:00:00 GMT-0600 (MDT) },
  { start: Tue Jun 02 2015 13:00:00 GMT-0600 (MDT),
    end: Wed Jun 03 2015 00:00:00 GMT-0600 (MDT) },
  // June 3 is free
  { start: Wed Jun 03 2015 00:00:00 GMT-0600 (MDT),
    end: Thu Jun 04 2015 00:00:00 GMT-0600 (MDT) } 
]
*/
```

## Contributing

Powered by npm scripts.

## License

ISC © [Raine Lourie](https://github.com/metaraine)
