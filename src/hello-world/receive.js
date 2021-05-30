const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    const queue = 'hello';
    channel.assertQueue(queue, {
      durable: false
    });
    channel.consume(queue, (msg) => {
      console.log('🚀 Received: ', msg.content.toString());
    }, { noAck: true });
  });
});