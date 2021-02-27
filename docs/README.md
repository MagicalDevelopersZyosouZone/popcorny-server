# bili-sync Documentation

## Scheme
All API request and response data are sent in JSON, with header `Content-Type: application/json`

## Create New Session
`POST /session`

### Request
```json
{
    "playerUrl": "https://example.com/video/xxxxxx"
}
```

### Response
```json
{
    "sharelink": "https://bili-sync.example.com/join/xxxxxx"
}
```

--------


## New Connection to Session
`WebSocket /session/{sessionId}`

### Errors
- `404` If session not exeists.


--------


## Reconnect to Session
`WebSocket /session/{sessionId}/{clientId}`


### Errors
- `404` If session not exeists.