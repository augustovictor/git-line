#!/usr/bin/env node

const chalk     = require('chalk');
const clear     = require('clear');
const CLI       = require('clui');
const figlet    = require('figlet');
const inquirer  = require('inquirer');
const GithubApi = require('github');
const git       = require('simple-git')()
const Spinner = CLI.Spinner;
const files = require('./utils/files');

// TODO: Always go to root directory
// console.log(files.getRootApplicationPath());
if (!files.directoryExists('.git')) {
    console.log(chalk.red('There is no git in this directory.'));
    console.log(chalk.blue('Navigate to your application root directory.'));
    process.exit();
}

clear();
const greeting = figlet.textSync('Git - Line', { horizontalLayout: 'full' });
console.log(chalk.blue(greeting));

const commands = require('./commands')(git);