import { ObjectId } from "mongodb";

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