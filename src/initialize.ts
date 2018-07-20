import * as fs from 'fs';
import * as vscode from 'vscode';
import { mergeWith } from 'lodash';
import { getWorkspacePath } from './utils/paths';

export interface FileConfig {
    fileName: string;
    extension: string;
    codeSnippet?: string;
}

export interface GeneratorConfig {
    title: string;
    files: FileConfig[];
}

export const defaultConfig: GeneratorConfig[] = [
    {
        title: "Generate Action File",
        files: [
            {
                fileName: "{prefix}-{containerName}-action",
                extension: "ts",
                codeSnippet: '"export const {actionName} = "{actionName}"\nexport type {actionName} = typeof {actionName};"'
            }
        ]

    },
    {
        title: "Generate Dummy File",
        files: [
            {
                fileName: "{prefix}-dummy",
                extension: "tsx",
                codeSnippet: 'export const {constName};'
            }
        ]
    }
];

export interface ExtensionConfiguration {
    generatorConfigPath: string;
}

export function getConfigurations(): ExtensionConfiguration {
    let configurations = vscode.workspace.getConfiguration().inspect("file-generator");
    let mergedConfigs;

    if (configurations && !configurations.defaultValue && !configurations.globalValue && !configurations.workspaceValue) {
        return {
            generatorConfigPath: './generator.json'
        };
    }

    if (configurations.workspaceValue) {
        mergedConfigs = mergeWith(configurations.defaultValue, configurations.workspaceValue, (target, source) => {
            return source;
        });
    }
    else {
        mergedConfigs = mergeWith(configurations.defaultValue, configurations.globalValue, (target, source) => {
            return source;
        });
    }

    return mergedConfigs as ExtensionConfiguration;
}

export function initializeExtension(): GeneratorConfig[] {
    const configurations = getConfigurations();

    if (!configurations) {
        return;
    }

    const workspacePath = getWorkspacePath();
    const generatorConfigPath = `${workspacePath}/${configurations.generatorConfigPath}`;

    if (!fs.existsSync(generatorConfigPath)) {
        fs.writeFileSync(generatorConfigPath, JSON.stringify(defaultConfig, null, 4));
        return defaultConfig;
    } else {
        return <GeneratorConfig[]>JSON.parse(fs.readFileSync(generatorConfigPath, 'utf8'));
    }
}