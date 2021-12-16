package com.redpanda.examples.clients

import java.io.FileReader
import java.util.Properties
import scala.io.Source
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerRecord}
import play.api.libs.json._

object ProducerExample extends App {
    if (args.length == 0) {
        println("Usage: ProducerExample config topic")
    }

    // Load producer configuration from properties file, which must 
    // include `bootstrap.servers` as a minimum.
    val props = new Properties()
    props.load(new FileReader(args(0)))
    props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
    props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer")
    println(props)

    val producer = new KafkaProducer[String, String](props)
    val topic = args(1)

    // S&P 500 (SPX) historical market data downloaded from nasdaq.com:
    // https://www.nasdaq.com/market-activity/index/spx/historical
    val input = Source.fromResource("spx_historical_data.csv").getLines
    val header = input.take(1).next
    val headarr = header.split(",", -1)
    println(s"Header: $header")

    for (line <- input) {
        // Write records to Redpanda as JSON formatted string
        val fields = line.split(",", -1)
        val obj = headarr zip fields
        val record = new ProducerRecord(
            topic,
            "SPX",
            Json.stringify(Json.toJson(obj.toMap[String, String]))
        )
        producer.send(record)
        println(s"Produced message: $record")
        Thread.sleep(100)
    }
    producer.flush()
    producer.close()
}
