import { ObjectId } from "mongodb";

export function generateAssetId():string{
    return "";
}
//database structure
export default class Document {
    constructor(public file: File, 
                public category: string, 
                public docID?: ObjectId
    ){}
}