import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';

const snippets: {
	"prefix": string,
	"body": string[],
	"description": string
}[] = require("../snippets/snippets.json");

const regTooltipBegin = new RegExp(/\$\{(\d+):/g);
const regTooltipEnd = new RegExp(/\}/g);

export class IcCodeHoverProvider implements vscode.HoverProvider {

	constructor() {

	}

	provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		const fileName = document.fileName;
		const workDir = path.dirname(fileName);
		const word: any = document.getText(document.getWordRangeAtPosition(position));
		const line = document.lineAt(position);

		let mdString: vscode.MarkdownString = new vscode.MarkdownString();

		if (snippets[word] !== undefined) {
			//console.log("测试输出:" + snippets[word].prefix);

			let bodyString = snippets[word].body[0].replaceAll(regTooltipBegin, "");
			bodyString = bodyString.replaceAll(regTooltipEnd, "");
			mdString.appendCodeblock(bodyString);
			mdString.appendCodeblock(snippets[word].description);
		}
		//const projectPath = util.getProjectPath(document);
		//const lineText = document.lineAt(position).text.substring(0, position.character);

		return new vscode.Hover(mdString);
	}
}

