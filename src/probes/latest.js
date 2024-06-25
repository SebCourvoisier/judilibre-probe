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
      let details = [];
      if (latestFromBrowser.length < latestFromAPI.length) {
        for (let i = 0; i < latestFromAPI.length; i++) {
          if (i < latestFromBrowser.length) {
            if (JSON.stringify(latestFromAPI[i]) !== JSON.stringify(latestFromBrowser[i])) {
              details.push(
                `- [index ${i + 1}] Browser: \`${JSON.stringify(latestFromBrowser[i])}\` / API: \`${JSON.stringify(
                  latestFromAPI[i],
                )}\``,
              );
            }
          } else {
            details.push(`- [index ${i + 1}] Browser: \`empty\` / API: \`${JSON.stringify(latestFromAPI[i])}\``);
          }
        }
      } else if (latestFromBrowser.length > latestFromAPI.length) {
        for (let i = 0; i < latestFromBrowser.length; i++) {
          if (i < latestFromAPI.length) {
            if (JSON.stringify(latestFromAPI[i]) !== JSON.stringify(latestFromBrowser[i])) {
              details.push(
                `- [index ${i + 1}] Browser: \`${JSON.stringify(latestFromBrowser[i])}\` / API: \`${JSON.stringify(
                  latestFromAPI[i],
                )}\``,
              );
            }
          } else {
            details.push(`- [index ${i + 1}] Browser: \`${JSON.stringify(latestFromBrowser[i])}\` / API: \`empty\``);
          }
        }
      } else {
        if (latestFromBrowser.length > 0) {
          for (let i = 0; i < latestFromBrowser.length; i++) {
            if (JSON.stringify(latestFromAPI[i]) !== JSON.stringify(latestFromBrowser[i])) {
              details.push(
                `- [index ${i + 1}] Browser: \`${JSON.stringify(latestFromBrowser[i])}\` / API: \`${JSON.stringify(
                  latestFromAPI[i],
                )}\``,
              );
            }
          }
        } else {
          details.push(`- Browser: \`all empty\` / API: \`all empty\``);
        }
      }
      details = details.join('\n');
      await Slack.SendMessage(
        `:large_red_square: Les données du bloc des dernières décisions sur le site ne correspondent pas aux données de l'API:\n${details}`,
      );
    }
    await State.SetState('latest', {
      status: false,
    });
  } else {
    if (state === null || state.status === false) {
      await Slack.SendMessage(
        ":large_green_square: Les données du bloc des dernières décisions sur le site correspondent de nouveau aux données de l'API.",
      );
    }
    await State.SetState('latest', {
      status: true,
    });
  }
  log.info('end probe');
}

main();
