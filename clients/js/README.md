[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://redpanda.com/slack)

# Javascript client

This app provides scripts for various client tasks.

## Install dependencies

```bash
> npm i
```

More details on each script and its associated tasks are below.

## Start Redpanda

```bash
> docker-compose -f docker-compose/redpanda-three-nodes up -d
```

## producer.js

The following command prints the help menu:

```bash
> node producer.js -h
```

## producer_avro.js

This script performs the following tasks:
1. Registers an Avro schema in the schema registry
2. Retrieves the same Avro schema from the schema registry
3. Uses the admin client to create a topic
4. Reads a csv file line-by-line and uses the Avro schema to serialise the
   messages before sending them to the topic
5. Consumes the topic and uses the Avro schema to deserialise the messages
   before printing them to the console

```bash
> node producer_avro.js -b localhost:19092 -r http://localhost:18081
```
