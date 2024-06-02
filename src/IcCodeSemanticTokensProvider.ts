import * as vscode from 'vscode';

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

export const legend = (function() {
	const tokenTypesLegend = [
		'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
		'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
		'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
	];
	tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

	const tokenModifiersLegend = [
		'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
		'modification', 'async'
	];
	tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

	return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
})();

export interface IParsedToken {
	line: number;
	startCharacter: number;
	length: number;
	tokenType: string;
	tokenModifiers: string[];
}

export class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
	async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
		const allTokens = this._parseText(document.getText());
		const builder = new vscode.SemanticTokensBuilder();
		allTokens.forEach((token) => {
			builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
		});
		return builder.build();
	}

	private _encodeTokenType(tokenType: string): number {
		if (tokenTypes.has(tokenType)) {
			return tokenTypes.get(tokenType)!;
		} else if (tokenType === 'notInLegend') {
			return tokenTypes.size + 2;
		}
		return 0;
	}

	private _encodeTokenModifiers(strTokenModifiers: string[]): number {
		let result = 0;
		for (let i = 0; i < strTokenModifiers.length; i++) {
			const tokenModifier = strTokenModifiers[i];
			if (tokenModifiers.has(tokenModifier)) {
				result = result | (1 << tokenModifiers.get(tokenModifier)!);
			} else if (tokenModifier === 'notInLegend') {
				result = result | (1 << tokenModifiers.size + 2);
			}
		}
		return result;
	}

	private _parseText(text: string): IParsedToken[] {
		const jumpText: string[] = [];
		const deviceText: string[] = [];
		const r: IParsedToken[] = [];
		const lines = text.split(/\r\n|\r|\n/);
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const endPostion = line.indexOf(':');
			if (endPostion > -1) {
				const texts = line.split(' ');				
				if (texts.length > 0 && line.trim().startsWith(texts[0])) {					
					let jumpKey = line.trim().substring(0, endPostion);
					jumpText.push(jumpKey);
				    jumpKey = line.trim().substring(0, endPostion + 1);
					jumpText.push(jumpKey);
				}
			}
			if (line.trim().startsWith('alias')) {
				const texts = line.split(' ');
				if (texts[0] === 'alias' && texts[2].startsWith('d')) {
					deviceText.push(texts[1]);
				}
			}
		}
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const keyTexts = line.split(' ');
			for (let j = 0; j < keyTexts.length; j++) {
				const text = keyTexts[j];
				if (jumpText.includes(text)) {
					const begin = line.indexOf(text);
					const len = text.length;
					const tokenData = this._parseTextToken(text);
					r.push({
						line: i,
						startCharacter: begin,
						length: len,
						tokenType: 'keyword',
						tokenModifiers: tokenData.tokenModifiers
					});
				} else if (deviceText.includes(text)) {
					const begin = line.indexOf(text);
					const len = text.length;
					const tokenData = this._parseTextToken(text);
					r.push({
						line: i,
						startCharacter: begin,
						length: len,
						tokenType: 'comment',
						tokenModifiers: tokenData.tokenModifiers
					});
				}	
			}
		}
		return r;
	}

	private _parseTextToken(text: string): { tokenType: string; tokenModifiers: string[]; } {
		const parts = text.split('.');
		return {
			tokenType: parts[0],
			tokenModifiers: parts.slice(1)
		};
	}
}


	// const tokenTypes = ['class', 'interface', 'enum', 'function', 'variable'];
    // const tokenModifiers = ['declaration', 'documentation'];
    // const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
	// const selector = { language: 'ic10', scheme: 'file' }; // register for all Java documents from the local file system
	// const provider: vscode.DocumentSemanticTokensProvider = {
	// 	provideDocumentSemanticTokens(
	// 	  document: vscode.TextDocument
	// 	): vscode.ProviderResult<vscode.SemanticTokens> {
	// 	  // analyze the document and return semantic tokens
	  
	// 	  const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
	// 	  // on line 1, characters 1-5 are a class declaration
	// 	  tokensBuilder.push(
	// 		new vscode.Range(new vscode.Position(1, 1), new vscode.Position(1, 5)),
	// 		'enum',
	// 		['declaration']
	// 	  );
	// 	  return tokensBuilder.build();
	// 	}
	// };
	// vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend);
	