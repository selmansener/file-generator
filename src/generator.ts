import { GeneratorConfig } from "./initialize";
import * as vscode from 'vscode';
import * as fs from 'fs';
import { getWorkspacePath } from "./utils/paths";

export function generateFile(config: GeneratorConfig, args: any) {
    config.files.forEach(file => {
        let fileContent = file.codeSnippet;
        let fileName = file.fileName;
        
        let filePlaceholders = new Set(file.fileName.match(/\{.*?\}/g));
        if (filePlaceholders) {
            filePlaceholders.forEach(match => {
                vscode.window.showInputBox({
                    placeHolder: match
                }).then(input => {
                    const matchRegex = new RegExp(match, "g");
                    fileName = fileName.replace(matchRegex, input);
                });
            });
        }

        if (file.codeSnippet) {
            const matches = new Set(file.codeSnippet.match(/\{.*?\}/g));

            if (matches) {
                matches.forEach(match => {
                    vscode.window.showInputBox({
                        placeHolder: match
                    }).then((input) => {
                        const matchRegex = new RegExp(match, "g");
                        fileContent = fileContent.replace(matchRegex, input);

                        const path = args.fsPath;
                        console.log(path);
                        
                        if (fs.lstatSync(path).isDirectory()) {
                            const workspacePath = getWorkspacePath();
                            fs.writeFileSync(`${workspacePath}/${fileName}.${file.extension}`, fileContent);
                        }
                    });
                });
            }
        }

    });
}