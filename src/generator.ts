import { GeneratorConfig, FileConfig } from "./initialize";
import * as vscode from 'vscode';
import * as fs from 'fs';
import { getWorkspacePath } from "./utils/paths";

export function generateFileContent(fileName: string, extension: string, codeSnippet: string, args: any) {
    let fileContent = codeSnippet;

    if (codeSnippet) {
        const matches = new Set(codeSnippet.match(/\{.*?\}/g));

        if (matches) {
            matches.forEach(match => {
                vscode.window.showInputBox({
                    placeHolder: match
                }).then((input) => {
                    const matchRegex = new RegExp(match, "g");
                    fileContent = fileContent.replace(matchRegex, input);

                    const path = args.fsPath;
                    
                    if (fs.lstatSync(path).isDirectory()) {
                        const workspacePath = getWorkspacePath();
                        fs.writeFileSync(`${workspacePath}/${fileName}.${extension}`, fileContent);
                    }
                });
            });
        }
    }
}

export function generateFile(config: GeneratorConfig, args: any) {
    config.files.forEach(file => {
        let fileName = file.fileName;
        
        // TODO : create a better regex to handle curly brackets for object and func declartions
        let filePlaceholders =  [...new Set(file.fileName.match(/\{.*?\}/g))];
        if (filePlaceholders) {
            filePlaceholders.forEach(match => {
                vscode.window.showInputBox({
                    placeHolder: match
                }).then(input => {
                    const matchRegex = new RegExp(match, "g");
                    fileName = fileName.replace(matchRegex, input);
                    if (filePlaceholders[filePlaceholders.length - 1] === match) {
                        generateFileContent(fileName, file.extension, file.codeSnippet, args);
                    }
                });
            });
        } else {
            generateFileContent(fileName, file.extension, file.codeSnippet, args);
        }


    });
}