const kafka = require('kafka-node'),
    Redis = require("redis"),
    Consumer = kafka.Consumer,
    kafkaServer = process.env.KAFKA_SERVER || "127.0.0.1:9092",
    consumerGroup = process.env.KAFKA_CONSUMER_GROUP || "example-consumer",
    client = new kafka.KafkaClient({ kafkaHost: kafkaServer }),
    admin = new kafka.Admin(client),
    topics = process.env.KAFKA_TOPICS || "test-topic,test-topic-2",
    redisPort = process.env.REDIS_PORT || 6379,
    redisHost = process.env.REDIS_HOST || "127.0.0.1",
    redisClient = Redis.createClient({host: redisHost, port: redisPort});

checkForDuplicateMessage = (messageKey) =>{
    return new Promise((resolve, reject) => {
        redisClient.get(id, (err, data) => {
            if (err) {
                console.log("Error", err)
                reject(true)
            }
            if (data != null) {
                //there is a duplicate message - > maybe write to duplicate topic that can send a message to slack etc...
                console.log(`Duplicate consumption, msg key : ${id}`)
                reject(true)
            } else {
                //insert new record to redis cache
                redisClient.setex(id, 3600, msg);
                // process your message
                resolve(false)
            }
        })
      });
}
consumeFromTopics = (topicList) => {
    let consumer = new Consumer(client, topicList.map(topicName => { return { topic: topicName } }), { autoCommit: true, groupId: consumerGroup });
    console.log("Consuming on topics", topicList)
    consumer.on('error', (err) => {
        console.log(err);
        //you should produce a message to an system opt channel here, detailing the exception
    });
    consumer.on('message', processMessage);
}

admin.on('ready', (err) => {
    //get list of all topics
    console.log("Admin client connnected to cluster");
    admin.listTopics((err, [nodeInfo, { metadata, clusterMetadata }]) => {
        let topicList = topics.split(',');
        var existingTopics = Object.keys(metadata);
        //find topics that doesnt exists in requested list and consume from those that does
        var topicsToCreate = topicList.filter(topic => !existingTopics.includes(topic)).map(i => {
            return { topic: i, partitions: 1, replicationFactor: 1 }
        });

        //Create topics that does not exists
        console.log("Creating new topics: ", topicsToCreate.map(t => t));
        admin.createTopics(topicsToCreate, (err, res) => {
            consumeFromTopics(topicList);
        });
    });
});

processMessage = async ({ topic, value, offset, partition, highWaterOffset, key }) => {
    //highly impotence, check if message has been consumed before
    var isDuplicate = await checkForDuplicateMessage(key).catch(e=>{return e})
    if(!isDuplicate){
        //process the message here
    }
    console.log(`Recieved Message : ${JSON.stringify({ topic, value, offset, partition, highWaterOffset, key })}`);
    
}

console.log(`Establishing Connection to ${kafkaServer}`)