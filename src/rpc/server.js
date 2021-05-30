const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError
    }

    const requestQueue = 'rpc-requests';
    channel.assertQueue(requestQueue, { durable: true });

    channel.consume(requestQueue, (msg) => {
      console.log('🚀 Request: ', msg.content.toString());

      channel.sendToQueue(msg.properties.replyTo, Buffer.from('This is a response'), { correlationId: msg.properties.correlationId })
    });
  });
});