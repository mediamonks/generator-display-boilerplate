const deepmerge = require('deepmerge');
const mkdirp = require('mkdirp');

const Generator = require('yeoman-generator');
const isPathInside = require('is-path-inside');
const path = require('path');
const bannerChoices = require("./bannerChoices");

module.exports = class extends Generator {

  async questions() {

    if(!this.config.get('argsContext').hasArgsUnits) {

      // searching for existing
      this.result = {
        ...this.result,
        ...(await this.prompt([
          {
            type: 'checkbox',
            name: 'set_html',
            message: 'Please select display unit with separate html:',
            choices: bannerChoices
              .filter(item => this.options.set.find(size => size === item.value))
          },
        ])),
      };

      // searching for existing
      this.result = {
        ...this.result,
        ...(await this.prompt([
          {
            type: 'checkbox',
            name: 'set_js',
            message: 'Please select display unit with separate javascript:',
            choices: bannerChoices
              .filter(item => this.options.set.find(size => size === item.value))
          },
        ])),
      };

      // searching for existing
      this.result = {
        ...this.result,
        ...(await this.prompt([
          {
            type: 'checkbox',
            name: 'set_css',
            message: 'Please select display unit with separate css:',
            choices: bannerChoices
              .filter(item => this.options.set.find(size => size === item.value))
          },
        ])),
      };

    }
    
  }

  async action() {
    let globalArgs = (this.config.get('argsContext').hasArgsUnits) ? this.config.get('argsContext') : this.options;

    const outputPathShared = this.destinationPath(path.join(globalArgs.outputPath, 'shared'));

    this.fs.copy(this.templatePath('shared/css'), path.join(outputPathShared, 'css'));
    this.fs.copy(this.templatePath('shared/img'), path.join(outputPathShared, 'img'));
    this.fs.copy(this.templatePath('shared/.sharedrc'), path.join(outputPathShared, '.sharedrc'));

    this.fs.copy(this.templatePath('shared_doubleclick/script'), path.join(outputPathShared, 'script'));
    this.fs.copy(this.templatePath('shared_doubleclick/index.hbs'), path.join(outputPathShared, 'index.hbs'));

    const sourceConfig = this.fs.readJSON(this.templatePath('__size__/.richmediarc'));

    globalArgs.units.forEach(size => {
      const [width, height] = size.split('x');

      const outputPath = this.destinationPath(path.join(globalArgs.outputPath, size));

      if(!this.config.get('argsContext').hasArgsUnits) {
        var hasSeparateHTML = this.result.set_html.find(item => item === size);
        var hasSeparateJS = this.result.set_js.find(item => item === size);
        var hasSeparateCSS = this.result.set_css.find(item => item === size);
      }

      const entry = {
        ...sourceConfig.settings.entry
      };

      const content = {
        ...sourceConfig.content
      };

      if(!this.config.get('argsContext').hasArgsUnits) {
        if(hasSeparateHTML){
          entry.html = './index.hbs';

          this.fs.copy(
            this.templatePath('shared/index.hbs'),
            this.destinationPath(path.join(outputPath, 'index.hbs'))
          );
        }

        if(hasSeparateJS){
          entry.js = './script/main.js';

          this.fs.copy(
            this.templatePath('shared_doubleclick/script'),
            this.destinationPath(path.join(outputPath, 'script'))
          );
        }

        if(hasSeparateCSS){
          content.css = './css/style.css';

          this.fs.copy(
            this.templatePath('shared/css'),
            this.destinationPath(path.join(outputPath, 'css'))
          );
        }
      }

      let config = deepmerge(sourceConfig, {
        settings: {
          entry,
          size: {
            width: parseInt(width, 10),
            height: parseInt(height, 10),
          },
        },
        content
      });

      this.fs.writeJSON(path.join(outputPath, '.richmediarc'), config);
    });

  }

};
