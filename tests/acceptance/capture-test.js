import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { captureRouteTransitionsFrom } from 'more-ember-test-helpers/capture';

module('Acceptance | capture', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    await captureRouteTransitionsFrom(async ({ visit, linkTo, /*forward, */back, links }) => {
      let transitions = await visit('/');

      assert.equal(transitions.length, 1);

      for (let link of links()) {
        await linkTo(link);
        await back();
      }
    });
  });
});
