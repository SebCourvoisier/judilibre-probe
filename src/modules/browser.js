const { logger } = require('./logger');
const log = logger.child({
  module: 'Browser',
});

const puppeteer = require('puppeteer');

class Browser {
  static async GetLatest() {
    const result = [];
    try {
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
        const dateValue = await arretDate.evaluate((el) => el.textContent);
        const searchPourvoi = 'p.pourvoi';
        const arretPourvoi = await arretBlocks[i].$(searchPourvoi);
        const pourvoiValue = await arretPourvoi.evaluate((el) => el.textContent);
        result.push({
          date: dateValue,
          pourvoi: pourvoiValue,
        });
      }
      await browser.close();
    } catch (e) {
      log.error(e);
    }
    if (result.length === 0) {
      log.warn('no data');
    }
    return result.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }
      if (a.pourvoi < b.pourvoi) {
        return -1;
      }
      if (a.pourvoi > b.pourvoi) {
        return 1;
      }
      return 0;
    });
  }
}

exports.Browser = Browser;
