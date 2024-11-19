"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetId = generateAssetId;
exports.calculateHash = calculateHash;
const app_1 = require("./app");
const fs = require('fs');
function generateAssetId() {
    return "";
}
/**
* hashes a file in sync
* @param filePath to file to hash
* @returns
*/
function calculateHash(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const digest = app_1.hashingAlgo.update(fileBuffer).digest('base64');
        return digest;
    }
    catch (err) {
        console.error('Error reading or hashing file:', err);
        return "";
    }
}
