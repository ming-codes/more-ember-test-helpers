
const anchorTag = document.createElement('a');

export class CapturedBody {
  constructor(hooks) {
    Object.assign(this, hooks);
  }
}

export class CapturedHeaders {
  constructor() {
    this['content-type'] = 'text/plain;charset=UTF-8';
  }

  append(key, value) {
    key = key.toLowerCase();

    if (this[key]) {
      this[key] += `, ${value.trim()}`;
    } else {
      this[key] = value.trim();
    }

    return this;
  }

  toJSON() {
    let json = {};

    for (let key in this) {
      json[key] = this[key];
    }

    return json;
  }
}

export class CapturedResponse {
  constructor() {
    this.headers = new CapturedHeaders();
  }
}

export class CapturedRequest {
  constructor() {
    this.headers = new CapturedHeaders();
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this._url = new URL(anchorTag.href = value, anchorTag.href);
  }
}

export class CapturedConnection {
  constructor(type) {
    this.type = type;
    this.request = new CapturedRequest();
    this.response = new CapturedResponse();
  }
}

export class CapturedConnectionCollection {
  constructor(connections) {
    this.connections = connections;
  }

  get length() {
    return this.connections.length;
  }

  *[ Symbol.iterator ]() {
    for (let index = 0, len = this.connections.length; index < len; index++) {
      yield this.connections[index];
    }
  }

  toArray() {
    return this.connections.slice();
  }

  first() {
    return this.connections[0];
  }

  filter(fn) {
    return new CapturedConnectionCollection(this.connections.filter(fn));
  }

  get() {
    return this.method('GET');
  }

  post() {
    return this.method('POST');
  }

  put() {
    return this.method('PUT');
  }

  delete() {
    return this.method('DELETE');
  }

  patch() {
    return this.method('PATCH');
  }

  method(type) {
    return this.filter(connection => {
      return connection.request.method === type;
    });
  }

  href(href) {
    return this.filter(connection => {
      return connection.request.url.href === href;
    });
  }

  pathname(pathname) {
    return this.filter(connection => {
      return connection.request.url.pathname === pathname;
    });
  }

  //search(string) {
  //}

  //searchParam(key, value) {
  //}

  //host() {
  //}

  //hostname() {
  //}

  //port() {
  //}

  //protocol() {
  //}

}
