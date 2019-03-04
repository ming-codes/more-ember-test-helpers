import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  docsRoute(this, function() {
    this.route('getting-started', { path: '/' }, function() {
      this.route('overview', { path: '/' });
      this.route('installation');
    });

    this.route('api', function() {
      this.route('class', { path: '/:class_id' });
    });
  });
  this.route('not-found', { path: '/*path' });
});

export default Router;
