/**
 * Captures all Transition objects created from callback
 *
 * @function captureRouteTransitionsFrom
 * @param {Function} callback
 *   The callback function is passed in a few utility functions
 *   to control route transitions.
 *
 *   <dl>
 *     <dt>
 *       visit
 *     </dt>
 *     <dd>
 *       v def
 *     </dd>
 *   </dl>
 *
 *   <ul>
 *     <li>visit</li>
 *     <li>linkTo</li>
 *     <li>forward</li>
 *     <li>back</li>
 *     <li>links</li>
 *   </ul>
 */
export { captureRouteTransitionsFrom } from './transition';

/**
 * Captures all network requests from callback
 *
 * @function captureNetworkConnectionFrom
 * @param {Function} callback
 */
export { captureNetworkConnectionFrom } from './request';


export function createCaptureContext({ capture, setup, teardown, returns }) {
  let context = setup();

  let promise = capture();

  if (promise && typeof promise.then === 'function') {
    promise = promise.then(() => teardown(context));
  } else {
    teardown(context);
  }

  if (promise && typeof promise.then === 'function') {
    return promise.then(() => returns());
  } else {
    return returns();
  }
}
