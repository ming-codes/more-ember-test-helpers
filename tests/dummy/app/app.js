import Application from '@ember/application';
import Resolver from './resolver';
import config from './config/environment';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

{
  /* global requirejs */
  let init = requirejs('ember-load-initializers');

  if (init && init.default) {
    init.default(App, config.modulePrefix);
  }
}

export default App;
