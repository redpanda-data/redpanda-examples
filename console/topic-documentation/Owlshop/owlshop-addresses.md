# Owlshop-Addresses

| Producing Team | Producing Service         | GDPR sensitive | Importance | Data type  |
|----------------|---------------------------|----------------|------------|------------|
| CloudHut       | quay.io/cloudhut/owl-shop | Yes            | Critical   | JSON       |

Used as a system-of-record table for orders. 

## Settings

| Setting    | Value   |
|------------|---------|
| Compaction | true    |
| Retention  | default |

## Key Schema

The key is the address UUID.

## Value Schema
```json lines
{
    "type": "record",
    "name": "TestObject",
    "namespace": "Owlshop",
    "fields": [{
        "name": "additionalAddressInfo",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "city",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "createdAt",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "customer",
        "type": ["null", {
            "type": "record",
            "name": "Customer",
            "fields": [{
                "name": "id",
                "type": ["null", "string"],
                "default": null
            }, {
                "name": "type",
                "type": ["null", "string"],
                "default": null
            }]
        }],
        "default": null
    }, {
        "name": "firstName",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "houseNumber",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "id",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "lastName",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "latitude",
        "type": ["null", "double"],
        "default": null
    }, {
        "name": "longitude",
        "type": ["null", "double"],
        "default": null
    }, {
        "name": "phone",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "revision",
        "type": ["null", "int"],
        "default": null
    }, {
        "name": "state",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "street",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "type",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "version",
        "type": ["null", "int"],
        "default": null
    }, {
        "name": "zip",
        "type": ["null", "string"],
        "default": null
    }]
}
```

## Sample
```json lines
{
    "version": 0,
    "id": "b0aaa406-8d62-4ac2-ba0d-1e09dd443b28",
    "customer": {
        "id": "1d31d50f-1f94-4598-8a55-c724b5153558",
        "type": "PERSONAL"
    },
    "type": "INVOICE",
    "firstName": "Hester",
    "lastName": "Douglas",
    "state": "New Jersey",
    "street": "806 Parkway berg",
    "houseNumber": "260",
    "city": "Morarmouth",
    "zip": "97361",
    "latitude": 84.078375,
    "longitude": 134.071707,
    "phone": "(510)028-0836",
    "additionalAddressInfo": "crucifix",
    "createdAt": "2023-03-23T11:29:00.114287216Z",
    "revision": 0
}
```