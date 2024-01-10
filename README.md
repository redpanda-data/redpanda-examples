[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://redpanda.com/slack)

# Redpanda Examples

A collection of examples to demonstrate how to interact with Redpanda from various clients and languages. Redpanda is Kafka API compatible. Redpanda is compatible with Apache Kafka versions 0.11 and later, with specific exceptions noted on [this page](https://docs.redpanda.com/current/develop/kafka-clients/).

## Directory

### Clients

There are a growing number of [client](./clients) examples.
Submit any new and/or interesting examples with a pull request!

| Client | Description |
| - | - |
| [Go](./clients/go) | Produce and Consume using [franz-go](https://github.com/twmb/franz-go) and [sarama](https://github.com/Shopify/sarama) |
| [Javascript](./clients/js/README.md) | Produce events, upload schemas to registry |
| [Python](./clients/python/README.md) | Produce and Consume events, and use the schema registry |

### Ebooks microservices payments

The `ebooks/` directory contains a Java app built with [Quarkus](https://quarkus.io/), which is a popular Java framework that uses Redpanda to power its Kafka dev service (see [this article](https://quarkus.io/guides/kafka-dev-services) for more details).
The Ebooks app implements a consumer which validates payments.

### Kubernetes

The `kubernetes/` directory contains examples you can run in a Kubernetes environment.

### Spark

The spark app shows how to read and write to Redpanda with Spark streaming.
A producer writes stock activity, then a streaming app reads this data from a topic and sends it into a Spark SQL DataFrame.
Spark then modifies the events before writing to another topic.
A consumer app then reads these modified events.
More details [here](./spark/scala/README.md).

### WebAssembly Transforms

The wasm app shows how to create a JavaScript-based module that compiles to WebAssembly, and uses an Avro schema to serialize JSON events.
More details [here](./wasm/js/transform_avro/README.md).

### Partner Integrations

Below is a sample of some of our partner integrations.

#### Deephaven

[Deephaven](https://deephaven.io/) is an open-core query engine for building apps and analytics with real-time streams and batch data.

##### Redpanda + Deephaven Demo

The demo follows closely the one defined for [Materialize](https://github.com/MaterializeInc/ecommerce-demo/blob/main/README_RPM.md). We want to showcase how you can accomplish the same workflow in [Deephaven](https://github.com/deephaven-examples/deephaven-debezium-demo), with Deephaven's query engine and Redpanda's streaming capabilities.


##### Docker-stats

Need to monitor your local machine in real time?  This example publishes your `docker stats` to Redpanda.  Written in Python, this is an out-of-the box solution to see when your Docker containers over-use their resources. See full example here: [deephaven-examples/redpanda-docker-stats](https://github.com/deephaven-examples/redpanda-docker-stats).

##### Stock Market

Want to monitor updating stock market data? Or see how to publish multiple topics to Redpanda?  This example creates tables to see stocks from [dxFeed](https://dxfeed.com/). See full example here: [deephaven-examples/redpanda-dxfeed-financial-data](https://github.com/deephaven-examples/redpanda-dxfeed-financial-data).
