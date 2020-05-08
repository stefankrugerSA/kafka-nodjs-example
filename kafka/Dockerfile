FROM parrotstream/ubuntu-java



RUN wget https://archive.apache.org/dist/kafka/2.1.0/kafka_2.12-2.1.0.tgz

RUN tar xzf kafka_2.12-2.1.0.tgz

# Prepare entrypoint
COPY ./docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh
COPY ./server.properties /


ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 9092 2181
