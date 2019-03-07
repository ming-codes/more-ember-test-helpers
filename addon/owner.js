import { getContext } from '@ember/test-helpers/setup-context';

export function owner() {
  let { owner } = getContext();

  if (owner.__container__.owner === owner) {
    return owner;
  }

  owner.__container__.owner = owner;

  if (!owner.lookup) {
    owner.reopen({
      lookup(fullName) {
        return this.__container__.lookup(fullName);
      },

      register(...argv) {
        return this.__container__.register(...argv);
      }
    });
  }

  return owner;
}

export function lookup(...fullNames) {
  let instance = owner();

  for (let fullName of fullNames) {
    let resolved = instance.lookup(fullName);

    if (resolved) {
      return resolved;
    }
  }

  return null;
}
