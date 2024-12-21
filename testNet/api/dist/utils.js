"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonController = exports.__ΩpythonAPI = exports.DocumentAction = exports.__ΩDocumentAction = exports.__ΩDocumentLedger = exports.__ΩDocumentDB = void 0;
const pybridge_1 = require("pybridge");
const __ΩDocumentDB = ['file', 'creatorID', 'documentHash', 'documentID', 'documentName', 'documentType', 'signable', 'DocumentDB', 'P!4!&4"&4#&4$&4%&4&)4\'Mw(y'];
exports.__ΩDocumentDB = __ΩDocumentDB;
const __ΩDocumentLedger = ['creatorID', 'documentHash', 'documentID', 'documentName', 'documentType', 'signable', 'lastInteractedWithID', () => __ΩDocumentAction, 'lastAction', 'vector', 'DocumentLedger', 'P&4!&4"&4#&4$&4%)4&&4\'n(4)\'F4*Mw+y'];
exports.__ΩDocumentLedger = __ΩDocumentLedger;
const __ΩDocumentAction = ['CREATED', () => "CREATED", 'READ', () => "READ", 'EDITED', () => "EDITED", 'DELETED', () => "DELETED", 'DocumentAction', 'PC!>"C#>$C%>&C\'>(Bw)'];
exports.__ΩDocumentAction = __ΩDocumentAction;
var DocumentAction;
(function (DocumentAction) {
    DocumentAction["CREATED"] = "CREATED";
    DocumentAction["READ"] = "READ";
    DocumentAction["EDITED"] = "EDITED";
    DocumentAction["DELETED"] = "DELETED";
})(DocumentAction || (exports.DocumentAction = DocumentAction = {}));
const __ΩpythonAPI = ['pdfBinary', 'extract_and_embed_pdf', 'pythonAPI', 'PP!2!\'F`1"Mw#y'];
exports.__ΩpythonAPI = __ΩpythonAPI;
class PythonController {
    constructor(python) {
        this.python = python;
        this.generateVectors = (this.python.controller.Ω = [[() => __ΩpythonAPI, 'n!']], this.python.controller('generateVectors.py'));
    }
}
exports.PythonController = PythonController;
PythonController.__type = [() => pybridge_1.PyBridge, 'python', 'constructor', 'PythonController', 'PP7!2"<"0#5w$'];
