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
    return result;
  }

  static async GetSearch(query) {
    const result = [];
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      if (query === undefined) {
        query = '';
      }
      await page.goto(
        `https://www.courdecassation.fr/recherche-judilibre?search_api_fulltext=${query}&date_du=&date_au=&judilibre_juridiction=all&op=Rechercher%20sur%20judilibre`,
      );

      const searchResultSelector = '#block-ccass-content > div > div.view-judilibre';
      const searchResultBlock = await page.$(searchResultSelector);
      const searchArretSelector = '.decision-item';
      const arretBlocks = await searchResultBlock.$$(searchArretSelector);
      for (let i = 0; i < arretBlocks.length; i++) {
        const searchTitle = 'h3.inline-block';
        const arretTitle = await arretBlocks[i].$(searchTitle);
        const titleValue = await arretTitle.evaluate((el) => el.textContent);
        const titleElements = `${titleValue}`.trim().split(/\s-\s/);
        result.push({
          date: `${titleElements[0]}`.trim(),
          pourvoi: `${titleElements[2]}`.replace(/°\s+(\d)/gim, '°$1').trim(),
        });
      }
      await browser.close();
    } catch (e) {
      log.error(e);
    }
    if (result.length === 0) {
      log.warn('no data');
    }
    return result;
  }
}

exports.Browser = Browser;
