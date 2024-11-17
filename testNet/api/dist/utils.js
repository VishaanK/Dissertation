"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetId = generateAssetId;
function generateAssetId() {
    return "";
}
//database structure
class Document {
    constructor(file, category, docID) {
        this.file = file;
        this.category = category;
        this.docID = docID;
    }
}
exports.default = Document;
