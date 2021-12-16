package com.redpanda.examples.clients

import java.io.FileReader
import java.util.{Collections, Properties}
import org.apache.kafka.clients.consumer.{KafkaConsumer, ConsumerRecord}
import scala.collection.JavaConverters._

object ConsumerExample extends App {
    if (args.length == 0) {
        println("Usage: ConsumerExample config topic")
    }

    // Load consumer configuration from properties file, which must 
    // include `bootstrap.servers` as a minimum.
    val props = new Properties()
    props.load(new FileReader(args(0)))
    props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    println(props)

    val consumer = new KafkaConsumer[String, String](props)
    consumer.subscribe(Collections.singletonList(args(1)))

    while(true) {
        val msgs = consumer.poll(100)
        for (m <- msgs.asScala) {
            println(s"Consumed message: $m")
        }
    }
}