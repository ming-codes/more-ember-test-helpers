import { run } from '@ember/runloop';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';

import { store } from '../store';
import { AdapterRequest } from './adapter-request';

class AdapterInstrumentationInterrupt extends Error {
  constructor(hash) {
    super('AdapterInterrupt');
    this.ajaxHash = hash;
  }
}

const AdapterInstrumentationMixin = Mixin.create({
  ajax(...argv) {
    let hash = this.ajaxOptions(...argv);

    if (!hash.hasOwnProperty('headers') && this.get('headers')) {
      hash.headers = this.get('headers');
    }

    return RSVP.reject(new AdapterInstrumentationInterrupt(hash));
  }
});

export function instrument(argv, callback) {
  const [modelName] = argv;
  const instance = store();
  const adapter = instance.adapterFor(modelName);

  if (!AdapterInstrumentationMixin.detect(adapter)) {
    adapter.reopen(AdapterInstrumentationMixin);
  }

  let interrupt = null;

  run(function() {
    let promise = typeof callback === 'string' ?  instance[callback](...argv) : callback.call(this, instance);

    promise.catch(error => {
      interrupt = error;
    });
  });

  if (!(interrupt instanceof AdapterInstrumentationInterrupt)) {
    throw interrupt;
  }

  return new AdapterRequest(interrupt.ajaxHash);
}
