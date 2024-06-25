const { logger } = require('./logger');
const log = logger.child({
  module: 'API',
});

const needle = require('needle');
const { DateTime } = require('luxon');

class API {
  static async GetLatest() {
    let response = null;
    try {
      response = await needle(
        'get',
        `https://search.judilibre.io/export?batch=0&abridged=true&publication=b&publication=r&batch_size=20&sort=date&order=desc`,
        {
          rejectUnauthorized: false,
        },
      );
      if (response && response.body && response.body.results && Array.isArray(response.body.results)) {
        for (let i = 0; i < response.body.results.length; i++) {
          const dateTime = DateTime.fromISO(response.body.results[i].decision_date);
          const dateValue = dateTime.setLocale('fr').toLocaleString({ month: 'long', day: 'numeric' });
          const pourvoiValue = `Pourvoi n°${response.body.results[i].number}`;
          log.info([dateValue, pourvoiValue]);
        }
      } else {
        log.warn('no data');
      }
    } catch (e) {
      log.error(e);
    }
  }
}

exports.API = API;
