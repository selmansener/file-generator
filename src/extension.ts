'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initializeExtension } from './initialize';
import { generateFile } from './generator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-file-generator" is now active!');

    const generatorConfigs = initializeExtension();
    const availableOptions = generatorConfigs.map(x => x.title);

    const generateFileCommand = vscode.commands.registerCommand('extension.generateFile', (args) => {
        vscode.window.showQuickPick(
            availableOptions,
            {
                placeHolder: "Pick an option"
            }).then(selection => {
                const selectedConfig = generatorConfigs.find(x => x.title === selection);
                generateFile(selectedConfig, args);
            });
    });

    context.subscriptions.push(generateFileCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
}