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
    channel.prefetch(1); // Fair dispatch instead of round robin. Only dispatch 1 message to this consumer at a time
    channel.consume(queue, (msg) => {
      console.log('🚀 Received: ', msg.content.toString());
      const milliseconds = (msg.content.toString().match(/o/g) || []).length * 1000;
      setTimeout(() => {
        channel.ack(msg)
      }, milliseconds);
    }, { noAck: false });
  });
});