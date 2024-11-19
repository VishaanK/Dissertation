import { ObjectId } from "mongodb";
import { Request } from 'express';

export function generateAssetId():string{
    return "";
}
//database structure
export default class DocumentDB {
    constructor(public file: File, 
                public category: string, 
                public docID?: ObjectId
    ){}
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