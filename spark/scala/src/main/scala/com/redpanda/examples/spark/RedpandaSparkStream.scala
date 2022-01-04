package com.redpanda.examples.spark

import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.streaming.Trigger

object RedpandaSparkStream extends App {
    if (args.length == 0) {
        println("Usage: RedpandaSparkStream brokers topic_in topic_out")
    }

    val spark = SparkSession
        .builder
        .appName("RedpandaSparkStream")
        .getOrCreate()
    spark.sparkContext.setLogLevel("ERROR")
    import spark.implicits._

    val stream = spark
        .readStream
        .format("kafka")
        .option("kafka.bootstrap.servers", args(0))
        .option("subscribe", args(1))
        .option("startingOffsets", "earliest")
        .load()
    val df = stream.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)").as[(String, String)]

    val marketActivity = StructType(List(
        StructField("Date", StringType, true),
        StructField("CloseLast", StringType, true),
        StructField("Volume", StringType, true),
        StructField("Open", StringType, true),
        StructField("High", StringType, true),
        StructField("Low", StringType, true)
    ))

    // Parse JSON value into struct and add a new column for
    // the difference between the high and low values.
    val intraDiff = df
        .select($"key", from_json($"value", marketActivity).as("value"))
        .withColumn("value", 
            struct(
                $"value.*",
                bround($"value.High".cast(DoubleType) - $"value.Low".cast(DoubleType), 2) as "IntraDiff"
        ))               
    intraDiff.printSchema()

    // Write to console in 2 seconds batches
    val query = intraDiff
        .writeStream
        .outputMode("append")
        .format("console")
        .option("truncate", false)
        .trigger(Trigger.ProcessingTime("2 seconds"))
        .start()

    // Write back to Redpanda
    val write = intraDiff
        .select($"key", to_json($"value").as("value"))
        .writeStream
        .format("kafka")
        .option("kafka.bootstrap.servers", args(0))
        .option("topic", args(2))
        .option("checkpointLocation", "/tmp/spark")
        .start()

    write.awaitTermination()
}
