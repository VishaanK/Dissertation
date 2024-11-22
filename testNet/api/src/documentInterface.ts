import { Contract } from "@hyperledger/fabric-gateway";
import { utf8Decoder } from "./constants";
import { DocumentLedger} from "./utils";



/**
 * Healthcheck function tried to fetch all documents on the ledger 
 */
export async function ledgerHealthCheck(contract: Contract): Promise<DocumentLedger[]> {
    console.log('\n--> Submit Transaction: GetAllDocuments, retrieve all on ledger to check gateway is functioning');

    const resultBytes = await contract.evaluateTransaction('GetAllDocuments');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: DocumentLedger[] = JSON.parse(resultJson);
    return result;
}

/**
 * Healthcheck function tried to fetch all documents on the ledger 
 */
export async function initLedger(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: initLedger, retrieve all on ledger to check gateway is functioning');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}


/**
 * Evaluate a getAllDocuments transaction to query ledger state.
 * 
 */
export async function ledgerGetAllDocuments(contract: Contract): Promise< DocumentLedger[]> {
    console.log('\n--> Evaluate Transaction: GetAllDocuments, function returns all the current documents on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllDocuments');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result:  DocumentLedger[] = JSON.parse(resultJson);
    return result;
}

/**
 * create the document on the ledger
 */
export async function ledgerCreateDocument(contract: Contract,documentID:string,documentName:string, creatorID:string, documentHash:string, documentType:string, signable:boolean): Promise<void> {
    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with name : %s,creator : %s ,hash %s , type %s, signable %s', documentName, creatorID, documentHash, documentType, signable);

    await contract.submitTransaction(
        'CreateDocument',
        documentID,
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
export async function ledgerReadDocument(contract: Contract,docID : string): Promise<DocumentLedger> {
    console.log('\n--> Evaluate Transaction: ReadDocument, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadDocument', docID);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: DocumentLedger = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
    
}

/**
 * Update the document hash in the ledger
 * @param contract contract object
 * @param docID Id of doc to change 
 * @param newHash New hash of the document 
 */
export async function ledgerUpdateDocumentHash(contract: Contract,docID : string,newHash : string): Promise<DocumentLedger> {
    console.log('\n--> Evaluate Transaction: UpdateDocumentHash, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.submitTransaction('UpdateDocumentHash', docID,newHash);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: DocumentLedger = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;

}

/**
 * log that a document is being renamed
 * @param contract conotract object
 * @param docID Document ID
 * @param newName New Name of document
 */
export async function ledgerRenameDocument(contract: Contract,docID : string,newName : string): Promise<DocumentLedger> {
    console.log('\n--> Evaluate Transaction: UpdateDocumentName, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.submitTransaction('UpdateDocumentName', docID,newName);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: DocumentLedger = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}

/**
 * Update the signable statud of the document
 * @param contract 
 * @param docID 
 * @param signable 
 */
export async function ledgerUpdateSignable(contract: Contract,docID : string,signable : boolean): Promise<DocumentLedger> {
    console.log('\n--> Evaluate Transaction: UpdateDocumentSignable, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.submitTransaction('UpdateDocumentSignable', docID,signable.toString());

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: DocumentLedger = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}

/**
 * Log a document is being deleted 
 * @param contract 
 * @param docID 
 */
export async function ledgerDelete(contract: Contract,docID : string): Promise<void> {
    console.log('\n--> Evaluate Transaction: DeleteDocument,deletes document');

    const resultBytes = await contract.submitTransaction('DeleteDocument', docID);

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
export async function logReadInRange(contract: Contract,docID : string,startKey : string,endKey : string): Promise<DocumentLedger[]> {
    console.log('\n--> Evaluate Transaction: GetAllDocumentsInRange, updates the hash to a new value to factor in changes');

    const resultBytes = await contract.evaluateTransaction('DeleteDocument', docID,startKey,endKey);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: DocumentLedger[] = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}
