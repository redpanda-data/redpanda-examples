package io.vectorized.withavro

import io.confluent.kafka.streams.serdes.avro.GenericAvroSerde
import io.vectorized.{Constants, Person}
import org.apache.avro.generic.GenericRecord
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.{KafkaStreams, KeyValue, StreamsBuilder}
import org.apache.kafka.streams.kstream.{Consumed, Produced}

import java.time.{LocalDate, Period, ZoneId}
import java.util.{Collections, Date, Properties}

object AvroStreamsProcessor {
  private final val brokers = "localhost:56799,localhost:56806,localhost:56807"
  private final val schemaRegistryUrl = "http://localhost:8081"

  private final val props = new Properties
  props.put("bootstrap.servers", this.brokers)
  props.put("application.id", "redpanda-examples")

  def process(): Unit = {
    val streamsBuilder = new StreamsBuilder
    val avroSerde = new GenericAvroSerde
    avroSerde.configure(Collections.singletonMap("schema.registry.url", schemaRegistryUrl), false)
    val avroStream = streamsBuilder.stream(Constants.getPersonsAvroTopic, Consumed.`with`(Serdes.String, avroSerde))
    val personAvroStream = avroStream.mapValues((v: GenericRecord) =>
      new Person(
        v.get("firstName").toString,
        v.get("lastName").toString,
        new Date(v.get("birthDate").asInstanceOf[Long]),
        v.get("city").toString,
        v.get("ipAddress").toString))
    val ageStream = personAvroStream.map((_, v) => {
      val birthDateLocal = v.birthDate.toInstant.atZone(ZoneId.systemDefault).toLocalDate
      val age = Period.between(birthDateLocal, LocalDate.now).getYears
      new KeyValue[String, String](v.firstName + ' ' + v.lastName, String.valueOf(age))
    })
    ageStream.to(Constants.getAgesTopic, Produced.`with`(Serdes.String, Serdes.String))
    val topology = streamsBuilder.build
    val streams = new KafkaStreams(topology, props)
    streams.start()
  }

  def main(args: Array[String]): Unit = process()
}