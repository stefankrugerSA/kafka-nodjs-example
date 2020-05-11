const express = require('express'),
  { v4: uuidv4 } = require('uuid'),
  kafkaServer = process.env.KAFKA_SERVER || "127.0.0.1:9092",
  kafka = require('kafka-node'),
  Producer = kafka.Producer,
  client = new kafka.KafkaClient({ kafkaHost: kafkaServer }),
  producer = new Producer(client),
  KeyedMessage = kafka.KeyedMessage,
  app = express(),
  port = 8000

//Initialize Kafka Producer
producer.on('ready', async () => {
  console.log('[kafka-producer] -> ready')
  app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
});

app.configure(function () {
  app.use(express.bodyParser());
});

producer.on('error', (err) => {
  console.log(err);
  console.log('[kafka-producer] -> connection errored');
  process.exit();
});

//Promisefy producer send function
sendMessages = (messages, topic) => new Promise((resolve, reject) => {
  producer.send([{ topic, messages }], (err, data) => {
    err ? reject(err) : resolve({ data });
  })
});

app.post('/messages/:topic/:times', async ({ body, params: { topic, times } }, res) => {
  let messages = [...Array(Number(times))].map((_, i) => new KeyedMessage(uuidv4(), JSON.stringify(body)))
  res.send(await sendMessages(messages, topic).catch(e => { console.log(e) }));
});

console.log(`[kafka-producer] -> Establishing connection to ${kafkaServer}`)


