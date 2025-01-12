"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.contract = exports.network = exports.client = exports.gateway = void 0;
const __ΩError = ['name', 'message', 'stack', 'Error', 'P&4!&4"&4#8Mw$y'];
function __assignType(fn, args) {
    fn.__type = args;
    return fn;
}
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const gateway_1 = require("./gateway");
const constants_1 = require("./constants");
const documentInterface_1 = require("./documentInterface");
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
const pybridge_1 = require("pybridge");
const auditFunctionality_1 = require("./auditFunctionality");
const cors = require('cors');
const crypto = require('crypto');
const express = require("express");
//configure multer to use in memory buffers 
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
//python bridge 
const bridge = new pybridge_1.PyBridge({ python: 'python3', cwd: __dirname });
const controller = new utils_1.PythonController(bridge);
let auditMap = new Map();
let hashingAlgo = (0, crypto_1.createHash)('sha256');
let highestAssetId = 0;
function generatedNewID() {
    highestAssetId = highestAssetId + 1;
    return "doc" + highestAssetId.toString();
}
generatedNewID.__type = ['generatedNewID', 'P&/!'];
var app = express();
app.use(cors());
//enable logging each request that turns up 
app.use(__assignType((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
}, ['req', 'res', 'next', '', 'P!2!!2"!2#"/$']));
app.use(express.json());
/**
 * Healthcheck endpoint
 */
app.get("/healthcheck", __assignType((req, res) => {
    console.log("/healthcheck");
    (0, documentInterface_1.ledgerHealthCheck)(exports.contract).then(__assignType(value => {
        console.log("Result :", value);
        res.status(200).json({ "Result": value });
    }, ['value', '', 'P"2!"/"'])).catch(__assignType((error) => {
        console.log("error %s", error);
        res.status(500).json({ "Error": error });
    }, [() => __ΩError, 'error', '', 'Pn!2""/#']));
}, ['req', 'res', '', 'P!2!!2""/#']));
/**
 * Fetch all document states from ledger
 */
app.post("/documents/ledger", __assignType((req, res) => {
    console.log("/documents/ledger");
    (0, documentInterface_1.ledgerGetAllDocuments)(exports.contract, req.body.userID).then(__assignType(value => {
        res.status(200).json({ "Result": value });
    }, ['value', '', 'P"2!"/"'])).catch(__assignType((err) => {
        console.log("error %s", err);
        res.status(500).json({ "Error": err });
    }, [() => __ΩError, 'err', '', 'Pn!2""/#']));
}, ['req', 'res', '', 'P!2!!2""/#']));
/**
 * Fetch a specific documents info from ledger
 * also fetches the file from the database
 *
 */
app.post("/documents/read", __assignType((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/documents/read");
    if (!req.body.documentID || !req.body.userID) {
        res.status(400).json({ "ERROR": "No documentID or USER ID" });
        return;
    }
    //confirm the id exists 
    //check the entered id is in the database 
    let dbEntry = yield exports.db.collection(constants_1.collectionName).findOne({ documentID: req.body.documentID });
    if (!dbEntry) {
        res.status(404).json({ "Result": "No entry in the database" });
        return;
    }
    //check the id exists in the ledger
    let checkLedgerEntryExists = yield (0, documentInterface_1.ledgerReadDocument)(exports.contract, req.body.documentID, req.body.userID);
    if (!checkLedgerEntryExists) {
        res.status(404).json({ "Result": "No id found in ledger" });
        return;
    }
    (0, documentInterface_1.ledgerReadDocument)(exports.contract, req.body.documentID, req.body.userID).then(__assignType((ledgerResult) => {
        //fetch from database 
        exports.db.collection(constants_1.collectionName).findOne({ "documentID": req.body.documentID }).then(__assignType((result) => {
            console.log("Read document", result);
            // Include the raw file data as a Base64 string in the response
            const encodedFile = dbEntry.file.toString('base64'); // Encode binary to Base64
            res.status(200).json({ "LedgerData": ledgerResult, "fileData": encodedFile });
        }, ['result', '', 'P"2!"/"'])).catch(__assignType((err) => {
            console.log("error fetching file from database", err);
            res.status(404).json({ "Error": err });
        }, [() => __ΩError, 'err', '', 'Pn!2""/#']));
    }, ['ledgerResult', '', 'P"2!"/"'])).catch(__assignType((err) => {
        console.log("error reading file", err);
        res.status(404).json({ "Error": err });
    }, [() => __ΩError, 'err', '', 'Pn!2""/#']));
}), ['req', 'res', '', 'P!2!!2""/#']));
/**
 * Creating a document
 * Document to store and register is in the payload
 * hash the document
 * send the file to the db
 * log the file in the ledger
 */
