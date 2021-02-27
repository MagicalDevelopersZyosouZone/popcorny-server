(() => {
  // test/client.ts
  var Client = class {
    constructor(sessionId) {
      this._ready = false;
      this.ws = new WebSocket(`ws://localhost:5000/session/${sessionId}`);
      this.id = "";
      this.ws.onmessage = (ev) => {
        const handshake = JSON.parse(ev.data);
        if (handshake.type !== "handshake")
          throw new Error("Invalid message from server");
        this.ws.onmessage = this.recv.bind(this);
        this.id = handshake.clientId;
        this._ready = true;
      };
    }
    get ready() {
      return this._ready;
    }
    requestSync(playerState, tag = 0) {
      const msg = {
        type: "sync-request",
        clientId: this.id,
        tag,
        timestamp: Date.now(),
        ...playerState
      };
      this.send(msg);
    }
    responseSync(req, playerState, tag = 0) {
      const msg = {
        type: "sync-response",
        clientId: this.id,
        tag,
        timestamp: Date.now(),
        response: {
          clientId: req.clientId,
          tag: req.tag,
          timestamp: req.timestamp
        },
        ...playerState
      };
      this.send(msg);
    }
    recv(ev) {
      const msg = JSON.parse(ev.data);
      this.onMessage?.(msg);
    }
    send(msg) {
      this.ws.send(JSON.stringify(msg));
    }
  };

  // test/test.ts
  window.Client = Client;
})();
