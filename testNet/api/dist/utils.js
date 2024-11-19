"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetId = generateAssetId;
function generateAssetId() {
    return "";
}
//database structure
//TODO CHANGE TO MATCH THE STRUCTURE I HAVE GIVEN THE DB
class DocumentDB {
    constructor(file, category, docID) {
        this.file = file;
        this.category = category;
        this.docID = docID;
    }
}
exports.default = DocumentDB;
