import { DocumentLedger } from "./utils";

function euclideanDistance(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
        throw new Error('Vectors must be of the same length');
    }

    let sumOfSquares = 0;

    for (let i = 0; i < vector1.length; i++) {
        const diff = vector1[i] - vector2[i];
        sumOfSquares += diff * diff;
    }

    return Math.sqrt(sumOfSquares);
}


  
export class documentStateNode{
    public state : DocumentLedger;
    public previous : documentStateNode | null = null;
    public next : documentStateNode | null = null;
    semanticChangeScore : Number = 0;


    constructor(state:DocumentLedger){
        this.state = state;
    }

    public hashMatch(hash : string) :boolean{
        if(this.state.documentHash === hash){
            return true;
        }else{
            return false;
        }
    }

    //set the next node 
    public setNext(nextNode : documentStateNode){
        this.next = nextNode;
    }

    /**
     * set the nodes previous node
     * calculates the vector distance between this node and its previous 
     * score is -1 if the hashes are the same i.e no semantic change at all 
     * @param previousNode the previous node
     */
    public setPrevious(previousNode: documentStateNode){

        //edits may not effect the file in which case :               
        if( this.state.documentHash == previousNode.state.documentHash){
            //no change to the document 
            this.semanticChangeScore = 0;
        }else{
            //calculate the distance from the previous one and let that be the value for now 
            this.semanticChangeScore = euclideanDistance(previousNode.state.vector,this.state.vector);
        }
    }    
}


//search using 2 documents to search by the transition between the two states 


//use the vector embeddings to find a document 
//search by the latest state of each documents vector and take the shortest distance one to be a match 


