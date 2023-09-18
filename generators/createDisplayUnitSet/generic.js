const deepmerge = require('deepmerge');
const Generator = require('yeoman-generator');
const path = require('path');
const bannerChoices = require('./bannerChoices'); // TODO: This is not in use
const PlatformChoices = require('../../util/data/PlatformChoices');

module.exports = class extends Generator {
  async action() {
    let globalArgs = this.config.get('hasParameters') ? this.config.get('argsContext') : this.options;

    const basePlatform = 'default';
    const platform = globalArgs.type == 'plain' ? basePlatform : globalArgs.type;
    const subtype = globalArgs.subtype == 'standard' ? 'default' : globalArgs.subtype;
    const defaulInputPath = this.templatePath(basePlatform);
    const platformInputPath = this.templatePath(path.join(globalArgs.type));
    const platformWithSubtypeInputPath = this.templatePath(`${globalArgs.type}/${subtype}`);
    const outputPath = this.destinationPath(path.join(globalArgs.outputPath));
    const defaultSourceConfig = this.fs.readJSON(this.templatePath(`${basePlatform}/__size__/.richmediarc`));

    this.fs.copy(path.join(defaulInputPath, 'shared'), path.join(outputPath, 'shared'), { globOptions: { dot: true } });

    //overwite with platform specific shared setup
    if (platform != basePlatform) {
      if(platform === PlatformChoices.FLASHTALKING) {
        this.fs.copy(path.join(this.templatePath(`flashtalking/default/`), 'shared'), path.join(outputPath, 'shared'), {
          globOptions: { ignoreNoMatch: true, dot: true },
        });

        this.fs.copy(path.join(platformWithSubtypeInputPath, 'shared'), path.join(outputPath, 'shared'), {
          globOptions: { ignoreNoMatch: true, dot: true },
        });
      } else {
        this.fs.copy(path.join(platformInputPath, 'shared'), path.join(outputPath, 'shared'), {
          globOptions: { ignoreNoMatch: true, dot: true },
        });
      }
    }

    let sourceConfig = this.fs.readJSON(this.templatePath(`${platform}/__size__/.richmediarc`), defaultSourceConfig);

    globalArgs.units.forEach((size) => {
      const [width, height] = size.split('x');

      const outputPath = this.destinationPath(path.join(globalArgs.outputPath, size));

      //copy default setup
      this.fs.copy(this.templatePath(`${basePlatform}/__size__`), outputPath, { globOptions: { dot: true } });

      //overwite with platform specific setup
      if (platform != basePlatform && this.fs.exists(this.templatePath(`${platform}/__size__`))) {
        this.fs.copy(this.templatePath(`${platform}/__size__`), outputPath, { globOptions: { dot: true } });
      }

      if (platform === PlatformChoices.FLASHTALKING) {
        this.fs.copyTpl(
          this.templatePath(`flashtalking/${subtype}/__size__`),
          this.destinationPath(path.join(outputPath)),
          {
            width,
            height,
          },
        );
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
