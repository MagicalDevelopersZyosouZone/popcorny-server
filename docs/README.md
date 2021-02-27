# bili-sync Documentation

## HTTP API

### Scheme
All API request and response data are sent in JSON, with header `Content-Type: application/json`

### Create New Session
`POST /session`

#### Request
```json
{
    "playerUrl": "https://example.com/video/xxxxxx"
}
```

#### Response
```json
{
    "sharelink": "https://bili-sync.example.com/join/xxxxxx"
}
```

--------

## WebSocket Messages

### New Connection to Session
`ws://{baseUrl}/session/{sessionId}`

#### Errors
- `404` If session not exeists.


--------


### Reconnect to Session
`ws://{baseUrl}/session/{sessionId}/{clientId}`


#### Errors
- `404` If session not exeists.


--------

### Server Handshake
Sent from server when a websocket conenction joins to a session. Also send for reconnection.
```json
{
    "type": "handshake",
    "clientId": "xxxxxxxx"
}
```

### Forward Message
Forward message must contains following fields. The message will be forward to the recipient.
```json
{
    "clientId": "self client id",
    "recipient": "id of recipient",
}
```

### Boradcast Message
Boradcast message must set `recipient` to `null`. The message will be broadcasted to all clients in current session.
```json
{
    "clientId": "self client id",
    "recipient": null,
}
```
