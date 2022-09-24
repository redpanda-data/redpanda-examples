import fs from "fs";
import fetch from "node-fetch";
import chalk from "chalk";
import parseArgs from "minimist";
import { Kafka } from "kafkajs";
import readline from "readline";
import avro from "avro-js";

let args = parseArgs(process.argv.slice(2));
const help = `
  ${chalk.green("producer_avro.js")} - Read messages from a .csv file, validate 
                     and serialize them as Avro using an Avro schema fetched 
                     from the schema registry, and send the serialized messages
                     to Redpanda.

  ${chalk.bold("USAGE")}

  > node producer_avro.js --help
  > node producer_avro.js [-f csv_file] [-t topic_name] [-b host:port] 
                          [-r registry_url] [-s avro_schema]

  By default this producer script will stream data from 
  ../data/HistoricalData_COKE_5Y.csv and output the Avro serialized messages to
  topic market_activity_avro.

  ${chalk.bold("OPTIONS")}

    -h, --help            Shows this help message

    -f, --file, --csv       Read csv-formatted messages from this file
                              default: ../data/HistoricalData_COKE_5Y.csv

    -t, --topic             Topic where events are sent
                              default: market_activity_avro

    -b, --brokers           Comma-separated list of the host and port for each broker
                              default: localhost:9092
  
    -r, --registry          Schema registry URL
                              default: http://localhost:8081

    -s, --schema, --avro    Avro schema definition for validating and serializing the
                            messages read from the file
                              default: ../data/HistoricalData.avsc
`;

if (args.help || args.h) {
  console.log(help);
  process.exit(0);
}

const csvPath = args.f || args.file || args.csv || "../data/HistoricalData_COKE_5Y.csv";
const topicName = args.t || args.topic || "market_activity_avro";
const brokers = (args.b || args.brokers || "localhost:9092").split(",");
const schemaRegistry = args.r || args.registry || "http://localhost:8081"
const schemaAvsc = args.s || args.schema || args.avro || "../data/HistoricalData.avsc"

const subject = "nasdaq-value"
const avroSchema = fs.readFileSync(schemaAvsc, "utf-8");

/* Register schema */
const publishUrl = `${schemaRegistry}/subjects/${subject}/versions`;
console.log(`POST: ${publishUrl}`);
var response = await fetch(publishUrl, {
    method: "POST",
    body: JSON.stringify({
      "schema": avroSchema
    }),
    headers: {"Content-Type": "application/json"}
  }
);
if (!response.ok) {
  console.error(`Error: ${await response.text()}`);
  process.exit(1);
}
const data = await response.json();
const schemaId = data["id"];

/* Retrieve schema */
const fetchUrl = `${schemaRegistry}/schemas/ids/${schemaId}`;
console.log(`GET: ${fetchUrl}`);
response = await fetch(fetchUrl);
if (!response.ok) {
  console.error(`Error: ${await response.text()}`);
  process.exit(1);
}
const json = await response.json();
const cachedSchema = json["schema"];
const cachedType = avro.parse(cachedSchema);
console.log(`Retrieved schema: ${JSON.stringify(cachedSchema)}`);

/* Create topic */
const redpanda = new Kafka({"brokers": brokers});
const admin = redpanda.admin();
await admin.connect();
await admin.createTopics({
  topics: [{ topic: topicName }],
  waitForLeaders: true,
});
await admin.disconnect();

/* Produce Avro messages */
const producer = redpanda.producer();
await producer.connect();

const stream = fs.createReadStream(csvPath);
const reader = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
});

for await (const line of reader) {
  const parts = line.split(",");
  if (parts[0].toLowerCase() == "date") {
    continue;
  }
  const history = {
    "date": parts[0],
    "close": parts[1],
    "volume": parseFloat(parts[2]),
    "open": parts[3],
    "high": parts[4],
    "low": parts[5],
  }
  const buf = cachedType.toBuffer(history);
  try {    
    const meta = await producer.send({
      topic: topicName,
      messages: [{ value: buf }],
    });
    for (const record of meta) {
      console.log(`Produced message at offset: ${record["baseOffset"]}`);
    }
  } catch (e) {
    console.error(e);
  }
}
await producer.disconnect();

/* Consume Avro messages */
const consumer = redpanda.consumer({
  groupId: "js-group"
})
await consumer.connect()
await consumer.subscribe({
  topic: topicName,
  fromBeginning: true
})
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const plain = cachedType.fromBuffer(message.value);
    console.log(`Consumed message: ${JSON.stringify(plain)}`);
  }
});

// /* Disconnect on CTRL+C */
process.on("SIGINT", async () => {
  try {
    console.log("\nConsumer disconnecting...");
    await consumer.disconnect();
    process.exit(0);
  } catch (_) {
    process.exit(1);
  }
});
