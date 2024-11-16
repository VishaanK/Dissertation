import { Contract } from "@hyperledger/fabric-gateway";
import { certDirectoryPath, chaincodeName, cryptoPath, keyDirectoryPath, mspId, peerEndpoint, peerHostAlias, tlsCertPath, utf8Decoder } from "./constants";
import { generateAssetId } from "./utils";
import { sign } from "crypto";

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
export async function initLedger(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}

/**
 * Evaluate a getAllDocuments transaction to query ledger state.
 * 
 */
export async function logGetAllDocuments(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: GetAllDocuments, function returns all the current documents on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllDocuments');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * create the document on the ledger
 */
export async function ledgerCreateDocument(contract: Contract,documentName:string, creatorID:string, documentHash:string, documentType:string, signable:boolean): Promise<void> {
    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with name : %s,creator : %s ,hash %s , type %s, signable %s', documentName, creatorID, documentHash, documentType, signable);

    await contract.submitTransaction(
        'CreateDocument',
        generateAssetId(),
        documentName,
        creatorID,
        documentHash,
        documentType,
        signable.toString(),
    );

    console.log('*** Transaction committed successfully');
}

/**
 * log that a document is beign read 
 * @param contract contract object 
 * @param docID document ID 
 */
export async function logReadDocument(contract: Contract,docID : string): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadDocument, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadDocument', docID);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * Update the document hash in the ledger
 * @param contract contract object
 * @param docID Id of doc to change 
 * @param newHash New hash of the document 
 */
export async function logUpdateDocumentHash(contract: Contract,docID : string,newHash : string): Promise<void> {
    console.log('\n--> Evaluate Transaction: UpdateDocumentHash, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.evaluateTransaction('UpdateDocumentHash', docID,newHash);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * log that a document is being renamed
 * @param contract conotract object
 * @param docID Document ID
 * @param newName New Name of document
 */
export async function logRenameDocument(contract: Contract,docID : string,newName : string): Promise<void> {
    console.log('\n--> Evaluate Transaction: UpdateDocumentName, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.evaluateTransaction('UpdateDocumentName', docID,newName);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * Update the signable statud of the document
 * @param contract 
 * @param docID 
 * @param signable 
 */
export async function logUpdateSignable(contract: Contract,docID : string,signable : boolean): Promise<void> {
    console.log('\n--> Evaluate Transaction: UpdateDocumentSignable, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.evaluateTransaction('UpdateDocumentSignable', docID,signable.toString());

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * Log a document is being deleted 
 * @param contract 
 * @param docID 
 */
export async function logDelete(contract: Contract,docID : string): Promise<void> {
    console.log('\n--> Evaluate Transaction: DeleteDocument, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.evaluateTransaction('DeleteDocument', docID);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * Read the documents in a given range of keys 
 * @param contract 
 * @param docID 
 * @param startKey 
 * @param endKey 
 */
export async function logReadInRange(contract: Contract,docID : string,startKey : string,endKey : string): Promise<void> {
    console.log('\n--> Evaluate Transaction: GetAllDocumentsInRange, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.evaluateTransaction('DeleteDocument', docID,startKey,endKey);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}
