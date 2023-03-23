# Owlshop-Orders

| Producing Team | Producing Service         | GDPR sensitive | Importance   | Data type  |
|----------------|---------------------------|----------------|--------------|------------|
| CloudHut       | quay.io/cloudhut/owl-shop | No             | Non-Critical | JSON       |

Stores web logs from the Owlshop frontend. Used for system debugging. 

## Settings

| Setting       | Value            |
|---------------|------------------|
| Compaction    | false            |
| Retention     | 7 Days / 2.79GiB |
| segment.bytes | 286MiB           |

## Key Schema

Null Key

## Value Schema
```json lines
{
    "type": "record",
    "name": "TestObject",
    "namespace": "ca.dataedu",
    "fields": [{
        "name": "correlationId",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "headers",
        "type": ["null", {
            "type": "record",
            "name": "Headers",
            "fields": [{
                "name": "accept",
                "type": ["null", "string"],
                "default": null
            }, {
                "name": "accept_encoding",
                "type": ["null", "string"],
                "doc": "The original field name was 'accept-encoding' but some characters is not accepted in the field name of Avro record",
                "default": null
            }, {
                "name": "cache_control",
                "type": ["null", "string"],
                "doc": "The original field name was 'cache-control' but some characters is not accepted in the field name of Avro record",
                "default": null
            }, {
                "name": "origin",
                "type": ["null", "string"],
                "default": null
            }, {
                "name": "referrer",
                "type": ["null", "string"],
                "default": null
            }, {
                "name": "user_agent",
                "type": ["null", "string"],
                "doc": "The original field name was 'user-agent' but some characters is not accepted in the field name of Avro record",
                "default": null
            }]
        }],
        "default": null
    }, {
        "name": "ipAddress",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "method",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "requestDuration",
        "type": ["null", "int"],
        "default": null
    }, {
        "name": "requestedUrl",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "response",
        "type": ["null", {
            "type": "record",
            "name": "Response",
            "fields": [{
                "name": "size",
                "type": ["null", "int"],
                "default": null
            }, {
                "name": "statusCode",
                "type": ["null", "int"],
                "default": null
            }]
        }],
        "default": null
    }, {
        "name": "version",
        "type": ["null", "int"],
        "default": null
    }]
}
```

## Sample
```json lines
{
    "version": 0,
    "requestedUrl": "http://www.dynamiccommunities.biz/world-class/generate/expedite",
    "method": "POST",
    "correlationId": "cf15162c-cdae-4380-80ef-2a976fe3e373",
    "ipAddress": "11.244.82.34",
    "requestDuration": 759,
    "response": {
        "size": 1173,
        "statusCode": 200
    },
    "headers": {
        "accept": "*/*",
        "accept-encoding": "gzip",
        "cache-control": "max-age=0",
        "origin": "https://www.nationalmission-critical.info/productize/enhance/impactful/iterate",
        "referrer": "http://www.nationalparadigms.com/cross-platform/cultivate",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:6.0) Gecko/2018-11-11 Firefox/35.0"
    }
}
```