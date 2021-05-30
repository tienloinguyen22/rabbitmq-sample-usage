const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    const exchange = 'logs';
    channel.assertExchange('logs', 'fanout', { durable: true }); // Fanout exchange send all messages it received to all queues bind to it

    // Send message to exchange
    setInterval(() => {
      const msg = 'Hello world';
      channel.publish(exchange, '', Buffer.from(msg));
      console.log('🚀 Sent: ', msg);
    }, 1000);
  });
});