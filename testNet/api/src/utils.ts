
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
    lastInteractedWithID: String;
    lastAction: DocumentAction;
    vector: number[];
    
}//changes the data type of lastInteractedWithID check that didnt break anything

export enum DocumentAction {
  CREATED = "CREATED",
  READ = "READ",
  EDITED = "EDITED",
  DELETED = "DELETED"
}


export interface pythonAPI {
  extract_and_embed_pdf(pdfBinary: Buffer): Promise<number[]>;
}


export class PythonController {
  generateVectors = this.python.controller<pythonAPI>('generateVectors.py');
  constructor(protected python: PyBridge) {
  }
}

