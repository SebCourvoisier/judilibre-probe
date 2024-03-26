require('./env');
const pino = require('pino');

const logger = pino({
  name: process.env.APP_ID || 'judilibre-probe',
  level: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
});

module.exports.logger = logger;
