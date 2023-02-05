import fs from 'fs';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import path from 'path';

const prompt = inquirer.createPromptModule();
prompt.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

prompt([
  {
    enableGoUpperDirectory: true,
    message: 'Select a directory for the config file (sql2md.config.js)',
    name: 'configDir',
    onlyShowDir: true,
    type: 'file-tree-selection',
  },
  {
    enableGoUpperDirectory: true,
    message: 'Select a directory to output the .md files',
    name: 'dir',
    onlyShowDir: true,
    type: 'file-tree-selection',
  },
  { message: 'Database name', name: 'db_name' },
  { default: 'root', message: 'Database user', name: 'db_user' },
  { default: 'password', message: 'Database password', name: 'db_pass' },
]).then((all) => {
  console.log('hi', all);
  fs.writeFileSync(
    path.join(all.configDir, 'sql2md.config.js'),
    `export default {
  outputDir: '${all.dir}/sql2md',
}`,
  );
});
