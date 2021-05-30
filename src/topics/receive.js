const amqp = require('amqplib/callback_api');

args = process.argv.slice(2);

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    const exchange = 'topic-logs';
    channel.assertExchange(exchange, 'topic', { durable: true });

    channel.assertQueue('', { exclusive: true }, (queueError, assertQueue) => {
      if (queueError) {
        throw queueError;
      }

      // Binding keys must be in form of "kern.*", "*.error" or "cron.#".
      // "*" => Exactly 1 word
      // "#" => 0/more words
      for (const item of args) {
        channel.bindQueue(assertQueue.queue, exchange, item);
      }

      channel.consume(assertQueue.queue, (msg) => {
        console.log('🚀 Received: ', msg.content.toString());
      });
    });
  });
});