#!/usr/bin/env node

import path from 'path';
import inquirer from 'inquirer';
import questions from './questions';
import {CliOptions, TemplateData} from './types';
import {createDirectoryContents, createNewProject} from './file-utils';
import fs from 'fs';
import shell from 'shelljs';

const currentDir = process.cwd();

inquirer.prompt(questions).then(answers => {
    // answers
    const projectChoice = answers['template'];
    const projectName = answers['name'];
    const moduleName = answers['moduleName'];
    const entryFileName = answers['entryFileName'];

    const templatePath = path.join(__dirname, 'templates', projectChoice);
    const targetPath = path.join(currentDir, projectName);

    // cli and template options
    const options: CliOptions = {
        projectName,
        templateName: projectChoice,
        templatePath,
        targetPath,
    }
    const templateOptions: TemplateData = {
        projectName, moduleName, entryFileName
    }

    if (!createNewProject(targetPath)) {
        return;
    }

    console.log('Creating project tree...')
    const filesToSkip = ['node_modules', '.template.json'];
    createDirectoryContents(currentDir, templatePath, projectName, templateOptions, filesToSkip);
    console.log('%cCreating project tree: SUCCESS', 'color: green');

    console.log('Installing npm packages...')
    postProcess(options);
    console.log('%cInstalling npm packages: SUCCESS', 'color: green');
});

const postProcess = (options: CliOptions) => {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        shell.cd(options.targetPath);
        const result = shell.exec('npm install');

        if (result.code !== 0) {
            return false;
        }
    }

    return true;
}
