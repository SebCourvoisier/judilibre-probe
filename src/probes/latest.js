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
  let details = [];
  const state = await State.GetState('latest');
  const latestFromBrowser = await Browser.GetLatest();
  const latestFromAPI = await API.GetLatest();
  if (state === null || JSON.stringify(latestFromBrowser) !== JSON.stringify(state.latestFromBrowser)) {
    details.push(`:compass: Les données affichées par le site ont changé (bloc des dernières décisions)`);
  }
  if (state === null || JSON.stringify(latestFromAPI) !== JSON.stringify(state.latestFromAPI)) {
    details.push(`:classical_building: Les données retournées par l'API ont changé (bloc des dernières décisions)`);
  }
  if (latestFromBrowser.length < 10 || latestFromAPI.length < 10) {
    if (state && state.status === true) {
      if (latestFromBrowser.length < 10) {
        details.push(`:warning: :compass: Le site n'affiche aucune donnée (bloc des dernières décisions)`);
      }
      if (latestFromAPI.length < 10) {
        details.push(`:warning: :classical_building: L'API ne retourne aucune donnée (bloc des dernières décisions)`);
      }
      details = details.join('\n');
      await Slack.SendMessage(`:large_red_square: Anomalie détectée (bloc des dernières décisions) :\n${details}`);
    }
    await State.SetState('latest', {
      status: false,
      latestFromAPI: latestFromAPI,
      latestFromBrowser: latestFromBrowser,
    });
  } else {
    if (state && state.status === false) {
      await Slack.SendMessage(`:large_green_square: Fin de l'anomalie (bloc des dernières décisions).\n${details}`);
    }
    await State.SetState('latest', {
      status: true,
      latestFromAPI: latestFromAPI,
      latestFromBrowser: latestFromBrowser,
    });
  }
  log.info('end probe');
}

main();
