[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://redpanda.com/slack)

# Javascript client

This app provides scripts for various client tasks.

## Start Redpanda

You must have a Redpanda instance in order to use these apps.
The following command starts a single broker on the default ports:

```bash
> docker-compose -f docker-compose/compose-wasm.yaml up -d
```

## Install dependencies

```bash
> cd clients/js
> npm i
```

More details on each script and its associated tasks are below.

## producer.js

`producer.js` will send a stream of events into a topic.

```bash
> node producer -h
```

## registry.js

`registry.js` allows managing the schema registry from a CLI.

```bash
> node registry -h
```
