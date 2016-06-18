#!/usr/bin/env node

const PARAM_PROP = {
  '-t': 'template',
  '-o': 'output',
  '-c': 'config',
}

const args = process.argv
let config = {}
let prop
for (let i = 2, l = args.length; i < l; i += 2) {
  prop = args[i]
  prop = PARAM_PROP[prop] || prop
  config[prop] = args[i + 1]
}
if (config.hasOwnProperty('config')) {
  const path = require('path')
  let output = config.config || './ejsonml.config.js'
  output = path.resolve(output)
  config = require(output)
}
const parse = require('./index')
parse(config)
