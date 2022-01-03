/*
npm install csv-parser
npm install minimist
npm install kafkajs
*/
const fs = require("fs");
const csv = require('csv-parser');
const parseArgs = require('minimist');
const { Kafka } = require("kafkajs");

/* 
Usage: node producer.js
            --topic <name> 
            --brokers <host:port> [--brokers <host:port> ...]
            --csv <path>
*/
let args = parseArgs(process.argv.slice(2));
if (typeof args.brokers == "string") {
  args.brokers = [args.brokers];
}
const topic = args.topic || "market_activity";
const csvPath = args.csv || "../../spark/scala/src/main/resources/spx_historical_data.csv";

const redpanda = new Kafka({
  clientId: "example-producer-js",
  brokers: args.brokers
});
const producer = redpanda.producer();

/* Produce single message */
const send = async (obj) => {
  try {
    const json = JSON.stringify(obj);
    await producer.send({
      topic: topic,
      messages: [{ value: json },]
    });
    console.log(`Produced: ${json}`);
  } catch (e) {
    console.error(e);
  }
};

const run = async () => {
  console.log("Producer connecting...")
  await producer.connect();
  // Transform each CSV row as JSON and send to Redpanda
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", function(row) {
      send(row);
    });
};
run().catch(e => console.error(e));

/* Disconnect on CTRL+C */
process.on("SIGINT", async () => {
  try {
    console.log("Producer disconnecting...")
    await producer.disconnect()
    process.exit(0)
  } catch (_) {
    process.exit(1)
  }
});
