"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentStateNode = void 0;
/*@ts-ignore*/
const { __ΩDocumentLedger } = require("./utils");
/**
 * Calculates the eucldean distance between vectors
 * @param vector1 vector 1
 * @param vector2 vector 2
 * @returns
 */
function euclideanDistance(vector1, vector2) {
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
euclideanDistance.__type = ['vector1', 'vector2', 'euclideanDistance', 'P\'F2!\'F2"\'/#'];
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
            this.semanticChangeScore = 0;
        }
        else {
            //calculate the distance from the previous one and let that be the value for now 
            this.semanticChangeScore = euclideanDistance(previousNode.state.vector, this.state.vector);
        }
    }
}
exports.documentStateNode = documentStateNode;
documentStateNode.__type = [() => __ΩDocumentLedger, 'state', () => documentStateNode, 'previous', function () { return null; }, () => documentStateNode, 'next', function () { return null; }, 'semanticChangeScore', function () { return 0; }, () => __ΩDocumentLedger, 'constructor', 'hash', 'hashMatch', () => documentStateNode, 'nextNode', 'setNext', () => documentStateNode, 'previousNode', 'setPrevious', 'documentStateNode', 'n!3"PP7#,J3$>%PP7&,J3\'>(\'3)>*Pn+2""0,P&2-)0.PP7/20"01PP7223"045w5'];
