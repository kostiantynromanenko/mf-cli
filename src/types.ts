export interface CliOptions {
    projectName: string;
    templateName: string;
    templatePath: string;
    targetPath: string;
}

export interface TemplateData {
    projectName: string;
    moduleName: string;
    entryFileName: string;
}
