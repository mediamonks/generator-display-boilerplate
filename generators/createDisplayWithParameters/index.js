const Generator = require('yeoman-generator');

const PlatformChoices = require('../../util/data/PlatformChoices');

module.exports = class extends Generator {
  action() {
    this.log(`Creating banner with parameters`);

    switch (this.config.get('argsContext').type) {
      case PlatformChoices.PLAIN: {
        this.composeWith(require.resolve('./plain'));
        break;
      }

      case PlatformChoices.DOUBLECLICK: {
        this.composeWith(require.resolve('./doubleclick'));
        break;
      }

      default: {
        break;
      }
    }
  }
};
