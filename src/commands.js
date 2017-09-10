const commander = require('commander');
const inquirer  = require('inquirer');
const CLI       = require('clui');
const _         = require('lodash');

const Spinner = CLI.Spinner;
const spinner = new Spinner();

module.exports = git => {
    commander
        .version('0.0.1')
        .description('Git command line tool');

    commander
        .command('')
        .alias('st')
        .description('Select files to commit')
        .action(() => git.status((err, res) => {
            // console.log(res);
            const files = _.concat(res.not_added, res.modified);
            inquirer.prompt([{
                type: 'checkbox',
                name: 'untrackedFiles',
                message: 'Add untracked files to stage:',
                choices: files,
            }])
            .then(files => {
                git.add(files.untrackedFiles, () => {
                    console.log('Files added.')
                });
            })
            .then(() => 
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'commitQuestion',
                    message: 'Would you like to commit added files?',
                    default: true
                }])
            )
            .then(commitQuestionResponse => inquirer.prompt([{
                type: 'input',
                name: 'message',
                message: 'Enter a commit message:',
            }]))
            .then(commitMessageObj => {
                git.commit(commitMessageObj.message, () => {
                    console.info('Commit ok.');
                    spinner.message('Pushing your changes to origin/master');
                    spinner.start();
                }).push('origin', 'master', () => {
                    spinner.stop();
                    console.info('Changes pushed to origin/master');
                });
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