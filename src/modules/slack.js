const { logger } = require('./logger');
const log = logger.child({
  module: 'Slack',
});

const { WebClient } = require('@slack/web-api');
const slackToken = process.env.SLACK_TOKEN;
const conversationId = process.env.SLACK_CHANNEL;
const slackWebClient = new WebClient(slackToken);

class Slack {
  static async SendMessage(msg) {
    const result = await slackWebClient.chat.postMessage({
      text: msg,
      channel: conversationId,
    });

    log.info(`Successfully send message ${result.ts} in conversation ${conversationId}`);
  }
}

exports.Slack = Slack;
