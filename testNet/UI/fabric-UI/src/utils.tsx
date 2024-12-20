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
    vector: number[];
    
}


export enum DocumentAction {
    CREATED = "CREATED",
    READ = "READ",
    EDITED = "EDITED",
    DELETED = "DELETED"
  }
  