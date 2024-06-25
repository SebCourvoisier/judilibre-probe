const { logger } = require('./logger');
const log = logger.child({
  module: 'Slack',
});

const { WebClient } = require('@slack/web-api');
const slackToken = process.env.SLACK_TOKEN;
const conversationId = process.env.SLACK_CHANNEL;

class Slack {
  static async SendMessage(msg) {
    try {
      const slackWebClient = new WebClient(slackToken);
      await slackWebClient.chat.postMessage({
        text: msg,
        channel: conversationId,
      });
      log.info(`send message "${msg}"`);
    } catch (e) {
      log.error(e);
    }
  }
}

exports.Slack = Slack;
