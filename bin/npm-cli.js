#!/usr/bin/env node

var nodenvRoot = process.env.NODENV_ROOT || process.env.HOME + '/.nodenv'
require('child_process')
  .spawn(nodenvRoot + '/shims/npm', process.argv.slice(2), {env: process.env, stdio: 'inherit'})
  .on('close', process.exit) // warning: npm <4 doesn't preserve exit code
