// https://www.courdecassation.fr/acces-rapide-judilibre

const { logger } = require('../modules/logger');
const log = logger.child({
  module: 'search',
});

const { State } = require('../modules/state');
const { Browser } = require('../modules/browser');
const { API } = require('../modules/api');
const { Slack } = require('../modules/slack');

async function main() {
  log.info('start probe');
  const state = await State.GetState('search');
  const searchFromBrowser = await Browser.GetSearch();
  const searchFromAPI = await API.GetSearch();
  log.info(searchFromBrowser);
  log.info(searchFromAPI);
  let details = [];
  let changed = false;
  if (
    state === null ||
    (state.searchFromBrowser && JSON.stringify(searchFromBrowser) !== JSON.stringify(state.searchFromBrowser))
  ) {
    changed = true;
    details.push(`:compass: Les données affichées par le site ont changé`);
  }
  if (
    state === null ||
    (state.searchFromAPI && JSON.stringify(searchFromAPI) !== JSON.stringify(state.searchFromAPI))
  ) {
    changed = true;
    details.push(`:classical_building: Les données retournées par l'API ont changé`);
  }
  if (JSON.stringify(searchFromBrowser) !== JSON.stringify(searchFromAPI)) {
    if (changed === true || state === null || state.status === true) {
      details = details.join('\n');
      await Slack.SendMessage(
        `:large_red_square: Les résultats de la recherche sur le site ne correspondent pas aux résultats de l'API:\n${details}`,
      );
    }
    await State.SetState('search', {
      status: false,
      searchFromAPI: searchFromAPI,
      searchFromBrowser: searchFromBrowser,
    });
  } else {
    if (changed === true || state === null || state.status === false) {
      await Slack.SendMessage(
        `:large_green_square: Les résultats de la recherche sur le site correspondent de nouveau aux résultats de l'API.\n${details}`,
      );
    }
    await State.SetState('search', {
      status: true,
      searchFromAPI: searchFromAPI,
      searchFromBrowser: searchFromBrowser,
    });
  }
  log.info('end probe');
}

main();
