# Redpanda Data Transforms: JSON to AVRO

This example JavaScript transform uses the async engine to map JSON formatted messages to an AVRO schema.

# Tool versions

Versions for tools used in this project are listed below.
Other versions may work, but make sure to use the following versions if you run into issues:

| Tool | Version | Notes |
| - | - | - |
| curl | 7.77.0 |
| docker | v20.10.13 |
| docker-compose | v1.29.2 |
| jq | jq-1.6 |
| node | v17.7.2 | node >= 11.15.0 has been verified |
| rpk | v21.11.9 | rev ad9c5af53cc2ac68170d4a4d7c6e5f25c0d17f69 |

## Start Redpanda Container

To run the example locally, spin up a Redpanda node with Docker:

```bash
> docker-compose -f docker-compose/compose-wasm.yaml up -d
[+] Running 2/2
 ⠿ Network redpanda_network  Created
 ⠿ Container redpanda        Started
```

## Build & Deploy Coproc

Use `npm` to package up the JavaScript application:

```bash
> cd wasm/js/transform_avro
> npm install    # install js dependencies in node_modules
> npm test       # run mocha tests
> npm run build  # bundle js application with webpack
```

## Create the topic

Create the topic where the producer app will send messages.
This step is required since the consumed topic must exist prior to deploying the wasm coprocessor.

```bash
> rpk topic create market_activity
TOPIC            STATUS
market_activity  OK
```

List all current topics:
```bash
> rpk topic list
NAME             PARTITIONS  REPLICAS
_schemas         1           1
market_activity  1           1
```

The `_schemas` topic is automatically generated when the schemas are uploaded to the registry.

## Deploy the transform script to Redpanda

```bash
> rpk wasm deploy dist/main.js --name json2avro --description "Transforms JSON to AVRO"
Deploy successful!
```

## Produce JSON Records and Consume AVRO Results

Start two consumers (run each command below in a separate terminal):

```bash
> rpk topic consume market_activity
> rpk topic consume market_activity._avro_
```

The topic `market_activity._avro_` doesn't yet exist, but it will be automatically created once the wasm function begins consuming events from the topic `market_activity`.

Start the producer (in a third terminal):

```bash
> cd clients/js
> npm install
> node producer -rd Date
```

The above command will output many lines of JSON string representations of the events being sent to topic `market_activity`.

Verify that you see output in the second terminal.
This will be a string representation of the Avro-serialized events being sent to `market_activity._avro_`.

## View Coproc Log

The coprocessor log on the Redpanda container shows status information and possibly errors if something went wrong.

```bash
> docker exec --user root -it redpanda /bin/bash
tail -100f /var/lib/redpanda/coprocessor/logs/wasm
```

# Cleanup

## Remove Coproc

Occasionally you may want disable a deployed coprocessor, for instance when you want to deploy a new version of the transform.
Run the following command (make sure to use the same name as your previous deploy step):

```bash
> rpk wasm remove json2avro
```

## Stop docker compose resources

```bash
> docker-compose -f docker-compose/compose-wasm.yaml down
[+] Running 2/2
 ⠿ Container redpanda                       Removed   0.3s
 ⠿ Network docker-compose_redpanda_network  Removed   0.1s
```
