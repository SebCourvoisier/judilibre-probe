const { logger } = require('./logger');
const log = logger.child({
  module: 'Browser',
});

const puppeteer = require('puppeteer');

class Browser {
  static async GetLatest() {
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
  }
}

exports.Browser = Browser;
