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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IcCodeHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const path_1 = __importDefault(require("path"));
const snippets = require("../snippets/snippets.json");
const regTooltipBegin = new RegExp(/\$\{(\d+):/g);
const regTooltipEnd = new RegExp(/\}/g);
class IcCodeHoverProvider {
    constructor() {
    }
    provideHover(document, position, token) {
        const fileName = document.fileName;
        const workDir = path_1.default.dirname(fileName);
        const word = document.getText(document.getWordRangeAtPosition(position));
        const line = document.lineAt(position);
        let mdString = new vscode.MarkdownString();
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
exports.IcCodeHoverProvider = IcCodeHoverProvider;
//# sourceMappingURL=IcCodeHoverProvider.js.map