package io.vectorized.plainjson

import io.vectorized.{Constants, Person}
import org.apache.kafka.clients.consumer.{ConsumerConfig, KafkaConsumer}
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerConfig, ProducerRecord}
import org.apache.kafka.common.serialization.{StringDeserializer, StringSerializer}

import java.time.{Duration, LocalDate, Period, ZoneId}
import java.util.{Collections, Properties}

// rpk topic create ages --brokers 127.0.0.1:56799,127.0.0.1:56806,127.0.0.1:56807
// rpk topic consume persons --brokers 127.0.0.1:56799,127.0.0.1:56806,127.0.0.1:56807

object JsonProcessor {
  private final val brokers = "localhost:56799,localhost:56806,localhost:56807"
  private final val consumerProps = new Properties
  consumerProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers)
  consumerProps.put(ConsumerConfig.GROUP_ID_CONFIG, "person-processor")
  consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, classOf[StringDeserializer])
  consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, classOf[StringDeserializer])
  private final val consumer = new KafkaConsumer[String, String](consumerProps)
  private final val producerProps = new Properties
  producerProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers)
  producerProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
  producerProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
  private final val producer = new KafkaProducer[String, String](producerProps)

  def process(pollRate: Int): Unit = {
    consumer.subscribe(Collections.singletonList(Constants.getPersonsTopic))
    while (true) {
      val records = consumer.poll(Duration.ofSeconds(pollRate))
      records.forEach(r => {
        val person = Constants.getJsonMapper.readValue(r.value(), classOf[Person])
        val birthDateLocal = person.birthDate.toInstant.atZone(ZoneId.systemDefault).toLocalDate
        val age = Period.between(birthDateLocal, LocalDate.now).getYears
        val future = producer.send(
          new ProducerRecord[String, String](
            Constants.getAgesTopic, person.firstName + ' ' + person.lastName,
            String.valueOf(age)))
        future.get
      })
    }
  }

  def main(args: Array[String]): Unit = process(1)
}
