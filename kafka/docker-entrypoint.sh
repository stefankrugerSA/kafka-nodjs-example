#!/bin/sh

set -ex
echo "  * Starting Zookeeper"
nohup ./kafka_2.12-2.1.0/bin/zookeeper-server-start.sh kafka_2.12-2.1.0/config/zookeeper.properties > zookeeper.log &
sleep 10;
echo "  * Starting Kafka"
./kafka_2.12-2.1.0/bin/kafka-server-start.sh server.properties
