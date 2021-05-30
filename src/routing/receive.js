const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    const exchange = 'selective-logs';
    channel.assertExchange(exchange, 'direct', { durable: true }); // A direct exchange send a message to a queue if the "binding key" of the queue match the "routing key" of the message

    channel.assertQueue('', { exclusive: true }, (queueError, assertQueue) => {
      if (queueError) {
        throw queueError;
      }

      // Bind this queue to "logs" exchange with "binding keys" read from CLI
      const severities = ['info', 'warning', 'error'];
      for (const item of args) {
        if (severities.includes(item)) {
          channel.bindQueue(assertQueue.queue, exchange, item);
        }
      }

      channel.consume(assertQueue.queue, (msg) => {
        console.log('🚀 Received: ', msg.content.toString());
      });
    });
  });
});