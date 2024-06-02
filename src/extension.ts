// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { IcCodeHoverProvider } from './IcCodeHoverProvider';
import { DocumentSemanticTokensProvider, legend } from './IcCodeSemanticTokensProvider';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "ic10-code" is now active!');

	// 建立一个悬停效果
	let hoverProvider = vscode.languages.registerHoverProvider('ic10',  new IcCodeHoverProvider());
	context.subscriptions.push(hoverProvider);

	// 建立一个分词渲染效果
	let tokensProvider = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'ic10' }, new DocumentSemanticTokensProvider(), legend);
	context.subscriptions.push(tokensProvider);

	let disposable = vscode.commands.registerCommand('ic10-code.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from ic10-code!');
	});

	context.subscriptions.push(disposable);	
}

export function deactivate() {}

