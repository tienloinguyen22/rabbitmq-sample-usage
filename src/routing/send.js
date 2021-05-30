const amqp = require('amqplib/callback_api');

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

    const severities = ['info', 'warning', 'error'];
    setInterval(() => {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      channel.publish(exchange, severity, Buffer.from(`[${severity}] Hello world`));
      console.log('🚀 Sent: ', severity);
    }, 1000);
  });
});