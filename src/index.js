#!/usr/bin/env node
const program = require('commander');
const packageJson = require('../package.json');
const { makeIndex } = require('./makeindex');
const { getConfig, setConfig } = require('./config');

program.version(packageJson.version, '-v, --vers', 'output the current version');

program
  .command('index')
  .alias('i')
  .description('Create gist index')
  .action(async function() {
    const token = getConfig('token');
    await makeIndex(token);
  });
program
  .command('init')
  .description('init github access')
  .requiredOption('-t, --token', 'github access token')
  .action(async function(_, args) {
    const token = args[0];
    setConfig('token', token);
  });

program.parse(process.argv);
