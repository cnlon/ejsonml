#!/usr/bin/env node

const PARAM_PROP = {
  '-t': 'template',
  '--template': 'template',
  '-o': 'output',
  '--output': 'output',
  '-c': 'config',
  '--config': 'config',
  '-f': 'format',
  '--format': 'format',
  '-w': 'watch',
  '--watch': 'watch',
}

const PARAM_PROP_DEFAULT = {
  'watch': true,
}

const args = process.argv
let config = {}
let prop
for (let i = 2, l = args.length; i < l; i++) {
  prop = args[i]
  prop = PARAM_PROP[prop] || prop
  if (PARAM_PROP_DEFAULT.hasOwnProperty(prop)) {
    config[prop] = PARAM_PROP_DEFAULT[prop]
  } else {
    i++
    config[prop] = args[i]
  }
}
if (config.hasOwnProperty('config')) {
  const path = require('path')
  let output = config.config || './ejsonml.config.js'
  output = path.resolve(output)
  config = require(output)
}
const parse = require('./index')
parse(config)
