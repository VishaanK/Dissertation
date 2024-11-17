"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highestAssetId = exports.contract = exports.network = exports.client = exports.gateway = void 0;
exports.getHighestAssetId = getHighestAssetId;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const gateway_1 = require("./gateway");
const constants_1 = require("./constants");
const documentInterface_1 = require("./documentInterface");
const crypto = require('crypto');
let express = require("express");
exports.highestAssetId = getHighestAssetId;
//connect to db, get highest asset ID 
function getHighestAssetId() {
}
var app = express();
//enable logging each request that turns up 
app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});
app.get("/healthcheck", (req, res) => {
    console.log("/healthcheck pinged ");
    (0, documentInterface_1.ledgerHealthCheck)(exports.contract).then(value => {
        console.log("Ledger Initid ... Init");
        res.json(value);
        res.sendStatus(200);
    }).catch((error) => {
        console.log("error %s", error);
        res.status(500).json({ error: error });
    });
});
/**
 * Fetch all documents
 */
app.get("/documents", (req, res) => {
    res.sendStatus(200);
});
/**
 * Fetch a specific document
 *
 */
app.get("/documents/:id", (req, res) => {
    const docID = req.query.id;
    console.log("Fetching doc %s", docID);
    res.sendStatus(200);
});
/**
 * Creating a document
 * Document to store and register is in the payload
 * hash the document
 * send the file to the db
 * log the file in the ledger
 */
// app.post("/documents", (req:Request, res:Response) => {
//   const docname = req.body.documentName;
//   const creatorID = req.body.creatorID;
//   const document = req.body.document;
//   const documentType = req.body.documentType;
//   const signable = req.body.signable;
//   const hashValue = await getHash('path/to/file');
//   ledgerCreateDocument(contract,docname,creatorID,)
//   res.sendStatus(200);
// });
/**Edit a document
 *
 */
app.put("/documents/:id", (req, res) => {
    res.sendStatus(200);
});
/**rename
 *
 */
app.put("/documents/rename/:id", (req, res) => {
    res.sendStatus(200);
});
/**
 * Deleting a document
 * :id is the id of the document
 */
app.delete("/documents/:id", (req, res) => {
    const docID = req.query.id;
    console.log("Deleting doc %s", docID);
    res.sendStatus(200);
});
//set the api server listening 
app.listen(3000, () => {
    setupAPI();
    console.log("Server running on port 3000");
});
/**
 * Establish connection to database and to fabric
 */
function setupAPI() {
    exports.client = (0, gateway_1.newGrpcConnection)();
    exports.gateway = (0, fabric_gateway_1.connect)({
        client: exports.client,
        identity: (0, gateway_1.newIdentity)(),
        signer: (0, gateway_1.newSigner)(),
        hash: fabric_gateway_1.hash.sha256,
        //timeout options
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });
    //connect 
    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        exports.network = exports.gateway.getNetwork(constants_1.channelName);
        // Get the smart contract from the network.
        exports.contract = exports.network.getContract(constants_1.chaincodeName);
        // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
    }
    catch (error) {
        console.error('FAILED TO CONNECT TO FABRIC GATEWAY', error);
        console.log('FAILED TO CONNECT TO FABRIC GATEWAY');
        process.exitCode = 1;
    }
    //connect to database 
}
