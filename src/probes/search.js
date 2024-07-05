const { logger } = require('../modules/logger');
const log = logger.child({
  module: 'search',
});

const { State } = require('../modules/state');
const { Browser } = require('../modules/browser');
const { API } = require('../modules/api');
const { Slack } = require('../modules/slack');

const exitTimeout = setTimeout(function () {
  log.info('force exit probe');
  process.exit(1);
}, 30 * 1000);

async function main() {
  log.info('start probe');
  let details = [];
  const state = await State.GetState('search');
  const searchFromBrowser = await Browser.GetSearch();
  const searchFromAPI = await API.GetSearch();
  if (state === null || JSON.stringify(searchFromBrowser) !== JSON.stringify(state.searchFromBrowser)) {
    details.push(`:compass: Les données affichées par le site ont changé (recherche par défaut)`);
  }
  if (state === null || JSON.stringify(searchFromAPI) !== JSON.stringify(state.searchFromAPI)) {
    details.push(`:classical_building: Les données retournées par l'API ont changé (recherche par défaut)`);
  }
  if (searchFromBrowser.length < 10 || searchFromAPI.length < 10) {
    if (state && state.status === true) {
      if (searchFromBrowser.length < 10) {
        details.push(`:warning: :compass: Le site n'affiche aucune donnée (recherche par défaut)`);
      }
      if (searchFromAPI.length < 10) {
        details.push(`:warning: :classical_building: L'API ne retourne aucune donnée (recherche par défaut)`);
      }
      await Slack.SendMessage(`:large_red_square: Anomalie détectée (recherche par défaut) :\n${details.join('\n')}`);
    }
    await State.SetState('search', {
      status: false,
      searchFromAPI: searchFromAPI,
      searchFromBrowser: searchFromBrowser,
    });
  } else {
    if (state && state.status === false) {
      await Slack.SendMessage(`:large_green_square: Fin de l'anomalie (recherche par défaut).\n${details.join('\n')}`);
    }
    await State.SetState('search', {
      status: true,
      searchFromAPI: searchFromAPI,
      searchFromBrowser: searchFromBrowser,
    });
  }
  log.info('end probe');
  clearTimeout(exitTimeout);
  process.exit(0);
}

main();
