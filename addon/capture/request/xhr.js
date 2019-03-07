import { CapturedConnection, CapturedBody } from './connection';

const READY_STATE = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};

//
// We do a very special `extend` in here because
// Safari doesn't let is extend native DOM constructor
//
export function createXMLHttpRequestFactory(ctor, connections) {
  const supr = ctor.prototype;
  const proto = {
    ctor() {
      let xhr = this;

      xhr.connection = new CapturedConnection('xhr');

      connections.push(xhr.connection);

      xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === READY_STATE.DONE) {
          let response = xhr.connection.response;

          response.status = xhr.status;
          response.statusText = xhr.statusText;

          for (let header of xhr.getAllResponseHeaders().trim().split('\n')) {
            let [ key, ...value ] = header.split(':');

            response.headers[key.toLowerCase()] = value.join(':').trim();
          }

          response.body = new CapturedBody({
            blob() {
              return Promise.resolve(xhr.response);
            },

            text() {
              return Promise.resolve(xhr.responseText);
            },

            json() {
              return Promise.resolve(JSON.parse(xhr.responseText));
            }
          });
        }
      });
    },

    open(method, url, ...argv) {
      Object.assign(this.connection.request, {
        url,
        method
      });

      return supr.open.call(this, method, url, ...argv);
    },

    overrideMimeType(mimeType) {
      return supr.overrideMimeType.call(this, mimeType);
    },

    setRequestHeader(key, value) {
      this.connection.request.headers.append(key, value);

      return supr.setRequestHeader.call(this, key, value);
    },

    send(data) {
      this.connection.request.body = new CapturedBody({
        blob() {
          return Promise.resolve(data);
        },

        text() {
          return Promise.resolve(data);
        },

        json() {
          return Promise.resolve(JSON.parse(data));
        }
      });

      return supr.send.call(this, data);
    }
  };

  function XMLHttpRequestSpy() {
    let xhr = new ctor;

    Object.assign(xhr, proto);

    xhr.ctor.call(xhr);

    return xhr;
  }

  Object.assign(XMLHttpRequestSpy, READY_STATE);

  return XMLHttpRequestSpy;
}
