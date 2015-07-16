#!/usr/bin/env node

// A simple CLI for mp3 trimming
//
// USAGE:    trimp3  $mp3In  $mp3Out  $beginTime  $endTime
//
// TIME FORMATS SUPPORTED:
//
// 00       - seconds
// 00:00    - minutes and seconds
// 00:00:00 - hours, minutes and seconds
//
//  EXAMPLE:  trimp3  in.mp3  out.mp3  01:35       7:58:55
//  EXAMPLE:  trimp3  in.mp3  out.mp3  20:31       05:40

var path = require('path');

// Run tex!
require(path.resolve(__filename, '../libtrimp3.js')).cli();


