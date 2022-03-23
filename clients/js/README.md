[![Slack](https://img.shields.io/badge/Slack-Redpanda%20Community-blue)](https://redpanda.com/slack)

# Javascript client

This app provides scripts for various client tasks.

## Install dependencies

```bash
npm i
```

More details on each script and its associated tasks are below.

## producer.js

This script reads data from a csv file and sends this data to a topic.

Check the help output to get usage details:

```bash
node producer.js -h
```

## upload-schema.js

This script reads the following schema files and uploads them to the registry.
Run the script with the following command:

```bash
node upload-schemas.js
```

Below are more details on the files and associated subjects:
| File | Subject |
| - | - |
| `schemas/market_activity.avsc` | avro-market-activity-value |
| `schemas/market_activity.proto` | proto-market-activity-value |

## Registry REST API with curl

Verify the two subjects created above exist with the following command:

```bash
> curl -s http://localhost:18081/subjects | jq .
[
  "avro-market-activity-value",
  "proto-market-activity-value"
]
```

Get the latest version of the schema registered with subject `avro-market-activity-value`:

```bash
> curl -X GET http://localhost:18081/subjects/avro-market-activity-value/versions/latest
{"subject":"avro-market-activity-value","version":1,"id":1,"schema":"{\"name\":\"market_activity\",\"type\":\"record\",\"fields\":[{\"name\":\"Date\",\"type\":\"string\"},{\"name\":\"CloseLast\",\"type\":\"string\"},{\"name\":\"Volume\",\"type\":\"string\"},{\"name\":\"Open\",\"type\":\"string\"},{\"name\":\"High\",\"type\":\"string\"},{\"name\":\"Low\",\"type\":\"string\"}]}"}%
```

Each schema has a unique ID and a version number.
The ID is unique across all schemas, and the version is related to the subject the schema is connected to.
The above output shows the latest schema version for subject `avro-market-activity-value` is v1, and that version points to the schema with ID 1.

Get the schema registered as ID 1:

```bash
> curl -s http://localhost:18081/schemas/ids/1 | jq .schema
"{\"name\":\"market_activity\",\"type\":\"record\",\"fields\":[{\"name\":\"Date\",\"type\":\"string\"},{\"name\":\"CloseLast\",\"type\":\"string\"},{\"name\":\"Volume\",\"type\":\"string\"},{\"name\":\"Open\",\"type\":\"string\"},{\"name\":\"High\",\"type\":\"string\"},{\"name\":\"Low\",\"type\":\"string\"}]}"
```

Delete schemas from registry:

```bash
curl -X DELETE http://localhost:18081/subjects/avro-market-activity-value
curl -X DELETE http://localhost:18081/subjects/proto-market-activity-value
```
