package io.vectorized.withprotobuf

import com.github.javafaker.Faker
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer
import io.vectorized.Constants
import io.vectorized.Person.PersonMessage
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerConfig, ProducerRecord}
import org.apache.kafka.common.serialization.StringSerializer
import java.util.Properties

object ProtobufProducer {
  private final val brokers = "localhost:56799,localhost:56806,localhost:56807";
  private final val schemaRegistryUrl = "http://localhost:8081"
  private final val props = new Properties
  props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers)
  props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, classOf[StringSerializer])
  props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, classOf[KafkaProtobufSerializer[PersonMessage]])
  props.put("schema.registry.url", schemaRegistryUrl)
  private final val producer = new KafkaProducer[String, PersonMessage](props)

  def produce(ratePerSecond: Int): Unit = {
    val waitTimeBetweenIterationsMs = 1000L / ratePerSecond
    val faker = new Faker
    while (true) {
      val person = PersonMessage.newBuilder
        .setFirstName(faker.name.firstName)
        .setLastName(faker.name.lastName)
        .setBirthDate(faker.date.birthday.getTime)
        .setCity(faker.address.city)
        .setIpAddress(faker.internet.ipV4Address)
        .build
      val futureResult =
        producer.send(new ProducerRecord[String, PersonMessage](Constants.getPersonsProtobufTopic, person))
      Thread.sleep(waitTimeBetweenIterationsMs)
      futureResult.get
    }
  }

  def main(args: Array[String]):Unit = produce(2)
}