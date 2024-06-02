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
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const IcCodeHoverProvider_1 = require("./IcCodeHoverProvider");
const IcCodeSemanticTokensProvider_1 = require("./IcCodeSemanticTokensProvider");
function activate(context) {
    console.log('Congratulations, your extension "ic10-code" is now active!');
    // 建立一个悬停效果
    let hoverProvider = vscode.languages.registerHoverProvider('ic10', new IcCodeHoverProvider_1.IcCodeHoverProvider());
    context.subscriptions.push(hoverProvider);
    // 建立一个分词渲染效果
    let tokensProvider = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'ic10' }, new IcCodeSemanticTokensProvider_1.DocumentSemanticTokensProvider(), IcCodeSemanticTokensProvider_1.legend);
    context.subscriptions.push(tokensProvider);
    let disposable = vscode.commands.registerCommand('ic10-code.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from ic10-code!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map