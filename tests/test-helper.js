import Resolver from '../resolver';
import config from '../config/environment';
import { setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';

//import buildRegistry from 'ember-test-helpers/legacy-0-6-x/build-registry';

setResolver(Resolver.create({
  namespace: {
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix
  }
}));

//if (!(Ember._RegistryProxyMixin && Ember._ContainerProxyMixin)) {
//  let { owner } = buildRegistry(getResolver());
//
//  owner.constructor.reopen({
//    lookup(fullName) {
//      let instance = this._super(fullName);
//
//      if (instance) {
//        return instance;
//      }
//
//      let container = this.__container__;
//
//      if (container) {
//        let application = container.lookup('application:main');
//
//        if (application && application.lookup) {
//          return application.lookup(fullName);
//        }
//
//        return container.lookup(fullName);
//      }
//
//      return null;
//    }
//  });
//}

start();
