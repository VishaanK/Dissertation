
import { Request } from 'express';
import { PyBridge } from 'pybridge';

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
    documentType: string;
    signable: boolean;
    lastInteractedWithID: DocumentAction;
    lastAction: string;
    
}

export enum DocumentAction {
  CREATED,
  READ,
  EDITED,
  DELETED
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


export interface pythonAPI {
  extract_and_embed_pdf(pdfBinary: Buffer): Promise<number[]>;
}


export class PythonController {
  generateVectors = this.python.controller<pythonAPI>('generateVectors.py');
  constructor(protected python: PyBridge) {
  }
}