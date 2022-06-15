#!/usr/bin/env node

import fs from 'fs';
import shell from 'shelljs';
import path from 'path';
import inquirer from 'inquirer';
import PressToContinuePrompt from 'inquirer-press-to-continue';
import type {KeyDescriptor} from 'inquirer-press-to-continue';
import questions from './questions';
import {TemplateData} from './types';
import {createDirectoryContents, createNewProject} from './file-utils';

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

const currentDir = process.cwd();

inquirer.prompt(questions).then(async answers => {
    // answers
    const projectChoice = answers['template'];
    const projectName = answers['name'];
    const moduleName = answers['moduleName'];
    const entryFileName = answers['entryFileName'];

    console.log("Your config: ");
    console.log(answers);

    await inquirer.prompt<{ key: KeyDescriptor }>({
        name: 'key',
        type: 'press-to-continue',
        anyKey: true,
        pressToContinueMessage: "Press any key to continue..."
    });

    const templatePath = path.join(__dirname, 'templates', projectChoice);
    const targetPath = path.join(currentDir, projectName);

    // template options
    const templateOptions: TemplateData = {
        projectName, moduleName, entryFileName
    }

    if (!createNewProject(targetPath)) {
        return;
    }

    console.log('Creating project tree...')
    const filesToSkip = ['node_modules', '.template.json'];
    createDirectoryContents(currentDir, templatePath, projectName, templateOptions, filesToSkip);
    console.log('%s\x1b[32m%s\x1b[0m', 'Creating project tree: ', 'Success');

    console.log('Installing npm packages...')
    postProcess(templatePath, targetPath);
    console.log('%s\x1b[32m%s\x1b[0m', 'Installing npm packages: ', 'Success');
});

const postProcess = (templatePath: string, targetPath: string) => {
    const isNode = fs.existsSync(path.join(templatePath, 'package.json'));
    if (isNode) {
        shell.cd(targetPath);
        const result = shell.exec('npm install');

        if (result.code !== 0) {
            return false;
        }
    }

    return true;
}
