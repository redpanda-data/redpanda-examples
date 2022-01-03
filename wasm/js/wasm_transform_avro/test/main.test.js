const transform = require("../src/main");
const { createRecordBatch } = require("@vectorizedio/wasm-api");
const assert = require("assert");

const record = {
  "Date":"12/10/2021",
  "CloseLast":"4712.02",
  "Volume":"--",
  "Open":"4687.64",
  "High":"4713.57",
  "Low":"4670.24"
};
const recordBatch = createRecordBatch({
  records: [{value: JSON.stringify(record)}]
});

/* Mocha test transform json to avro */
describe("transform", function() {
  it("transforms json to avro", function() {
    return transform.default.apply(recordBatch).then(result => {
      assert.equal(result.size, 1);
      assert(result.get("result"));
      result.get("result").records.forEach(avroRecord => {
        obj = transform.schema.fromBuffer(avroRecord.value);
        assert.equal(
          JSON.stringify(obj),
          JSON.stringify(record)
        );
      })
    });
  });
});
