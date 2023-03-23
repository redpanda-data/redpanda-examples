# Kafka Connect Internal Topic - Configs

| Producing Team | Producing Service | GDPR sensitive | Importance | Data type |
|----------------|-------------------|----------------|------------|-----------|
| Kafka Connect  | Kafka Connect     | No             | Critical   | JSON      |

Used by Kafka Connect to store configurations

## Settings

| Setting    | Value   |
|------------|---------|
| Compaction | true    |
| Retention  | default |

## Key Schema

Set to `session-key`

## Value Schema
```json lines
{
    "type": "record",
    "name": "TestObject",
    "namespace": "ca.dataedu",
    "fields": [{
        "name": "algorithm",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "creation_timestamp",
        "type": ["null", "long"],
        "doc": "The original field name was 'creation-timestamp' but some characters is not accepted in the field name of Avro record",
        "default": null
    }, {
        "name": "key",
        "type": ["null", "string"],
        "default": null
    }]
}
```