const { logger } = require('./modules/logger');
const log = logger.child({
  module: 'main',
});

const { WebClient } = require('@slack/web-api');
const slackToken = process.env.SLACK_TOKEN;
const conversationId = process.env.SLACK_CHANNEL;
const slackWebClient = new WebClient(slackToken);

const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.courdecassation.fr');

  const searchResultSelector = '#block-derniersarretsblock';
  const derniersArretsBlock = await page.$(searchResultSelector);

  const searchArretSelector = '.arret';
  const arretBlocks = await derniersArretsBlock.$$(searchArretSelector);

  for (let i = 0; i < arretBlocks.length; i++) {
    const searchDate = 'p.date';
    const arretDate = await arretBlocks[i].$(searchDate);
    const value = await arretDate.evaluate((el) => el.textContent);
    log.info(value);
  }

  await browser.close();

  (async () => {
    const result = await slackWebClient.chat.postMessage({
      text: 'Hello world (from script)!',
      channel: conversationId,
    });

    log.info(`Successfully send message ${result.ts} in conversation ${conversationId}`);
  })();
}

main();
