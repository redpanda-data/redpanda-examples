# Owlshop-Orders

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

The key is the customer UUID.

## Value Schema
```json lines
{
    "type": "record",
    "name": "TestObject",
    "namespace": "ca.dataedu",
    "fields": [{
        "name": "completedAt",
        "type": "null",
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
                "name": "companyName",
                "type": "null",
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
        }],
        "default": null
    }, {
        "name": "deliveredAt",
        "type": "null",
        "default": null
    }, {
        "name": "deliveryAddress",
        "type": ["null", {
            "type": "record",
            "name": "DeliveryAddress",
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
                    "name": "CustomerRef",
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
        }],
        "default": null
    }, {
        "name": "id",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "lastUpdatedAt",
        "type": ["null", "string"],
        "default": null
    }, {
        "name": "lineItems",
        "type": ["null", {
            "type": "array",
            "items": ["null", {
                "type": "record",
                "name": "LineItem",
                "fields": [{
                    "name": "articleId",
                    "type": ["null", "string"],
                    "default": null
                }, {
                    "name": "name",
                    "type": ["null", "string"],
                    "default": null
                }, {
                    "name": "quantity",
                    "type": ["null", "int"],
                    "default": null
                }, {
                    "name": "quantityUnit",
                    "type": ["null", "string"],
                    "default": null
                }, {
                    "name": "totalPrice",
                    "type": ["null", "int"],
                    "default": null
                }, {
                    "name": "unitPrice",
                    "type": ["null", "int"],
                    "default": null
                }]
            }]
        }],
        "default": null
    }, {
        "name": "orderValue",
        "type": ["null", "int"],
        "default": null
    }, {
        "name": "payment",
        "type": ["null", {
            "type": "record",
            "name": "Payment",
            "fields": [{
                "name": "method",
                "type": ["null", "string"],
                "default": null
            }, {
                "name": "paymentId",
                "type": ["null", "string"],
                "default": null
            }]
        }],
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
    "id": "e611b8c8-18e6-49e9-9c26-143328b6e51a",
    "createdAt": "2023-03-23T06:39:58.736049708Z",
    "lastUpdatedAt": "2023-03-23T06:39:58.736054417Z",
    "deliveredAt": null,
    "completedAt": null,
    "customer": {
        "version": 0,
        "id": "bda5df72-1db9-4f33-9de5-749bcc86f7a9",
        "firstName": "Stevie",
        "lastName": "Gutmann",
        "gender": "female",
        "companyName": null,
        "email": "quentinabshire@marvin.name",
        "customerType": "PERSONAL",
        "revision": 0
    },
    "orderValue": 233770,
    "lineItems": [
        {
            "articleId": "2b4313d9-bec1-4f2f-bbb8-d83d43f37b9a",
            "name": "Pepper",
            "quantity": 306,
            "quantityUnit": "gram",
            "unitPrice": 817,
            "totalPrice": 250002
        },
        {
            "articleId": "b92f5931-b7a6-42d9-910a-52692e21d227",
            "name": "Artichoke",
            "quantity": 483,
            "quantityUnit": "pieces",
            "unitPrice": 971,
            "totalPrice": 468993
        },
        {
            "articleId": "f371d989-f814-429c-9777-14ba751e0ac3",
            "name": "Spinach",
            "quantity": 244,
            "quantityUnit": "pieces",
            "unitPrice": 819,
            "totalPrice": 199836
        },
        {
            "articleId": "112496ce-442f-4b0c-b227-fd2a7cb7c5af",
            "name": "Snow Peas",
            "quantity": 213,
            "quantityUnit": "gram",
            "unitPrice": 984,
            "totalPrice": 209592
        },
        {
            "articleId": "a4f87fbd-a2b6-47a3-8d1a-93452dcb679a",
            "name": "Cabbage",
            "quantity": 33,
            "quantityUnit": "gram",
            "unitPrice": 504,
            "totalPrice": 16632
        },
        {
            "articleId": "15a0b305-c1dd-422b-b5f8-24343bf127c5",
            "name": "Turnip",
            "quantity": 405,
            "quantityUnit": "gram",
            "unitPrice": 397,
            "totalPrice": 160785
        },
        {
            "articleId": "4438c1bd-4714-429c-8324-9d851f69b50f",
            "name": "Swiss Chard",
            "quantity": 423,
            "quantityUnit": "gram",
            "unitPrice": 396,
            "totalPrice": 167508
        },
        {
            "articleId": "07c55657-718d-4734-a6e3-a8736371d857",
            "name": "Peas",
            "quantity": 102,
            "quantityUnit": "gram",
            "unitPrice": 256,
            "totalPrice": 26112
        },
        {
            "articleId": "aaaa2ec8-257e-414e-a818-6a234419ed47",
            "name": "Collards",
            "quantity": 110,
            "quantityUnit": "pieces",
            "unitPrice": 780,
            "totalPrice": 85800
        },
        {
            "articleId": "53db7aee-b995-498b-9afa-d3d531e8745e",
            "name": "Parsnip",
            "quantity": 31,
            "quantityUnit": "gram",
            "unitPrice": 332,
            "totalPrice": 10292
        },
        {
            "articleId": "2d0b8095-aa5c-4627-92ae-019f4bfd4603",
            "name": "Carrot",
            "quantity": 484,
            "quantityUnit": "gram",
            "unitPrice": 46,
            "totalPrice": 22264
        },
        {
            "articleId": "2ce8dc61-b6f7-467b-a091-34db63be39c4",
            "name": "Okra",
            "quantity": 472,
            "quantityUnit": "gram",
            "unitPrice": 457,
            "totalPrice": 215704
        },
        {
            "articleId": "370eb8db-9261-4162-add9-8fcbecc21766",
            "name": "Fiddleheads",
            "quantity": 76,
            "quantityUnit": "pieces",
            "unitPrice": 756,
            "totalPrice": 57456
        }
    ],
    "payment": {
        "paymentId": "62d8f882-b051-4550-b71a-9fea60814ed4",
        "method": "DEBIT"
    },
    "deliveryAddress": {
        "version": 0,
        "id": "88f52daa-c8e0-4be5-96be-1424900b9ad3",
        "customer": {
            "id": "bda5df72-1db9-4f33-9de5-749bcc86f7a9",
            "type": "PERSONAL"
        },
        "type": "INVOICE",
        "firstName": "Stevie",
        "lastName": "Gutmann",
        "state": "Arizona",
        "street": "5648 Lake Summit chester",
        "houseNumber": "767",
        "city": "Daishaside",
        "zip": "46581",
        "latitude": -82.677627,
        "longitude": 170.811168,
        "phone": "288.457.6769",
        "additionalAddressInfo": "",
        "createdAt": "2023-03-23T06:39:58.736616542Z",
        "revision": 0
    },
    "revision": 0
}
```