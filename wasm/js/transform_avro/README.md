# Redpanda Data Transforms: JSON to AVRO

This example JavaScript transform uses the async engine to map JSON formatted messages to an AVRO schema using `avro-js`.

## Start Redpanda Container

To run the example locally, spin up a Redpanda node with Docker:

```bash
cd redpanda-examples/wasm
docker-compose up -d

[+] Running 2/2
 ⠿ Network redpanda_network  Created
 ⠿ Container redpanda        Started
```

## Build & Deploy Coproc

Use `npm` to package up the JavaScript application:

```bash
cd redpanda-examples/wasm/js/transform_avro

npm install    # install js dependencies in node_modules
npm test       # run mocha tests
npm run build  # bundle js application with webpack 
```

Create Redpanda topic:

```bash
rpk topic create market_activity --brokers localhost:19092
rpk topic list --brokers localhost:19092
```

Deploy the transform script to Redpanda:

```bash
rpk wasm deploy dist/main.js --name json2avro --description "Transforms JSON to AVRO" --brokers localhost:19092
```

## Produce JSON Records and Consume AVRO Results

Start consumers:

```bash
rpk topic consume market_activity --brokers localhost:19092
rpk topic consume market_activity._result_ --brokers localhost:19092
```

Start producer:

```bash
cd redpanda-examples/clients/js
node producer.js --brokers localhost:19092
```

## View Coproc Log

```bash
docker exec --user root -it redpanda /bin/bash
tail -100f /var/lib/redpanda/coprocessor/logs/wasm
```

## Remove Coproc

```bash
rpk wasm remove json2avro --brokers localhost:19092
```
