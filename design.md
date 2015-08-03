Determine free time blocks given a list of busy times.

Event
================
- calendar      Personal/Work/etc
- title         String
- description   String
- location      String
- allday        Boolean
- start         Date
- end           Date

Rule
================
- conditonType  String
  - exact match
  - startsWith
  - endsWith
  - contains
  - regex
- caseSensitive Boolean
- field         String
- exceptions    [Rules]

* examples
  - calendar='Personal'
  - title~='(free)'
  - title~='(tentative)'
  - title~='Raine out'

Options
================
- Start-of-day
- End-of-day
- Travel Time (default: 30 min)
- Date Range (default: next week)
- Minimum  (default: 30 min)
- Start free blocks only on the hour or half-hour
- Formatting
  - Time Zone
  - Single-letter, 3-letter, or full day names
  - Month/Day or Day/Month
  - Slash or Dash
  - Ordinal?
  - Omit :00 minutes
  - am/pm
  - Omit repeat am/pm
  - Colored
  - Language
  - dash or "to"
  - Spaces around dash
  - "before" and "after"

Low-Level Design
================

Block
- start     Date
- end       Date
- subtract  Block -> Block

BlockArray
- constructor   Date start, Date end
- blocks    [Block]
  An array of non-overlapping free blocks for a single day
- subtract      Block -> ø
  Reduces the blocks by the given block
- days          Date start, Date end
  Static method for generating an array of BlockArrays for each day within the given range

