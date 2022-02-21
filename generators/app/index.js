const Generator = require('yeoman-generator');
const chalk = require('chalk');
const hasInitialSetup = require('../../util/hasInitialSetup');
const tasks = {
  quick: 'Create quick unit (with default parameters)',
  multiple: 'Create display units (you can create multiple or just one)',
  banner3D: 'Create a 3D banner',
  arguments: 'Create with arguments'
}

module.exports = class App extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("units", { type: String, required: false }); // array with sizes, coma separated
    this.argument("type", { type: String, required: false }); // doubleclick, plain, flashtalking, etc

    this.hasArgsUnits = (this.options.units) ? true : false;

    if (this.hasArgsUnits) {
      this.config.set('argsContext', {
        units: this.options.units.replace(/\s/g, '').split(','),
        type: (this.options.type) ? this.options.type : 'plain',
        outputPath: `./src/${this.options.type}/`,
        hasArgsUnits: this.hasArgsUnits
      });
    } 
  }

  async questions() {
    const packageJson = require('../../package');

    this.log(`
    Welcome to ${chalk.red('Display Templates Generator')} v${packageJson.version}
    -
    Create, change and start developing your display units
    `);
    
    if (!this.hasArgsUnits) {
      this.result = await this.prompt([
        {
          type: 'list',
          name: 'todo',
          message: 'What do you want to do?',
          choices: [
            tasks.quick,
            tasks.multiple,
            //tasks.banner3D,
          ],
        },
      ]);
    }
    
  }

  async action() {
    const task = (this.config.get('argsContext').hasArgsUnits) ? 'Create with arguments' : this.result.type;

      switch (task) {
        case tasks.quick: {
          if (!hasInitialSetup(this)) {
            this.composeWith(require.resolve('../setup'), { options: '' });
          }
  
          this.composeWith(require.resolve('../createDisplayQuickUnit'), { set: ['300x250'], outputPath: './src/plain/', type: 'plain' });
          break;
        }
  
        case tasks.multiple: {
          if (!hasInitialSetup(this)) {
            this.composeWith(require.resolve('../setup'), { options: '' });
          }
  
          this.composeWith(require.resolve('../createDisplayUnitSet'), { options: '' });
          break;
        }

        case tasks.arguments: {
          if (!hasInitialSetup(this)) {
            this.composeWith(require.resolve('../setup'), { options: '' });
          }
  
          this.composeWith(require.resolve('../createDisplayUnitSet'), { options: '' });
          break;
        }
  
        // case tasks.banner3D: {
        //   this.composeWith(require.resolve('../create3DBanner'), { options: '' });
        //   break;
        // }
  
        default: {
          break;
        }
      }
    
  }
};
