const { logger } = require('./modules/logger');
const log = logger.child({
  module: 'main',
});

async function main() {
  log.info('hello world');
}

main();
