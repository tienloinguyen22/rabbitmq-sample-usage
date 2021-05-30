const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    const exchange = 'topic-logs';
    channel.assertExchange(exchange, 'topic', { durable: true }); // A "topic" exchange can have abitrary routing key, joining by ".". Ex: "cron.warning", "kern.error"...

    const facilities = ['auth', 'cron', 'kern'];
    const severities = ['info', 'warning', 'error'];
    setInterval(() => {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const facility = facilities[Math.floor(Math.random() * facilities.length)];
      channel.publish(exchange, `${facility}.${severity}`, Buffer.from(`[${facility}.${severity}] Hello world`));
      console.log('🚀 Sent: ', `${facility}.${severity}`);
    }, 1000);
  });
});