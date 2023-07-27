const deepmerge = require('deepmerge');
const Generator = require('yeoman-generator');
const path = require('path');
const bannerChoices = require("./bannerChoices");

module.exports = class extends Generator {


  async action() {
    let globalArgs = (this.config.get('hasParameters')) ? this.config.get('argsContext') : this.options;
    var prefixSharedFolder = 'shared';

    if (globalArgs.type  == 'doubleclick') {
      prefixSharedFolder = 'shared_doubleclick';
    } else if (globalArgs.type  == 'flashtalking') { 
      prefixSharedFolder = 'shared_flashtalking';
    }

    const outputPathShared = this.destinationPath(path.join(globalArgs.outputPath, 'shared'));

    this.fs.copy(this.templatePath('shared/css'), path.join(outputPathShared, 'css'));
    this.fs.copy(this.templatePath('shared/img'), path.join(outputPathShared, 'img'));
    this.fs.copy(this.templatePath('shared/script'), path.join(outputPathShared, 'script'));
    this.fs.copy(this.templatePath('shared/fonts'), path.join(outputPathShared, 'fonts'));
    this.fs.copy(this.templatePath('shared/.sharedrc'), path.join(outputPathShared, '.sharedrc'));
    this.fs.copy(this.templatePath(`${prefixSharedFolder}/index.hbs`), path.join(outputPathShared, 'index.hbs'));

    if (globalArgs.type  == 'doubleclick') {
      this.fs.copy(this.templatePath('shared_doubleclick/script'), path.join(outputPathShared, 'script'));
    }

    const sourceConfig = this.fs.readJSON(this.templatePath('__size__/.richmediarc'));

    globalArgs.units.forEach(size => {
      const [width, height] = size.split('x');

      const outputPath = this.destinationPath(path.join(globalArgs.outputPath, size));


      if (globalArgs.type  == 'flashtalking') {
        this.fs.copy(this.templatePath('shared_flashtalking/static'), this.destinationPath(path.join(outputPath, 'static')));
  
        this.fs.copyTpl(this.templatePath('shared_flashtalking/static/manifest.js'),this.destinationPath(path.join(outputPath, 'static/manifest.js')),
          {
            width,
            height,
          },
        );
      } 

      const entry = {
        ...sourceConfig.settings.entry
      };

      const content = {
        ...sourceConfig.content
      };

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

    this.fs.delete('.yo-rc.json');

  }

};
