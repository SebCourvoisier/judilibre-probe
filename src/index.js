const { logger } = require('./modules/logger');
const log = logger.child({
  module: 'main',
});

const { Browser } = require('./modules/browser');
const { API } = require('./modules/api');
const { Slack } = require('./modules/slack');

async function main() {
  log.info('start script');
  const latestFromBrowser = await Browser.GetLatest();
  const latestFromAPI = await API.GetLatest();
  log.info(latestFromBrowser);
  log.info(latestFromAPI);
  // await Slack.SendMessage('test');
  log.info('end script');
}

main();
