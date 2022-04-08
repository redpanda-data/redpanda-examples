[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://redpanda.com/slack)

# Javascript client

This app provides scripts for various client tasks.

## Install dependencies

```bash
npm i
```

More details on each script and its associated tasks are below.

## Start Redpanda

```bash
cd redpanda-examples/wasm
docker-compose up -d
```

## producer.js

This script reads data from a csv file and sends this data to a topic.

```bash
node producer.js --brokers localhost:9092
```
