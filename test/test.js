(() => {
  // test/client.ts
  var Client = class {
    constructor(sessionId) {
      this._ready = false;
      this.ws = new WebSocket(`ws://localhost:5000/session/${sessionId}`);
      this.id = "";
      this.sessionId = sessionId;
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
    sendto(clientId, data) {
      const msg = {
        ...data,
        recipient: clientId,
        clientId: this.id
      };
      this.send(msg);
    }
    broadcast(data) {
      const msg = {
        ...data,
        clientId: this.id,
        recipient: null
      };
    }
    reconnect() {
      this._ready = false;
      console.info("Reconnecting...");
      this.ws = new WebSocket(`ws://localhost:5000/session/${this.sessionId}/${this.id}`);
      this.ws.onmessage = (ev) => {
        const handshake = JSON.parse(ev.data);
        if (handshake.type !== "handshake")
          throw new Error("Invalid message from server");
        if (handshake.clientId !== this.id)
          throw new Error("Invalid handshake from server.");
        this.ws.onmessage = this.recv.bind(this);
        this._ready = true;
      };
    }
    recv(ev) {
      const msg = JSON.parse(ev.data);
      this.onMessage?.(msg);
    }
    send(msg) {
      try {
        this.ws.send(JSON.stringify(msg));
      } catch (err) {
        console.error(`Send failed ${err}`);
        this.reconnect();
      }
    }
  };

  // test/api-builder.ts
  function validateByPass(_, value) {
    return value;
  }
  function simpleParam(info) {
    const params = {};
    for (const key in info) {
      const value = info[key];
      switch (info[key]) {
        case "number":
          params[key] = {
            type: "number",
            validator: validateByPass
          };
          break;
        case "string":
          params[key] = {
            type: "string",
            validator: validateByPass
          };
          break;
        case "boolean":
          params[key] = {
            type: "boolean",
            validator: validateByPass
          };
          break;
        case "string[]":
          params[key] = {
            type: "string[]",
            validator: validateByPass
          };
          break;
        default:
          params[key] = value;
      }
    }
    return params;
  }
  var ClientErrorCode;
  (function(ClientErrorCode2) {
    ClientErrorCode2[ClientErrorCode2["Error"] = -1] = "Error";
    ClientErrorCode2[ClientErrorCode2["InvalidParameter"] = -2] = "InvalidParameter";
    ClientErrorCode2[ClientErrorCode2["NetworkFailure"] = -3] = "NetworkFailure";
    ClientErrorCode2[ClientErrorCode2["ParseError"] = -4] = "ParseError";
  })(ClientErrorCode || (ClientErrorCode = {}));
  var APIError = class extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  };
  var ApiBuilder = class {
    constructor(method, url, path, query, data) {
      this.method = method;
      this.url = url;
      this.pathInfo = path;
      this.queryInfo = query;
      this.dataInfo = data;
    }
    path(path) {
      return new ApiBuilder(this.method, this.url, simpleParam(path), this.queryInfo, this.dataInfo);
    }
    query(query) {
      return new ApiBuilder(this.method, this.url, this.pathInfo, simpleParam(query), this.dataInfo);
    }
    body(data) {
      if (this.method === "POST" || this.method === "PATCH" || this.method === "PUT") {
        return new ApiBuilder(this.method, this.url, this.pathInfo, this.queryInfo, simpleParam(data));
      } else {
        throw new APIError(-1, `HTTP Method ${this.method} should not have body.`);
      }
    }
    redirect(redirect) {
      this.redirectOption = redirect;
      return this;
    }
    response() {
      const builder = new ApiBuilder(this.method, this.url, this.pathInfo, this.queryInfo, this.dataInfo);
      return builder.send.bind(builder);
    }
    async send(params, data) {
      let url = this.url;
      for (const key in this.pathInfo) {
        const value = params[key];
        if (value === void 0) {
          if (this.pathInfo[key].optional) {
            url = url.replace(`{${key}}`, "");
            continue;
          }
          throw new APIError(-2, `Missing path '${key}'`);
        }
        url = url.replace(`{${key}}`, this.pathInfo[key].validator(key, value).toString());
      }
      const queryParams = [];
      for (const key in this.queryInfo) {
        const value = params[key];
        if (value === void 0 && !this.queryInfo[key].optional)
          throw new APIError(-2, `Missing query param '${key}'`);
        else if (value !== void 0)
          queryParams.push(`${key}=${encodeURIComponent(this.queryInfo[key].validator(key, value).toString())}`);
      }
      if (queryParams.length > 0)
        url = url + "?" + queryParams.join("&");
      if (this.dataInfo !== void 0) {
        for (const key in this.dataInfo) {
          const dataInfo = this.dataInfo[key];
          const value = data[key];
          if (value === void 0 && !dataInfo.optional)
            throw new APIError(-2, `Missing field '${key} in request body'`);
          else if (value !== void 0)
            data[key] = dataInfo.validator(key, value);
        }
      }
      let response;
      try {
        response = await fetch(url, {
          method: this.method,
          headers: {
            "Content-Type": "application/json"
          },
          redirect: this.redirectOption,
          body: this.dataInfo === void 0 ? void 0 : JSON.stringify(data)
        });
      } catch (err) {
        console.error(err);
        throw new APIError(-3, "Failed to send request.");
      }
      if (response.status >= 400) {
        const body = await this.parseBody(response);
        console.warn(`Server response error: ${body.code.toString(16)}: ${body.msg}`);
        throw new APIError(body.code, body.msg);
      }
      const responseBody = await this.parseBody(response);
      return responseBody;
    }
    async parseBody(response) {
      try {
        const body = await response.json();
        return body;
      } catch (err) {
        console.error(err);
        throw new APIError(-4, "Failed to parse response body.");
      }
    }
  };
  function api(method, url) {
    switch (method) {
      case "POST":
      case "PUT":
      case "PATCH":
        return new ApiBuilder(method, url, {}, {}, {});
      default:
        return new ApiBuilder(method, url, {}, {}, void 0);
    }
  }

  // test/api.ts
  var PopcornyAPI = {
    session: {
      create: api("POST", "http://localhost:5000/session").body({playerUrl: "string"}).response()
    }
  };

  // test/test.ts
  window.Client = Client;
  window.Popcorny = PopcornyAPI;
})();
