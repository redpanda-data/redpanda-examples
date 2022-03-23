import { promises as fs } from "fs";
import fetch from "node-fetch";

function escapeJson(json) {
  return JSON.stringify(json).replace(/"/g, '"');
}

async function readAvroFile(filePath) {
  const file = await fs.readFile(filePath, "utf-8");
  const fileJson = JSON.parse(file);
  const schemaStr = escapeJson(fileJson);
  const body = { schema: schemaStr };
  return escapeJson(body);
}

function modifyProto(str) {
  str = str.replace(/"/g, '"');
  str = str.replace(/\n/g, "");
  return str;
}

async function readProtoFile(filePath) {
  const file = await fs.readFile(filePath, "utf-8");
  const schemaStr = modifyProto(file);
  const body = {
    schemaType: "PROTOBUF",
    schema: schemaStr,
  };
  return escapeJson(body);
}

async function main() {
  // import schema files
  // avro
  const avroBodyStr = await readAvroFile("../../schemas/market_activity.avsc");
  // proto
  const protoBodyStr = await readProtoFile("../../schemas/market_activity.proto");

  // upload schemas to registry
  // avro
  const avroResponse = await fetch(
    "http://localhost:18081/subjects/avro-market-activity-value/versions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: avroBodyStr,
    }
  );
  if (!avroResponse.ok) {
    const message = `error ${avroResponse.status} uploading avro schema`;
    throw new Error(message);
  }
  // proto
  const protoResponse = await fetch(
    "http://localhost:18081/subjects/proto-market-activity-value/versions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: protoBodyStr,
    }
  );
  if (!protoResponse.ok) {
    const message = `error ${protoResponse.status} uploading proto schema`;
    throw new Error(message);
  }
  console.log("schemas uploaded");
}

main();
