[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://vectorized.io/slack)

# Redpanda Examples

A collection of examples to demonstrate how to interact with Redpanda from various clients and languages. Redpanda is Kafka API compatible so any client that works with Kafka will work, but we have tested the ones listed [here](https://vectorized.io/docs/faq#What-clients-do-you-recommend-to-use-with-Redpanda).


## Integrations

Redpanda is easy to use, flexible and efficient.  Below are a small sampling of some of our partner integrations.

### [Deephaven](https://deephaven.io/)

Open-core query engine for building apps and analytics with real-time streams and batch data.  

#### Docker-stats

Need to monitor your local machine in real time?  This example publishes your `docker stats` to Redpanda.  Written in python, out-of-the box solution to see when your docker containers over-use their resources. [See full example here](https://github.com/deephaven-examples/redpanda-docker-stats)

#### Stock Market

Want to monitor stock market data `live`?  Or perhaps you need to see how to publish multiple topics to Redpanda.  This example creates tables to see stocks from [dxFeed](https://dxfeed.com/). [See full example here](https://github.com/deephaven-examples/redpanda-dxfeed-financial-data)
