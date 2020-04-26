#!/usr/bin/env node
const program = require('commander');
const packageJson = require('../package.json');
const { makeIndex } = require('./makeindex');
const { getConfig, setConfig } = require('./config');

program.version(packageJson.version, '-v, --vers', 'output the current version');

program
  .command('index')
  .option('--no-footer', 'no footer promo link', false)
  .description('Create gist index')
  .action(async function (args) {
    const token = getConfig('token');
    if (!token) {
      console.error(
        'Please create your personal token with gist permission from: https://github.com/settings/tokens/new',
      );
      console.error('gist init --token <github personal token>');
      return;
    }
    const options = {
      hasFooter: args.footer,
    };
    await makeIndex(token, options);
  });

program
  .command('init')
  .description('init github access')
  .requiredOption('-t, --token <string>', 'github access token')
  .action(async function (options) {
    const token = options.token;
    setConfig('token', token);
  });

program.parse(process.argv);
