"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideHover = void 0;
const reg = new RegExp(/\\b[\\w\\W]*/);
function provideHover(document, position) {
    const word = document.getText(document.getWordRangeAtPosition(position));
    const lineText = document.lineAt(position).text.substring(0, position.character);
}
exports.provideHover = provideHover;
;
//# sourceMappingURL=iccode.provider.js.map