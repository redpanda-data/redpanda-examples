const avro = require("avro-js");
const {
  SimpleTransform,
  PolicyError,
  PolicyInjection,
  calculateRecordBatchSize
} = require("@vectorizedio/wasm-api");

const transform = new SimpleTransform();

/**
 * Topics that fire the transform function
 * - Earliest
 * - Stored
 * - Latest
 */
transform.subscribe([["market_activity", PolicyInjection.Latest]]);

/**
 * The strategy the transform engine will use when handling errors
 * - SkipOnFailure
 * - Deregister
 */
transform.errorHandler(PolicyError.SkipOnFailure);

/* TODO: Fetch Avro schema from repository */
const schema = avro.parse({
  name: "market_activity",
  type: "record",
  fields: [
    {name: "Date", type: "string"},
    {name: "CloseLast", type: "string"},
    {name: "Volume", type: "string"},
    {name: "Open", type: "string"},
    {name: "High", type: "string"},
    {name: "Low", type: "string"}
  ]
});

/* Auxiliar transform function for records */
const toAvro = (record) => {  
  const obj = JSON.parse(record.value);
  const newRecord = {
    ...record,
    value: schema.toBuffer(obj),
  };
  return newRecord;  
}

/* Transform function */
transform.processRecord((recordBatch) => {
  const result = new Map();
  const transformedRecord = recordBatch.map(({ header, records }) => {
    return {
      header,
      records: records.map(toAvro),
    };
  });
  result.set("result", transformedRecord);
  // processRecord function returns a Promise
  return Promise.resolve(result);
});

exports["default"] = transform;
exports["schema"] = schema;
