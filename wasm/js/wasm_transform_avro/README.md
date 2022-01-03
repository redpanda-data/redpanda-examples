# WASM Transform JSON to AVRO

## Start Redpanda Container

cd redpanda-examples/wasm
docker-compose up -d

[+] Running 2/2
 ⠿ Network wasm_redpanda_network  Created
 ⠿ Container redpanda             Started

## Build & Deploy Coproc

cd redpanda-examples/wasm/js/wasm_transform_avro

npm install
npm test
npm run build

rpk topic create market_activity --brokers localhost:19092
rpk topic list --brokers localhost:19092

rpk wasm deploy dist/main.js --name wasm_transform_avro --description "Transforms JSON to AVRO" --brokers localhost:19092

## Produce JSON Records and Consume AVRO Results

rpk topic consume market_activity --brokers localhost:19092
rpk topic consume market_activity._result_ --brokers localhost:19092

cd redpanda-examples/clients/js
node producer.js --brokers localhost:19092

## View Coproc Log

docker exec --user root -it redpanda /bin/bash
tail -100f /var/lib/redpanda/coprocessor/logs/wasm
