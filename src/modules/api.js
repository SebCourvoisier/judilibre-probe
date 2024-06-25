const { logger } = require('./logger');
const log = logger.child({
  module: 'API',
});

const needle = require('needle');

// curl --location 'https://search.judilibre.io/export?batch=0&abridged=true&publication=b&batch_size=20&publication=r&order=desc&sort=date'

class API {
  static async GetLatest() {
    let response = null;
    try {
      response = await needle(
        'get',
        `https://search.judilibre.io/export?batch=0&abridged=true&publication=b&batch_size=20&publication=r&order=desc&sort=date`,
        {
          rejectUnauthorized: false,
        },
      );
    } catch (e) {
      log.error(e);
    }
    log.info(response);
  }
}

exports.API = API;
