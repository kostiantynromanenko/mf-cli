import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import {render} from './template';
import {TemplateData} from "./types";

export const createNewProject = (projectPath: string): boolean => {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);

    return true;
}

export const createDirectoryContents = (
    currentDir: string,
    templatePath: string,
    projectName: string,
    templateOptions: TemplateData,
    filesToSkip?: string[]
): void => {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        if (filesToSkip?.includes(file)) {
            return;
        }

        const originalFilePath = path.join(templatePath, file);
        const stats = fs.statSync(originalFilePath);

        if (stats.isFile()) {
            let contents = render(fs.readFileSync(originalFilePath, 'utf8'), templateOptions);
            const writePath = path.join(currentDir, projectName, file);

            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(path.join(currentDir, projectName, file));
            createDirectoryContents(currentDir, path.join(templatePath, file), path.join(projectName, file),
                templateOptions, filesToSkip);
        }
    });
}
