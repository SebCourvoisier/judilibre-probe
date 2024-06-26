const { logger } = require('./modules/logger');
const log = logger.child({
  module: 'main',
});

const Graceful = require('@ladjs/graceful');
const Bree = require('bree');

const bree = new Bree({
  root: require('path').join(__dirname, 'probes'),
  jobs: [
    {
      name: 'latest',
      interval: 'every 3 minute after 7:00am and before 11:50pm',
    },
    {
      name: 'search',
      interval: 'every 5 minute after 7:00am and before 11:50pm',
    },
  ],
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();
log.info('start');
bree.start();
