const chalk     = require('chalk');
const clear     = require('clear');
const CLI       = require('clui');
const figlet    = require('figlet');
const inquirer  = require('inquirer');
const GithubApi = require('github');
const git       = require('simple-git')()
const Spinner = CLI.Spinner;
// const files = require('./utils/files');

// clear();
// const greeting = figlet.textSync('Git - Line', { horizontalLayout: 'full' });
// console.log(chalk.blue(greeting));

const commands = require('./commands')(git);