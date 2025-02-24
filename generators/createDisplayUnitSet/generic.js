const deepmerge = require('deepmerge');
const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');
const bannerChoices = require('./bannerChoices'); // TODO: This is not in use
const PlatformChoices = require('../../util/data/PlatformChoices');

module.exports = class extends Generator {
  async action() {
    let globalArgs = this.config.get('hasParameters') ? this.config.get('argsContext') : this.options;

    const basePlatform = 'default';
    const platform = globalArgs.type == 'plain' ? basePlatform : globalArgs.type;

    const defaulInputPath = this.templatePath(basePlatform);
    const platformInputPath = this.templatePath(globalArgs.type);

    const outputPath = this.destinationPath(path.join(globalArgs.outputPath));
    const defaultSourceConfig = this.fs.readJSON(this.templatePath(`${basePlatform}/__size__/.richmediarc`));

    this.fs.copy(path.join(defaulInputPath, 'shared'), path.join(outputPath, 'shared'), { globOptions: { dot: true } });

    //overwite with platform specific shared setup
    if (platform != basePlatform) {
      this.fs.copy(path.join(platformInputPath, 'shared'), path.join(outputPath, 'shared'), {
        globOptions: { ignoreNoMatch: true, dot: true },
      });
    }

    let sourceConfig = this.fs.readJSON(this.templatePath(`${platform}/__size__/.richmediarc`), defaultSourceConfig);

    globalArgs.units.forEach((size) => {
      const [width, height] = size.split('x');

      const outputPath = this.destinationPath(path.join(globalArgs.outputPath, size));

      //copy default setup
      this.fs.copy(this.templatePath(`${basePlatform}/__size__`), outputPath, { globOptions: { dot: true } });

      //overwite with platform specific setup, repacing var width/height when found in files
      if (platform != basePlatform && fs.existsSync(this.templatePath(`${platform}/__size__`))) {
        this.fs.copyTpl(this.templatePath(`${platform}/__size__`), outputPath, {
          width,
          height,
          ignoreNoMatch: true,
          globOptions: { dot: true },
        });
      }

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
