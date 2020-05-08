# Kafka exmample consumer and producer 

This is an example of a kafka consumer and producer


## Installation

* Clone this repository
* Run `docker-compose up --scale consumer=3 --build` to start up


## Methods

### Send Bulk Messages

**POST /messages/:topic/:times**

Sends a new message.

Parameters:

* `topic` (String): The Queue name. Maximum 80 characters; alphanumeric characters, hyphens (-), and underscores (_) are allowed.
* `times` (Number): The amount of times you want to send the message to the topic

Example:

```
POST /messages/do-work/10
Content-Type: application/json

{
	"message": "Hello World!"
}
```

```curl
curl --location --request POST 'localhost:8000/messages/do-work/500' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "person"}'
```

## The MIT License (MIT)

Please see the LICENSE.md file.
