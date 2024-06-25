const { logger } = require('../modules/logger');
const log = logger.child({
  module: 'latest',
});

const { Browser } = require('../modules/browser');
const { API } = require('../modules/api');
const { Slack } = require('../modules/slack');

async function main() {
  log.info('start probe');
  const latestFromBrowser = await Browser.GetLatest();
  const latestFromAPI = await API.GetLatest();
  log.info(latestFromBrowser);
  log.info(latestFromAPI);
  if (JSON.stringify(latestFromBrowser) !== JSON.stringify(latestFromAPI)) {
    await Slack.SendMessage(
      ":warning: les données du bloc des dernières décisions sur le site ne correspondent pas aux données de l'API",
    );
  }
  log.info('end probe');
}

main();
