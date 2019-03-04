/* eslint-env node */
module.exports = {
  description: '',

  // locals(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  detectPackageResolvable(package) {
    try {
      return Boolean(require.resolve(package));
    } catch (err) {
      if (err.message.match('Cannot find module')) {
        return false;
      } else {
        throw err
      }
    }
  },

  afterInstall(/*options*/) {
    if (!this.detectPackageResolvable('sinon')) {
      if (this.detectPackageResolvable('ember-auto-import')) {
        return this.addPackageToProject('sinon');
      } else {
        return this.addAddonsToProject({
          packages: ['ember-sinon']
        });
      }
    }
  }
};
