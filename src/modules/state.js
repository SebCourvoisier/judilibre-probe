const { logger } = require('./logger');
const log = logger.child({
  module: 'State',
});

const path = require('path');
const fs = require('fs/promises');

class State {
  static async GetState(key) {
    try {
      let state = null;
      if (/^[a-z]+$/i.test(key) === false) {
        throw new Error(`invalid key ${key}`);
      }
      const fileContent = (await fs.readFile(path.join(__dirname, '..', '..', 'state', `${key}.json`))).toString();
      state = JSON.parse(fileContent);
      return state;
    } catch (e) {
      log.error(e);
      return null;
    }
  }

  static async SetState(key, state) {
    try {
      if (/^[a-z]+$/i.test(key) === false) {
        throw new Error(`invalid key ${key}`);
      }
      if (state === undefined || typeof state !== 'object') {
        state = {};
      }
      state.time = new Date();
      const fileContent = JSON.stringify(state, null, 2);
      await fs.writeFile(path.join(__dirname, '..', '..', 'state', `${key}.json`), fileContent);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  }
}

exports.State = State;