app.post("/documents", upload.single('file'), __assignType((req, res) => {
    console.log("/documents");
    if (!req.file) {
        console.error("NO FILE ATTACHED TO REQUEST - /documents");
        res.status(400).json({ "Result": "error no file in request" });
        return;
    }
    //send file to data base 
    let document = {
        "documentID": generatedNewID(),
        "creatorID": req.body.creatorID,
        "documentName": req.file.originalname,
        "documentType": req.body.documentType,
        "signable": req.body.signable,
        "documentHash": calculateHash(req.file.buffer),
        "file": req.file.buffer
    };
    //check that nothing with the same name or hash already exists 
    (0, documentInterface_1.ledgerCheckDuplicate)(exports.contract, document.documentName, document.documentHash).then(__assignType((result) => {
        if (result == true) {
            console.log("saving file to db", document);
            exports.db.collection(constants_1.collectionName).insertOne(document).then(__assignType((result) => {
                console.log("inserted obj id", result);
                controller.generateVectors.extract_and_embed_pdf(req.file.buffer).then(__assignType((result) => {
                    //update the ledger now that the file has successfully been stored 
                    (0, documentInterface_1.ledgerCreateDocument)(exports.contract, document.documentID, document.documentName, document.creatorID, document.documentHash, document.documentType, document.signable, result).then(() => {
                        res.sendStatus(200);
                    }).catch(__assignType((err) => {
                        console.error("error logging in ledger", err);
                        res.status(500).json({ "Error": err });
                    }, ['err', '', 'P"2!"/"']));
                }, ['result', '', 'P\'F2!"/"'])).catch(__assignType((err) => {
                    console.error("error generating embedding", err);
                    res.status(500).json({ "Error": err });
                }, ['err', '', 'P"2!"/"']));
            }, ['result', '', 'P"2!"/"'])).catch(__assignType((err) => {
                console.error("error saving in database", err);
                res.status(500).json({ "Error": err });
            }, ['err', '', 'P"2!"/"']));
        }
        else {
            res.status(404).json({ "Error": "THIS DOCUMENT NAME OR HASH ALREADY EXISTS" });
        }
    }, ['result', '', 'P"2!"/"'])).catch(__assignType((err) => {
        res.status(500).json({ "Error": err });
    }, ['err', '', 'P"2!"/"']));
}, ['req', 'res', '', 'P!2!!2""/#']));
/**Edit a document or its properties
 * need to reupload the document to recalculate the hash
 */
