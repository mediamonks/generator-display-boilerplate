const Generator = require('yeoman-generator');
const isPathInside = require('is-path-inside');
const path = require('path');
const PlatformChoices = require('../../util/data/PlatformChoices');
const bannerChoices = require('./bannerChoices');

module.exports = class extends Generator {
  async questions() {
    this.log(`Creating banner`);

    console.log(this.result);

    if (!this.config.get('argsContext') && this.options.task != 'quick') {
      this.result = {
        ...this.result,
        ...(await this.prompt([
          {
            type: 'checkbox',
            name: 'units',
            message: 'Please select a set for your unit:',
            choices: bannerChoices,
          },
        ])),
      };

      this.result = {
        ...this.result,
        ...(await this.prompt([
          {
            type: 'list',
            name: 'type',
            message: 'Please select a type you want:',
            choices: [
              { name: PlatformChoices.PLAIN, value: PlatformChoices.PLAIN },
              { name: PlatformChoices.DOUBLECLICK, value: PlatformChoices.DOUBLECLICK },
              { name: PlatformChoices.FLASHTALKING, value: PlatformChoices.FLASHTALKING },
            ],
          },
        ])),
      };

      this.result = {
        ...this.result,
        ...(await this.prompt({
          type: 'input',
          name: 'outputPath',
          message: 'Where do you want to put it?',
          default: `./src/${this.result.type}/`,
          validate: (input) => isPathInside(path.resolve(input), path.resolve(process.cwd())),
        })),
      };
    } else {
      this.result = { ...this.options };
    }
  }

  action() {
    this.composeWith(require.resolve('./generic'), this.result);
  }
};
