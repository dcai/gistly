#!/usr/bin/env node
const { program } = require('commander');
const packageJson = require('../package.json');
const { makeIndex } = require('./makeindex');
const { updateIndex } = require('./updateindex');
const { createIndex } = require('./createindex');
const { getConfig, setConfig, deleteConfig } = require('./config');

program.version(packageJson.version, '-v, --vers', 'output the current version');

program
  .command('index')
  .option('--no-footer', 'no footer promo link', true)
  .option('--include-private', 'include private gists', false)
  .option('-p, --put', 'put the created gist index markdown file to linked gist', false)
  .option('-r, --reverse-order', 'reverse the index order', false)
  .description('create gist index in markdown format')
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
      orderDirection: args.reverseOrder ? 'DESC' : 'ASC',
      includePrivate: args.includePrivate,
    };
    const txt = await makeIndex(token, options);
    console.info(txt);

    if (args.put) {
      const gistId = getConfig('gistId');
      if (gistId) {
        await updateIndex(token, gistId, txt);
      } else {
        const gist = await createIndex(token, txt);
        setConfig('gistId', gist.data.id);
      }
    }
  });

program
  .command('init')
  .description('initialise github access config')
  .requiredOption('-t, --token <string>', 'github access token')
  .option('-g, --gist-id <string>', 'set the gist id to store the index')
  .action(async function (options) {
    const token = options.token;
    const gistId = options.gistId;
    setConfig('gistId', gistId);
    setConfig('token', token);
  });

program
  .command('link')
  .description('link to existing index gist')
  .requiredOption('-g, --gist-id <string>', 'gist id')
  .action(async function (options) {
    const gistId = options.gistId;
    setConfig('gistId', gistId);
  });

program
  .command('unlink')
  .description('unlink from linked index gist')
  .action(async function () {
    deleteConfig('gistId');
  });

program.parse(process.argv);
