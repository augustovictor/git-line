const commander = require('commander');
const inquirer = require('inquirer');

module.exports = git => {
    commander
        .version('0.0.1')
        .description('Git command line tool');

    commander
        .command('status')
        .alias('st')
        .description('Select files to commit')
        .action(() => git.status((err, res) => {
            inquirer.prompt([{
                type: 'checkbox',
                name: 'untrackedFiles',
                message: 'Add untracked files to stage:',
                choices: res.not_added.map(el => el),
            }])
            .then(files => {
                git.add(files.untrackedFiles, () => {
                    console.log('Files added.')
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
                    console.info('Commit done.');
                }).push('origin', 'master');
            });
        })

    commander.parse(process.argv);

    return commander;
}