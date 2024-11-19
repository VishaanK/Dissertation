import { ObjectId } from "mongodb";
import { Request } from 'express';
import { hashingAlgo, highestAssetId } from "./app";
const fs = require('fs')
export function generateAssetId():string{
    return "";
}

//database structure
//TODO CHANGE TO MATCH THE STRUCTURE I HAVE GIVEN THE DB
export interface DocumentDB {
    file: BinaryData, 
    creatorID: string,
    documentHash: string,
    documentID: string,
    documentName: string,
    documentType: string,
    signable: boolean

}

export interface DocumentLedger {
    creatorID: string;
    documentHash: string;
    documentID: string;
    documentName: string;
    documentType: string | null;
    signable: boolean;
}


// data type for sending requests to the server 
// has a file but no ID as that is created when the data is inserted
export interface createDocumentRequest extends Request {
    file: Express.Multer.File; // file data from multer
    body: {
      creatorID: string;
      documentHash: string;
      documentName: string;
      documentType: string;
      signable: boolean;
    };
  }

  /**
 * hashes a file in sync 
 * @param filePath to file to hash
 * @returns 
 */
export function calculateHash(file:Buffer) : string {
    try{
      const digest:string = hashingAlgo.update(file).digest('base64');
      return digest
    }catch(err){
      console.error('Error reading or hashing file:', err);
      return "";
    }
  }

