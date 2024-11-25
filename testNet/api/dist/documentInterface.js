"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerHealthCheck = ledgerHealthCheck;
exports.initLedger = initLedger;
exports.ledgerGetAllDocuments = ledgerGetAllDocuments;
exports.ledgerCreateDocument = ledgerCreateDocument;
exports.ledgerReadDocument = ledgerReadDocument;
exports.ledgerUpdateDocumentHash = ledgerUpdateDocumentHash;
exports.ledgerRenameDocument = ledgerRenameDocument;
exports.ledgerUpdateSignable = ledgerUpdateSignable;
exports.ledgerDelete = ledgerDelete;
exports.logReadInRange = logReadInRange;
const constants_1 = require("./constants");
/**
 * Healthcheck function tried to fetch all documents on the ledger
 */
function ledgerHealthCheck(contract) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Submit Transaction: GetAllDocuments, retrieve all on ledger to check gateway is functioning');
        const resultBytes = yield contract.submitTransaction('GetAllDocuments', "healthCheckID");
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        return result;
    });
}
/**
 * Healthcheck function tried to fetch all documents on the ledger
 */
function initLedger(contract) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Submit Transaction: initLedger, retrieve all on ledger to check gateway is functioning');
        yield contract.submitTransaction('InitLedger');
        console.log('*** Transaction committed successfully');
    });
}
/**
 * Evaluate a getAllDocuments transaction to query ledger state.
 *
 */
function ledgerGetAllDocuments(contract, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Evaluate Transaction: GetAllDocuments, function returns all the current documents on the ledger');
        const resultBytes = yield contract.submitTransaction('GetAllDocuments', userID);
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        return result;
    });
}
/**
 * create the document on the ledger
 */
function ledgerCreateDocument(contract, documentID, documentName, creatorID, documentHash, documentType, signable) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Submit Transaction: CreateAsset, creates new asset with name : %s,creator : %s ,hash %s , type %s, signable %s', documentName, creatorID, documentHash, documentType, signable);
        yield contract.submitTransaction('CreateDocument', documentID, documentName, creatorID, documentHash, documentType, signable.toString());
        console.log('*** Transaction committed successfully');
    });
}
/**
 * log that a document is beign read
 * @param contract contract object
 * @param docID document ID
 */
function ledgerReadDocument(contract, docID, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Evaluate Transaction: ReadDocument, function returns asset attributes');
        const resultBytes = yield contract.submitTransaction('ReadDocument', docID, userID);
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('*** Result:', result);
        return result;
    });
}
/**
 * Update the document hash in the ledger
 * @param contract contract object
 * @param docID Id of doc to change
 * @param newHash New hash of the document
 */
function ledgerUpdateDocumentHash(contract, docID, newHash, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Evaluate Transaction: UpdateDocumentHash, updates the hash to a new value to factor in changes');
        const resultBytes = yield contract.submitTransaction('UpdateDocumentHash', docID, newHash, userID);
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('*** Result:', result);
        return result;
    });
}
/**
 * log that a document is being renamed
 * @param contract conotract object
 * @param docID Document ID
 * @param newName New Name of document
 */
function ledgerRenameDocument(contract, docID, newName, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Evaluate Transaction: UpdateDocumentName, updates the hash to a new value to factor in changes');
        const resultBytes = yield contract.submitTransaction('UpdateDocumentName', docID, newName, userID);
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('*** Result:', result);
        return result;
    });
}
/**
 * Update the signable statud of the document
 * @param contract
 * @param docID
 * @param signable
 */
function ledgerUpdateSignable(contract, docID, signable, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Evaluate Transaction: UpdateDocumentSignable, updates the hash to a new value to factor in changes');
        const resultBytes = yield contract.submitTransaction('UpdateDocumentSignable', docID, signable.toString(), userID);
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('*** Result:', result);
        return result;
    });
}
/**
 * Log a document is being deleted
 * @param contract
 * @param docID
 */
function ledgerDelete(contract, docID, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Evaluate Transaction: DeleteDocument,deletes document');
        const resultBytes = yield contract.submitTransaction('DeleteDocument', docID, userID);
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('*** Result:', result);
    });
}
/**
 * Read the documents in a given range of keys
 * @param contract
 * @param docID
 * @param startKey
 * @param endKey
 */
function logReadInRange(contract, docID, startKey, endKey, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n--> Evaluate Transaction: GetAllDocumentsInRange, updates the hash to a new value to factor in changes');
        const resultBytes = yield contract.submitTransaction('DeleteDocument', docID, startKey, endKey, userID);
        const resultJson = constants_1.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('*** Result:', result);
        return result;
    });
}
