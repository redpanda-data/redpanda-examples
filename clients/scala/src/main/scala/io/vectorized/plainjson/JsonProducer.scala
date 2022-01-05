package io.vectorized.plainjson

import com.github.javafaker.Faker
import io.vectorized.{Constants, Person}
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerConfig, ProducerRecord}
import org.apache.kafka.common.serialization.StringSerializer

import java.util.Properties

// rpk topic create persons --brokers 127.0.0.1:56799,127.0.0.1:56806,127.0.0.1:56807

object JsonProducer {
  private final val brokers = "localhost:56799,localhost:56806,localhost:56807"
  private final val props = new Properties
  props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers)
  props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
  props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
  private final val producer = new KafkaProducer[String, String](props)

  def produce(ratePerSecond: Int): Unit = {
    val waitTimeBetweenIterationsMs = 1000L / ratePerSecond.toLong
    val faker = new Faker
    while (true) {
      val fakePerson = new Person(
        faker.name.firstName,
        faker.name.lastName,
        faker.date.birthday,
        faker.address.city,
        faker.internet.ipV4Address)
      val fakePersonJson = Constants.getJsonMapper.writeValueAsString(fakePerson)
      val futureResult =
        producer.send(new ProducerRecord[String, String](Constants.getPersonsTopic, fakePersonJson))
      futureResult.get
      Thread.sleep(waitTimeBetweenIterationsMs)
    }
  }

  def main(args: Array[String]): Unit = produce(2)
}
