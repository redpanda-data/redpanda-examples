[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://vectorized.io/slack)

# Redpanda Examples

A collection of examples to demonstrate how to interact with Redpanda from various clients and languages. Redpanda is Kafka API compatible. Any client that works with Kafka will work, but we have tested the ones listed [here](https://vectorized.io/docs/faq#What-clients-do-you-recommend-to-use-with-Redpanda).

## Partner Integrations

Below is a sample of some of our partner integrations.

### [Deephaven](https://deephaven.io/)

Open-core query engine for building apps and analytics with real-time streams and batch data.  

#### Docker-stats

Need to monitor your local machine in real time?  This example publishes your `docker stats` to Redpanda.  Written in Python, this is an out-of-the box solution to see when your Docker containers over-use their resources. See full example here: [deephaven-examples/redpanda-docker-stats](https://github.com/deephaven-examples/redpanda-docker-stats).

#### Stock Market

Want to monitor updating stock market data?  Or see how to publish multiple topics to Redpanda?  This example creates tables to see stocks from [dxFeed](https://dxfeed.com/). See full example here: [deephaven-examples/redpanda-dxfeed-financial-data](https://github.com/deephaven-examples/redpanda-dxfeed-financial-data).
