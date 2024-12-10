"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentStateNode = void 0;
exports.cosineDistance = cosineDistance;
/*@ts-ignore*/
const { __ΩDocumentLedger } = require("./utils");
function cosineDistance(vecA, vecB) {
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
cosineDistance.__type = ['vecA', 'vecB', 'cosineDistance', 'P\'F2!\'F2"\'/#'];
class documentStateNode {
    constructor(state) {
        this.previous = null;
        this.next = null;
        this.semanticChangeScore = 0;
        this.state = state;
    }
    hashMatch(hash) {
        if (this.state.documentHash === hash) {
            return true;
        }
        else {
            return false;
        }
    }
    //set the next node 
    setNext(nextNode) {
        this.next = nextNode;
    }
    /**
     * set the nodes previous node
     * calculates the vector distance between this node and its previous
     * score is -1 if the hashes are the same i.e no semantic change at all
     * @param previousNode the previous node
     */
    setPrevious(previousNode) {
        //edits may not effect the file in which case :               
        if (this.state.documentHash == previousNode.state.documentHash) {
            //no change to the document 
            this.semanticChangeScore = -1;
        }
        else {
            //calculate the distance from the previous one and let that be the value for now 
            this.semanticChangeScore = cosineDistance(previousNode.state.vector, this.state.vector);
        }
    }
}
exports.documentStateNode = documentStateNode;
documentStateNode.__type = [() => __ΩDocumentLedger, 'state', () => documentStateNode, 'previous', function () { return null; }, () => documentStateNode, 'next', function () { return null; }, 'semanticChangeScore', function () { return 0; }, () => __ΩDocumentLedger, 'constructor', 'hash', 'hashMatch', () => documentStateNode, 'nextNode', 'setNext', () => documentStateNode, 'previousNode', 'setPrevious', 'documentStateNode', 'n!3"PP7#,J3$>%PP7&,J3\'>(\'3)>*Pn+2""0,P&2-)0.PP7/20"01PP7223"045w5'];
