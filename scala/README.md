# Redpanda Examples in Scala
[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://vectorized.io/slack)

## Build

```
$ git clone https://github.com/vectorizedio/redpanda-examples.git
$ cd redpanda-examples/scala
$ sbt clean assembly
$ ls target/scala-2.12/redpanda-examples-assembly-1.0.0.jar
```

## Apache Spark Streaming Example

Demonstrates how to read from and write to Redpanda with Spark Streaming:

* [Spark Streaming + Kafka Integration Guide](https://spark.apache.org/docs/latest/streaming-kafka-0-10-integration.html)
* [Structured Streaming + Kafka Integration Guide](https://spark.apache.org/docs/latest/structured-streaming-kafka-integration.html)

### Create Local Environment

Use [Docker Compose](../docker-compose/redpanda-spark.yml) to create a local environment with three containers: Spark Master, Spark Worker, and Redpanda Broker.

```
$ cd redpanda-examples/docker-compose
$ docker-compose -f redpanda-spark.yml up -d
[+] Running 4/4
 ⠿ Network docker-compose_redpanda_network  Created 
 ⠿ Container spark-master                   Started
 ⠿ Container redpanda                       Started
 ⠿ Container spark-worker                   Started
...
$ docker-compose -f redpanda-spark.yml down -v
```

### Write Messages to Redpanda

The [ProducerExample](./src/main/scala/com/redpanda/examples/clients/ProducerExample.scala) writes stock market activity data to Redpanda ([SPX Historical Data](https://www.nasdaq.com/market-activity/index/spx/historical) downloaded from nasdaq.com) as JSON formatted messages:

```json
{"Volume":"--","High":"4713.57","Close/Last":"4712.02","Open":"4687.64","Date":"12/10/2021","Low":"4670.24"}
```

Run the Producer with `sbt` or `scala`, passing the producer configuration (must include `bootstrap.servers`) and topic name as arguments:

```
$ sbt "run redpanda.config spx_history"
Multiple main classes detected. Select one to run:
 [1] com.redpanda.examples.clients.ConsumerExample
 [2] com.redpanda.examples.clients.ProducerExample *
 [3] com.redpanda.examples.spark.RedpandaSparkStream

Or...

$ scala -classpath target/scala-2.12/redpanda-examples-assembly-1.0.0.jar com.redpanda.examples.clients.ProducerExample redpanda.config spx_history
```

### Run Spark Streaming Application

The Streaming application [RedpandaSparkStream](./src/main/scala/com/redpanda/examples/spark/RedpandaSparkStream.scala) reads the JSON formatted messages from Redpanda in 2 second microbatches into a Spark SQL DataFrame. A simple function is run on the DataFrame to derive a new column, before the data is written back to another Redpanda topic. The stream is also printed to the console.

To avoid having to install Spark on your local machine, the easiest way to run the application is to spin up another Docker container with the necessary libraries already installed. To make it even easier, bind mount the local directoy on the container for easy access to the target `.jar` file:

```
$ docker run --rm -it --user=root -e SPARK_MASTER="spark://spark-master:7077" -v `pwd`:/project --network docker-compose_redpanda_network docker.io/bitnami/spark:3 /bin/bash

# spark-submit --master $SPARK_MASTER --class com.redpanda.examples.spark.RedpandaSparkStream /project/target/scala-2.12/redpanda-examples-assembly-1.0.0.jar 172.24.1.4:9092 spx_history spx_history_diff
```

Note that the Redpanda internal address:port must be specified from within the container `172.24.1.4:9092` and the external address:port from the local machine `localhost:19092`.

### Read Message from Redpanda

Consume the modified messages from Redpanda using [ConsumerExample](./src/main/scala/com/redpanda/examples/clients/ConsumerExample.scala):

```
$ sbt "run redpanda.config spx_history_diff"
Multiple main classes detected. Select one to run:
 [1] com.redpanda.examples.clients.ConsumerExample *
 [2] com.redpanda.examples.clients.ProducerExample
 [3] com.redpanda.examples.spark.RedpandaSparkStream

Or...

$ scala -classpath target/scala-2.12/redpanda-examples-assembly-1.0.0.jar com.redpanda.examples.clients.ConsumerExample redpanda.config spx_history_diff
```

Or simply use `rpk`:
```
$ rpk topic consume spx_history_diff --brokers localhost:19092 --offset "start"
```
