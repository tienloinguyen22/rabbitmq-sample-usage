const amqp = require('amqplib/callback_api');

const ids = [];

amqp.connect('amqp://localhost', (connError, conn) => {
  if (connError) {
    throw connError;
  }

  conn.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError
    }

    const requestQueue = 'rpc-requests';
    const responseQueue = 'rpc-responses'
    channel.assertQueue(requestQueue, { durable: true });
    channel.assertQueue(responseQueue, { durable: true });

    setInterval(() => {
      const id = `${new Date().getTime()}`;
      ids.push(id);
      channel.sendToQueue(requestQueue, Buffer.from('Hello world'), { replyTo: responseQueue, correlationId: id });
    }, 1000);

    channel.consume(responseQueue, (msg) => {
      if (ids.includes(msg.properties.correlationId)) {
        console.log('🚀 Reponse: ', msg.content.toString());
      }
    });
  });
});