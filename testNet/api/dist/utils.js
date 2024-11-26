"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAction = void 0;
var DocumentAction;
(function (DocumentAction) {
    DocumentAction[DocumentAction["CREATED"] = 0] = "CREATED";
    DocumentAction[DocumentAction["READ"] = 1] = "READ";
    DocumentAction[DocumentAction["EDITED"] = 2] = "EDITED";
    DocumentAction[DocumentAction["DELETED"] = 3] = "DELETED";
})(DocumentAction || (exports.DocumentAction = DocumentAction = {}));
