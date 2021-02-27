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



--------

### Client Sync Request
Send self player state to all clients in session and request for a sync response.
```json
{
    "type": "sync-request",
    "clientId": "self client id",
    "tag": "xxxxxx",
    "timestamp": 123456789,
    "currentTime": 123,
    "playbackRate": 1.23,
}
```

--------

### Client Sync Response
Send self player state to the client sending the `sync-request`.

Should be sent immediately when receive a `sync-request`.

```json
{
    "type": "sync-request",
    "clientId": "self client id",
    "tag": "xxxxxx",
    "timestamp": 123456789,
    "currentTime": 123,
    "playbackRate": 1.23,
    "response": {
        "clientId": "client id who send sync-request",
        "tag": "the 'tag' field in the sync-request data",
        "timestamp": "the 'timestamp' field in the sync-request data"
    }
}
```
