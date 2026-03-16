# Owlshop-Customers

| Producing Team | Producing Service         | GDPR sensitive | Importance | Data type  |
|----------------|---------------------------|----------------|------------|------------|
| CloudHut       | quay.io/cloudhut/owl-shop | Yes            | Critical   | JSON       |

Used as a system-of-record table for customers. 

## Settings

| Setting    | Value   |
|------------|---------|
| Compaction | true    |
| Retention  | default |

## Key Schema

The key is the customer UUID.

## Value Schema

```json lines
{
    "type": "record",
    "name": "Customer",
    "namespace": "owlshop",
    "fields": [{
        "name": "companyName",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "customerType",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "email",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "firstName",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "gender",
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
        "name": "revision",
        "type": ["null", "int"],
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
	"id": "5baf70c5-52bd-4139-b0b4-3b27d8db7e3b",
	"firstName": "Georgette",
	"lastName": "Upton",
	"gender": "male",
	"companyName": "",
	"email": "sherwoodreilly@rutherford.info",
	"customerType": "PERSONAL",
	"revision": 0
}
```