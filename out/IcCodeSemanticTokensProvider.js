"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSemanticTokensProvider = exports.legend = void 0;
const vscode = __importStar(require("vscode"));
const tokenTypes = new Map();
const tokenModifiers = new Map();
exports.legend = (function () {
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
class DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document, token) {
        const allTokens = this._parseText(document.getText());
        const builder = new vscode.SemanticTokensBuilder();
        allTokens.forEach((token) => {
            builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
        });
        return builder.build();
    }
    _encodeTokenType(tokenType) {
        if (tokenTypes.has(tokenType)) {
            return tokenTypes.get(tokenType);
        }
        else if (tokenType === 'notInLegend') {
            return tokenTypes.size + 2;
        }
        return 0;
    }
    _encodeTokenModifiers(strTokenModifiers) {
        let result = 0;
        for (let i = 0; i < strTokenModifiers.length; i++) {
            const tokenModifier = strTokenModifiers[i];
            if (tokenModifiers.has(tokenModifier)) {
                result = result | (1 << tokenModifiers.get(tokenModifier));
            }
            else if (tokenModifier === 'notInLegend') {
                result = result | (1 << tokenModifiers.size + 2);
            }
        }
        return result;
    }
    _parseText(text) {
        const jumpText = [];
        const deviceText = [];
        const r = [];
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
                }
                else if (deviceText.includes(text)) {
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
    _parseTextToken(text) {
        const parts = text.split('.');
        return {
            tokenType: parts[0],
            tokenModifiers: parts.slice(1)
        };
    }
}
exports.DocumentSemanticTokensProvider = DocumentSemanticTokensProvider;
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
//# sourceMappingURL=IcCodeSemanticTokensProvider.js.map