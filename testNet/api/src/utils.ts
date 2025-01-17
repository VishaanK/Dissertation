
import { PyBridge } from 'pybridge';

//database structure
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
    
}

//enum of possible actions on a document
export enum DocumentAction {
  CREATED = "CREATED",
  READ = "READ",
  EDITED = "EDITED",
  DELETED = "DELETED"
}

//python controller
export interface pythonAPI {
  extract_and_embed_pdf(pdfBinary: Buffer): Promise<number[]>;
}


export class PythonController {
  generateVectors = this.python.controller<pythonAPI>('generateVectors.py');
  constructor(protected python: PyBridge) {
  }
}

