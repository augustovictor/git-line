const chalk     = require('chalk');
const commander = require('commander');
const inquirer  = require('inquirer');
const clear     = require('clear');
const CLI       = require('clui');
const _         = require('lodash');
const EventEmitter = require('events');

const Spinner = CLI.Spinner;
const spinner = new Spinner();

let temporaryListener = new EventEmitter();

module.exports = git => {
    commander
        .version('0.0.1')
        .description('Git command line tool');

    commander
        .command('')
        .alias('st')
        .description('Select files to commit')
        .action(() => git.status((err, res) => {
            const files = _.concat(res.not_added, res.modified);
            let pointer = 0;
            
            git.diff([files[pointer]], (err, res) => {
                console.log(chalk.blue(`\n\n\n DIFF - FILE: ${files[pointer]}\n`));
                console.log(res);
            });
            
            process.stdin.on('keypress', (str, key) => temporaryListener.emit('keypress', key));
            
            temporaryListener.on('keypress', (key) => {
                clear();
                if (key.name === 'up') {
                    if (pointer === 0) {
                        pointer = files.length -1;
                    } else {
                        pointer--;
                    }
                }

                if (key.name === 'down') {
                    if (pointer === files.length -1) {
                        pointer = 0;
                    } else {
                        pointer++;
                    }
                }
                if (key.name === 'up' || key.name === 'down' || key.name === 'space') {
                    git.diff([files[pointer]], (err, res) => {
                    console.log(`\n\n\n DIFF - FILE: ${files[pointer]}\n`);
                        console.log(res);
                    });
                }
            });
            
            return inquirer.prompt([{
                type: 'checkbox',
                name: 'files',
                message: 'Add files to stage:',
                choices: files,
            }])
            .then(files => {
                temporaryListener.removeAllListeners();
                clear();
                git.add(files.files, () => {
                    // console.log('Files added.')
                });
                // TODO: Remove files
            })
            .then(() => 
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'answer',
                    message: 'Would you like to commit added files?',
                    default: true
                }])
            )
            .then(commitQuestionResponse => {
                    if(!commitQuestionResponse.answer) return process.exit(0);
                    return inquirer.prompt([{
                    type: 'input',
                    name: 'message',
                    message: 'Enter a commit message:',
                }])}
            )
            .then(commitMessageObj => {
                git.commit(commitMessageObj.message, () => {
                    console.info('Commit ok.');
                    spinner.message('Pushing your changes to origin/master');
                    spinner.start();
                }).push('origin', 'master', () => {
                    spinner.stop();
                    console.info('Changes pushed to origin/master successfully =D.');
                });
            }).catch(e => {
                console.error(e);
            });
        }));
    
    commander
        .command('commit-push')
        .alias('cmp')
        .description('Define a commit message')
        .action(() => {
            inquirer.prompt([{
                type: 'input',
                name: 'commitMessage',
                message: 'Enter a commit message:',
            }]).then((resObj) => {
                git.commit(resObj.commitMessage, () => {
                    console.info('Commit ok.');
                    spinner.message('Pushing your changes to origin/master');
                    spinner.start();
                }).push('origin', 'master', () => {
                    spinner.stop();
                    console.info('Changes pushed to origin/master');
                });
            });
        })

    commander.parse(process.argv);

    return commander;
}