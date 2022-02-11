const Generator = require('yeoman-generator');
const chalk = require('chalk');
const hasInitialSetup = require('../../util/hasInitialSetup');
const tasks = {
  quick: 'Create quick unit (with default parameters)',
  multiple: 'Create display units ( you can create multiple or just one )',
  banner3D: 'create a 3D banner' 
}

module.exports = class App extends Generator {
  async questions() {
    const packageJson = require('../../package');

    // Have Yeoman greet the user.
    this.log(`
    Welcome to ${chalk.red('Display Templates Generator')} v${packageJson.version}
    -
    Create, change and start developing your display units
    `);

    console.log(tasks)

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

  async action() {

    switch (this.result.todo) {
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
