"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.highestAssetId = exports.hashingAlgo = exports.db = exports.contract = exports.network = exports.client = exports.gateway = void 0;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const gateway_1 = require("./gateway");
const constants_1 = require("./constants");
const documentInterface_1 = require("./documentInterface");
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
const fs = require('fs');
const crypto = require('crypto');
const express = require("express");
//configure multer to use in memory buffers 
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
exports.hashingAlgo = (0, crypto_1.createHash)('sha256');
function generatedNewID() {
    exports.highestAssetId = exports.highestAssetId + 1;
    return "doc" + exports.highestAssetId.toString();
}
//set the id back if the function fails 
function undoNewID() {
    exports.highestAssetId = exports.highestAssetId - 1;
}
var app = express();
//enable logging each request that turns up 
app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});
app.use(express.json());
/**
 * Healthcheck endpoint
 */
app.get("/healthcheck", (req, res) => {
    (0, documentInterface_1.ledgerHealthCheck)(exports.contract).then(value => {
        console.log("Result :", value);
        res.status(200).json({ Result: value });
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
app.post("/documents", upload.single('file'), (req, res) => {
    console.log("in /documents", req.file, req.body);
    if (!req.file) {
        console.error("NO FILE ATTACHED TO REQUEST");
        res.status(400).json({ Result: "error no file in request" });
        return;
    }
    //send file to data base 
    let document = {
        "documentID": generatedNewID(),
        "creatorID": req.body.creatorID,
        "documentName": req.file.originalname,
        "documentType": req.body.documentType,
        "signable": req.body.signable,
        "documentHash": (0, utils_1.calculateHash)(req.file.buffer),
        "file": req.file.buffer
    };
    console.log("saving file to db", document);
    exports.db.collection(constants_1.collectionName).insertOne(document).then((result) => {
        console.log("inserted obj id", result);
        //update the ledger now that the file has successfully been stored 
        (0, documentInterface_1.ledgerCreateDocument)(exports.contract, document.documentID, document.documentName, document.creatorID, document.documentHash, document.documentType, document.signable).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.error("error logging in ledger", err);
            res.status(500).json({ Error: err });
        });
    }).catch((err) => {
        console.error("error saving in database", err);
        res.status(500).json({ Error: err });
    });
});
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
    try {
        // Connect to MongoDB
        mongodb_1.MongoClient.connect(constants_1.MONGO_URL)
            .then((client) => {
            console.log('Connected to MongoDB');
            //only need the db as its extracted from the client 
            exports.db = client.db(constants_1.DATABASE_NAME);
        }).then(() => {
            //get the highest id 
            exports.db.collection(constants_1.collectionName).aggregate([
                {
                    // Step 1: Add a new field that extracts the numeric part from `documentID`
                    $addFields: {
                        numericPart: {
                            $toInt: {
                                $arrayElemAt: [
                                    {
                                        $regexFind: {
                                            input: "$documentID",
                                            regex: /(\d+)$/, // Match digits at the end of the string
                                        },
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                },
                {
                    // Step 2: Sort the documents in descending order based on the numeric part
                    $sort: { numericPart: -1 },
                },
                {
                    // Step 3: Limit the result to just one document (the one with the highest number)
                    $limit: 1,
                },
            ]).toArray().then((result) => {
                if (result.length > 0) {
                    exports.highestAssetId = result[0].numericPart;
                }
                else {
                    exports.highestAssetId = 0;
                }
                console.log("HighestId found", exports.highestAssetId);
            }).catch((error) => {
                console.error("error getting highest ID", error);
            });
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
        console.log('Failed to connect to MongoDB');
        process.exitCode = 1;
    }
}