app.post("/documents/:documentid", upload.single('file'), __assignType((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/documents/:documentid");
    if (!req.file) {
        console.error("NO FILE ATTACHED TO REQUEST - /documents/:documentid");
        res.status(400).json({ "Result": "error no file in request" });
        return;
    }
    if (!req.body.userID) {
        console.error("NO USER ID - /documents/:documentid");
        res.status(400).json({ "Result": "NO USER ID" });
        return;
    }
    //check the entered id is in the database 
    let dbEntry = yield exports.db.collection(constants_1.collectionName).findOne({ documentID: req.params.documentid });
    if (!dbEntry) {
        res.status(404).json({ "Result": "No entry in the database" });
        return;
    }
    //check the id exists in the ledger
    let checkLedgerEntryExists = yield (0, documentInterface_1.ledgerReadDocument)(exports.contract, req.params.documentid, req.body.userID);
    if (!checkLedgerEntryExists) {
        res.status(404).json({ "Result": "No id found in ledger" });
        return;
    }
    //send file to data base 
    let document = {
        "documentID": req.params.documentid,
        "creatorID": dbEntry.creatorID, //not allowed to update the creator id 
        "documentName": req.file.originalname, //name always pulled from the file itself 
        "documentType": req.body.documentType || dbEntry.documentType,
        "signable": req.body.signable || dbEntry.signable,
        "documentHash": calculateHash(req.file.buffer),
        "file": req.file.buffer
    };
    // Update the hash of the file in the ledger and database
    exports.db.collection(constants_1.collectionName).updateOne({ documentID: req.params.documentid }, { $set: document })
        .then(() => {
        // Check if the document hash needs updating in the ledger
        if (document.documentHash !== checkLedgerEntryExists.documentID) {
            controller.generateVectors.extract_and_embed_pdf(req.file.buffer).then(__assignType((result) => {
                return (0, documentInterface_1.ledgerUpdateDocumentHash)(exports.contract, req.params.documentid, document.documentHash, req.body.userID, result);
            }, ['result', '', 'P\'F2!"/"']));
        }
    })
        .then(() => {
        // Check if the signable flag has changed
        if (req.body.signable) {
            if (req.body.signable !== dbEntry.signable) {
                return (0, documentInterface_1.ledgerUpdateSignable)(exports.contract, req.params.documentid, req.body.signable, req.body.userID);
            }
        }
    })
        .then(() => {
        // Check if the name has changed
        if (req.file.originalname !== checkLedgerEntryExists.documentName) {
            return (0, documentInterface_1.ledgerRenameDocument)(exports.contract, req.params.documentid, req.file.originalname, req.body.userID);
        }
    })
        .then(() => {
        // Send the 200 response after all updates are successful
        res.status(200).json({ "Result": "Updates made" });
    })
        .catch(__assignType((err) => {
        // Handle any errors from any of the promises
        res.status(500).json({ "Error": err.message || "An error occurred during the update process" });
    }, ['err', '', 'P"2!"/"']));
}), ['req', 'res', '', 'P!2!!2""/#']));
/**
 * Deleting a document
 * id and user id provided in body
 */
app.delete("/documents", __assignType((req, res) => {
    console.log("/documents");
    if (!req.body || !req.body.documentID || !req.body.userID) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    (0, documentInterface_1.ledgerDelete)(exports.contract, req.body.documentID, req.body.userID).then(() => {
        res.status(200).json({ "DeleteStatus": "Successful" });
    }).catch(__assignType((err) => {
        console.log("error", err);
        res.status(500).json({ "Error deleting document": err.message, "DocID": req.params.id });
    }, [() => __ΩError, 'err', '', 'Pn!2""/#']));
}, ['req', 'res', '', 'P!2!!2""/#']));
//verifies the document by checking the hash 
app.post("/documents/verify", upload.single('file'), __assignType((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/documents/verify");
    if (!req.file) {
        console.error("NO FILE ATTACHED TO REQUEST - /documents/verify");
        res.status(400).json({ "Result": "error no file in request" });
        return;
    }
    if (!req.body.documentID) {
        console.error("NO USER ID - /documents/verify ");
        res.status(400).json({ "Result": "NO USER ID" });
        return;
    }
    const documentHash = calculateHash(req.file.buffer);
    (0, documentInterface_1.ledgerVerifyDocument)(exports.contract, req.body.documentID, documentHash).then(__assignType((result) => {
        console.log("the result of the integrity check is ", result);
        if (result == true) {
            res.status(200).json({ "LedgerVerify": "Successful" });
        }
        else {
            res.status(200).json({ "LedgerVerify": "Unsuccessful" });
        }
    }, ['result', '', 'P"2!"/"'])).catch(__assignType((err) => {
        console.log("error", err);
        res.status(500).json({ "Error verifying document": err.message, "DocID": req.params.id });
    }, [() => __ΩError, 'err', '', 'Pn!2""/#']));
}), ['req', 'res', '', 'P!2!!2""/#']));
/**
 * get the transaction history of a particular key
 */
app.get("/documents/history/:documentid", __assignType((req, res) => {
    console.log("/documents/history/:documentid");
    if (!req.params.documentid) {
        res.status(400).json({ "Error no documentid provided": "no id" });
    }
    (0, documentInterface_1.ledgerRetrieveHistory)(exports.contract, req.params.documentid).then(__assignType((result) => {
        res.status(200).json({ "History": result });
    }, ['result', '', 'P"2!"/"'])).catch(__assignType((err) => {
        console.log(err);
        res.status(500).json({ "Error": err.message });
    }, [() => __ΩError, 'err', '', 'Pn!2""/#']));
}, ['req', 'res', '', 'P!2!!2""/#']));
/**
 * sets up the audit history object
 */
