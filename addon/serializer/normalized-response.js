/**
 * NormalizedResponse is an object that represent the returned value from
 * Serializer#normalizeResponse
 *
 * @class NormalizedResponse
 * @constructor
 * @private
 */
export class NormalizedResponse {
  constructor(context) {
    Object.defineProperties(this, Object.getOwnPropertyDescriptors(context));
  }

  /**
   * The json-api representation of the normalized response. This is the return value
   * from your Serialize#normalizeResponse
   *
   * @property jsonapi
   * @type {Object}
   */

  /**
   * The raw representation of the normalized response. This is the payload
   * value you pass to your super calls in your Serializer#normalizeResponse.
   *
   * The reason that you may want to use this value is because it is more
   * concise than the json-api representation and more performant since it
   * bypasses the json-api normalization step.
   *
   * @property raw
   * @type {Object}
   */
}

