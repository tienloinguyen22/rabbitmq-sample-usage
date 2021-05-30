const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    const queue = 'tasks';
    channel.assertQueue(queue, { durable: true }); // Make the queue data survive even rabbitmq restart. Need to applied in both producer/consumer

    setInterval(() => {
      const msg = Array(Math.floor(Math.random() * 10)).fill('.').join('');
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true }); // Tell rabbitmq to save messages to disk instead on memory only
      console.log('🚀 Sent: ', msg);
    }, 1000);
  });
});