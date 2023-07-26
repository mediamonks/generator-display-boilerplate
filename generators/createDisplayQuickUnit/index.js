const deepmerge = require('deepmerge');
const Generator = require('yeoman-generator');
const path = require('path');

module.exports = class extends Generator {
  // async questions() {
  // }

  async action() {
    this.fs.copy(this.templatePath('shared'), this.destinationPath(path.join(this.options.outputPath, 'shared')));

    this.fs.copy(
      this.templatePath('shared/.sharedrc'),
      this.destinationPath(path.join(this.options.outputPath, 'shared/.sharedrc')),
    );

    const sourceConfig = this.fs.readJSON(this.templatePath('__size__/.richmediarc'));

    this.options.set.forEach((size) => {
      const [width, height] = size.split('x');

      const outputPath = this.destinationPath(path.join(this.options.outputPath, size));

      this.fs.copy(this.templatePath('__size__'), outputPath);

      const entry = {
        ...sourceConfig.settings.entry,
      };

      const content = {
        ...sourceConfig.content,
      };

      let config = deepmerge(sourceConfig, {
        settings: {
          entry,
          size: {
            width: parseInt(width, 10),
            height: parseInt(height, 10),
          },
        },
        content,
      });

      this.fs.writeJSON(path.join(outputPath, '.richmediarc'), config);
    });

    this.fs.delete('.yo-rc.json');
  }
};
