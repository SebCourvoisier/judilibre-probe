const { logger } = require('../modules/logger');
const log = logger.child({
  module: 'latest',
});

const { State } = require('../modules/state');
const { Browser } = require('../modules/browser');
const { API } = require('../modules/api');
const { Slack } = require('../modules/slack');

async function main() {
  log.info('start probe');
  const state = await State.GetState('latest');
  const latestFromBrowser = await Browser.GetLatest();
  const latestFromAPI = await API.GetLatest();
  log.info(latestFromBrowser);
  log.info(latestFromAPI);
  if (JSON.stringify(latestFromBrowser) !== JSON.stringify(latestFromAPI)) {
    if (state === null || state.status === true) {
      await Slack.SendMessage(
        ":large_red_square: les données du bloc des dernières décisions sur le site ne correspondent pas aux données de l'API",
      );
    }
    await State.SetState('latest', {
      status: false,
    });
  } else {
    if (state === null || state.status === false) {
      await Slack.SendMessage(
        ":large_green_square:	les données du bloc des dernières décisions sur le site correspondent de nouveau aux données de l'API",
      );
    }
    await State.SetState('latest', {
      status: true,
    });
  }
  log.info('end probe');
}

main();
