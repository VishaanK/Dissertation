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


export enum DocumentAction {
    CREATED = "CREATED",
    READ = "READ",
    EDITED = "EDITED",
    DELETED = "DELETED"
  }
  