app.get("/documents/audit/setup", __assignType((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/documents/audit/setup");
    //get all the document ids from the database 
    const documents = yield (0, documentInterface_1.ledgerGetAllDocuments)(exports.contract, "audit");
    let histories = new Map;
    for (let i = 0; i < documents.length; i++) {
        histories.set(documents[i].documentID, yield (0, documentInterface_1.ledgerRetrieveHistory)(exports.contract, documents[i].documentID));
    }
    //read the histories into the datastructures 
    //for each history iterate from the end to the start and read them into the audit blocks 
    for (let [key, value] of histories) {
        console.log(`Key: ${key}`);
        //iterate from the end of the value to the start 
        //add the create operations to the correspondng entries in the audit map 
        for (let j = value.length - 1; j >= 0; j--) {
            //create a node
            let node = new auditFunctionality_1.documentStateNode(value[j]);
            //add to the audit hashmap if it is a created event
            if (value[j].lastAction == utils_1.DocumentAction.CREATED) {
                console.log("Creation event for ", value[j].documentID);
                auditMap.set(value[j].documentID, node);
            }
            else {
                //add to the appropriate chain of events
                //go along the events till you read a node where next is null 
                //get the start node
                //iterate to the end 
                let docBlock = auditMap.get(value[j].documentID);
                if (!docBlock) {
                    console.log("THE DOCUMENT DOESNT EXIST AUDIT BUILDER FAILED");
                    return;
                }
                let end = false;
                while (end == false) {
                    if (docBlock.next == null) {
                        docBlock.setNext(node);
                        node.setPrevious(docBlock);
                        end = true;
                    }
                    else {
                        docBlock = docBlock === null || docBlock === void 0 ? void 0 : docBlock.next;
                    }
                }
            }
        }
    }
    res.status(200).json({ "RESULT": "SUCCESS" });
}), ['req', 'res', '', 'P!2!!2""/#']));
/**
 * fetches the audit history with the semantic change scores
 */
app.get("/documents/audit", __assignType((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/documents/audit");
    try {
        // Declare result as an object with the desired structure
        const result = {};
        // Iterate over the audit map
        for (let [key, value] of auditMap) {
            // Create a new list for the current document
            const items = [];
            let current = value;
            // Traverse the linked list
            while (current != null) {
                items.push({
                    "STATE": current.state,
                    "CHANGE_SCORE": current.semanticChangeScore
                });
                current = current.next;
            }
            // Assign the list to the result object
            result[key] = items;
        }
        // Send the result as a JSON response
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching audit history:", error);
        res.status(500).send("Internal Server Error");
    }
}), ['req', 'res', '', 'P!2!!2""/#']));
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
            .then(__assignType((client) => {
            console.log('Connected to MongoDB');
            //only need the db as its extracted from the client 
            exports.db = client.db(constants_1.DATABASE_NAME);
        }, ['client', '', 'P"2!"/"'])).then(() => {
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
            ]).toArray().then(__assignType((result) => {
                if (result.length > 0) {
                    highestAssetId = result[0].numericPart;
                }
                else {
                    highestAssetId = 0;
                }
                console.log("HighestId found", highestAssetId);
            }, ['result', '', 'P"2!"/"'])).catch(__assignType((error) => {
                console.error("error getting highest ID", error);
            }, ['error', '', 'P"2!"/"']));
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
        console.log('Failed to connect to MongoDB');
        process.exitCode = 1;
    }
}
setupAPI.__type = ['setupAPI', 'P"/!'];
/**
* hashes a file in sync
* @param filePath to file to hash
* @returns
*/
function calculateHash(file) {
    try {
        const digest = hashingAlgo.update(file).digest('base64');
        //reset the object 
        hashingAlgo = crypto.createHash('sha256');
        return digest;
    }
    catch (err) {
        console.error('Error reading or hashing file:', err);
        return "";
    }
}
calculateHash.__type = ['file', 'calculateHash', 'P!2!&/"'];
