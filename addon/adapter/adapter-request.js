const anchorTag = document.createElement('a');

function getURL(string, type, data) {
  let url = new URL(anchorTag.href = string, anchorTag.href);

  if (type.toLowerCase() === 'get' && Object.keys(data || {}).length) {
    for (let key in data) {
      let value = data[key];

      if (Array.isArray(value)) {
        for (let element of value) {
          url.searchParams.append(`${key}[]`, element);
        }
      } else {
        url.searchParams.append(key, value);
      }
    }
  }

  return url;
}

/**
 * An object representation of the adapter triggered
 * ajax request
 *
 * @class AdapterRequest
 */
export class AdapterRequest {
  constructor({ url, data, type, headers }) {
    Object.defineProperties(this, {
      /**
       * A parsed url
       *
       * @property url
       * @type {URL}
       */
      url: {
        get() {
          return getURL(url, type, data);
        }
      },

      /**
       * @property method
       * @type {String}
       */
      method: {
        get() {
          return type;
        }
      },

      headers: {
        get() {
          return headers;
        }
      },

      /**
       * Although the AdapterRequest class gives you access
       * to the body. The body of the payload should
       * be tested through serializer.
       *
       * @property body
       * @type {any}
       */
      body: {
        get() {
          if (type.toLowerCase() === 'get') {
            throw new TypeError('GET request does not have request body');
          }

          return data;
        }
      },

      /**
       * The request body as a json object
       *
       * @property json
       * @type {Object}
       */
      json: {
        get() {
          return JSON.parse(this.body);
        }
      }
    });
  }
}
