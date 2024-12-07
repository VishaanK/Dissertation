import internal from "stream";
import { DocumentAction, DocumentLedger } from "./utils";
import e from "express";

export function cosineDistance(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same length");
    }
  
    // Calculate dot product (A . B)
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
  
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }
  
    // Calculate magnitudes
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
  
    // Compute cosine similarity
    const cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
  
    // Calculate cosine distance
    return 1 - cosineSimilarity;
  }

  
export class documentStateNode{
    public state : DocumentLedger;
    public previous : documentStateNode | null = null;
    public next : documentStateNode | null = null;
    semanticChangeScore : Number = 0;


    constructor(state:DocumentLedger){
        this.state = state;
        if( (this.state.lastAction ==  DocumentAction.CREATED )|| 
            this.state.lastAction == DocumentAction.READ ||
            this.state.lastAction == DocumentAction.DELETED
        ){
            this.semanticChangeScore = -1;
        }else{
            //edits may not effect the file in which case :               
            if( this.state.documentHash == this.previous?.state.documentHash){
                //no change to the document 
                this.semanticChangeScore = -1;
            }else{
                //calculate the distance from the previous one and let that be the value for now 
                this.semanticChangeScore = cosineDistance(this.state.vector,this.previous!.state.vector);
            }
      
        }
    }

    public hashMatch(hash : string) :boolean{
        if(this.state.documentHash === hash){
            return true;
        }else{
            return false;
        }
    }

}


 
//convert the data from the hashmap into a json object to pass to a front end 
//export function makeAuditJSON(Map:Map<string,documentStateNode[]>):JSON{
//    obj : JSON = new JSON
//
//}

