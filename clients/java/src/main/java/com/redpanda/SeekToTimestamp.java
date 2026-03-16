package com.redpanda;

import java.io.IOException;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.ExecutionException;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.errors.TopicExistsException;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;

public class SeekToTimestamp {
    private String topic;
    private Properties config;
    
    public SeekToTimestamp(String topic, Properties config) {
        this.topic = topic;
        this.config = config;
    }

    /**
     * Creates a new topic in Redpanda.
     */
    public void createTopic() {
        final AdminClient adminClient = AdminClient.create(config);
        final NewTopic newTopic = new NewTopic(topic, Optional.empty(), Optional.empty());
        
        try {
            adminClient.deleteTopics(Collections.singletonList(topic)).all().get();
        } catch (final InterruptedException | ExecutionException e) {
            System.out.println(e.getMessage());
        }

        try {            
            adminClient.createTopics(Collections.singletonList(newTopic)).all().get();
        } catch (final InterruptedException | ExecutionException e) {
            System.out.println(e.getMessage());
            if (!(e.getCause() instanceof TopicExistsException)) {
                throw new RuntimeException(e);
            }
        } finally {
            adminClient.close();
        }
    }

    /**
     * Produces 100 records on the topic.
     * @return Returns the timestamp for the 50th record.
     */
    public Long write() {
        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(config);
        
        Long epoch = 0L;
        for (Long i = 0L; i < 100; i++) {
            ProducerRecord<String, String> record = new ProducerRecord<String, String>(
                topic, 
                String.format("key-%d", i),
                String.format("value-%d", i)
            );
            
            try {
                RecordMetadata metadata = producer.send(record).get();
                if (i == 50) {
                    System.out.printf("Timestamp for offset %d: %d %n", 
                        metadata.offset(), metadata.timestamp());
                    epoch = metadata.timestamp();
                }
                System.out.println(metadata);
            } catch (final InterruptedException | ExecutionException e) {
                System.out.println(e.getMessage());
            }
        }

        producer.flush();
        producer.close();
        return epoch;
    }

    /**
     * Consumes from the partition offsets associated with the timestamp.
     * @param timestamp
     */
    public void readFromTimestamp(final Long timestamp) {
        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(config);

        Map<TopicPartition, Long> query = new HashMap<TopicPartition, Long>();
        consumer.partitionsFor(topic).forEach(partition -> {
            TopicPartition tp = new TopicPartition(partition.topic(), partition.partition());
            query.put(tp, timestamp);
        });

        consumer.assign(query.keySet());
        consumer.offsetsForTimes(query).entrySet().forEach(result -> {
            consumer.seek(result.getKey(), result.getValue().offset());
        });

        try {
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(10));
                if (records.count() == 0) {
                    System.out.println("No more records");
                    break;
                }
                records.forEach(record -> {
                    System.out.printf("Consumed record: %s %n", record.toString());
                });
            }
        } catch(Exception e) {
            System.out.println(e);
        } finally {
            consumer.close();
        }
    }

    public static void main(final String[] args) throws IOException {
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:19092");
        props.put("key.serializer", StringSerializer.class.getName());
        props.put("value.serializer", StringSerializer.class.getName());
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", StringDeserializer.class.getName());
        props.put("group.id", "firefox");
        
        SeekToTimestamp client = new SeekToTimestamp("test", props);
        client.createTopic();
        Long epoch = client.write();
        client.readFromTimestamp(epoch);
    }
}
