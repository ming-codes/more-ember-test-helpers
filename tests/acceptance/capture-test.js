import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { captureRouteTransitionsFrom } from 'more-ember-test-helpers/capture';
import { owner } from 'more-ember-test-helpers/owner';

import Router from '@ember/routing/router';

module('Acceptance | capture', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    owner().register('router:main', Router.extend({}).map(function() {
      this.route('root', { path: '/' });
    }));

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
