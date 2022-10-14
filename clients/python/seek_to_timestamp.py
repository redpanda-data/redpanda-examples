import logging
from kafka import (KafkaAdminClient, KafkaProducer, KafkaConsumer)
from kafka import TopicPartition
from kafka.errors import UnknownTopicOrPartitionError

logging.basicConfig(level=logging.INFO)
brokers = "localhost:19092"
topic_name = "test"

admin = KafkaAdminClient(
    bootstrap_servers=brokers
)
try:
    admin.delete_topics([topic_name])
except UnknownTopicOrPartitionError as e:
    logging.warning(e)
admin.close()

producer = KafkaProducer(
    bootstrap_servers=brokers,
    acks="all"
)

for i in range(100):
    future = producer.send(topic_name, str(i).encode())
    result = future.get(timeout=100)
    logging.info(result)
    if i == 50:
        seek_ms = result.timestamp
        logging.info(f"Timestamp for offset {result.offset}: {result.timestamp}")

producer.flush()
producer.close()

consumer = KafkaConsumer(    
    bootstrap_servers=brokers,
    auto_offset_reset="earliest"
)
consumer.subscribe(topic_name)

partitions = consumer.partitions_for_topic(topic_name)
for p in partitions:
    tp = TopicPartition(topic_name, p)
    result = consumer.offsets_for_times({tp: seek_ms})
    offset = result[tp].offset
    logging.info(f"Seeking to offset {offset} for timestamp {seek_ms}")
    consumer.seek(tp, offset)

batch = consumer.poll(timeout_ms=10000)
for records in batch.values():
    for r in records:
        logging.info(r)

consumer.close()
