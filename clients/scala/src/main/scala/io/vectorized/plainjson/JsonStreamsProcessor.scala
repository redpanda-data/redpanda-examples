package io.vectorized.plainjson

import io.vectorized.{Constants, Person}
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.{KafkaStreams, KeyValue, StreamsBuilder}
import org.apache.kafka.streams.kstream.{Consumed, Produced}

import java.time.{LocalDate, Period, ZoneId}
import java.util.Properties

// rpk topic create ages --brokers 127.0.0.1:56799,127.0.0.1:56806,127.0.0.1:56807
// rpk topic consume persons --brokers 127.0.0.1:56799,127.0.0.1:56806,127.0.0.1:56807

object JsonStreamsProcessor {
  private final val brokers = "localhost:56799,localhost:56806,localhost:56807"
  private final val props = new Properties
  props.put("bootstrap.servers", brokers)
  props.put("application.id", "redpanda-examples")

  def process(): Unit = {
    val streamsBuilder = new StreamsBuilder
    val personJsonStream =
      streamsBuilder.stream(Constants.getPersonsTopic, Consumed.`with`(Serdes.String, Serdes.String))
    val personStream = personJsonStream.mapValues(v => Constants.getJsonMapper.readValue(v, classOf[Person]))

    val ageStream = personStream.map((_, v) => {
      val startDateLocal = v.birthDate.toInstant.atZone(ZoneId.systemDefault).toLocalDate
      val age = Period.between(startDateLocal, LocalDate.now).getYears
      new KeyValue[String, String](v.firstName + " " + v.lastName, String.valueOf(age))
    })

    ageStream.to(Constants.getAgesTopic, Produced.`with`(Serdes.String, Serdes.String))
    val topology = streamsBuilder.build
    val streams = new KafkaStreams(topology, props)
    streams.start()
  }

  def main(args: Array[String]): Unit = process()

}