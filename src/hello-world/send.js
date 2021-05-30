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
    const msg = 'Hello world';
    channel.assertQueue(queue, {
      durable: true
    });
    setInterval(() => {
      channel.sendToQueue(queue, Buffer.from(msg));
      console.log('🚀 Sent: ', msg);
    }, 500);
  });
});