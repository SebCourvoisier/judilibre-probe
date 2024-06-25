const { logger } = require('./modules/logger');
const log = logger.child({
  module: 'main',
});

const { Browser } = require('./modules/browser');
const { API } = require('./modules/api');
const { Slack } = require('./modules/slack');

async function main() {
  log.info('start script');
  await Browser.GetLatest();
  await API.GetLatest();
  await Slack.SendMessage('test');
  log.info('end script');
}

main();
