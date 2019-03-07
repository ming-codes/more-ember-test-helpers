import { CapturedConnection, CapturedBody } from './connection';

export function createFetchFactory(fetch, connections) {
  return function fetchSpy(request) {
    let connection = new CapturedConnection('fetch');

    for (let [ key, value ] of request.headers.entries()) {
      connection.request.headers[key] = value;
    }

    connection.request.url = request.url;
    connection.request.method = request.method;
    connection.request.body = new CapturedBody({
      blob() {
        return request.blob();
      },

      text() {
        return request.text();
      },

      json() {
        return request.json();
      }
    });

    connections.push(connection);

    return fetch(request).then(response => {
      for (let [ key, value ] of response.headers.entries()) {
        connection.response.headers[key] = value;
      }

      connection.response.body = new CapturedBody({
        blob() {
          return response.blob();
        },

        text() {
          return response.text();
        },

        json() {
          return response.json();
        }
      });

      return response;
    });
  };
}
