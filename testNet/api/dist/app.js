"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highestAssetId = exports.contract = exports.network = exports.client = exports.gateway = void 0;
exports.getHighestAssetId = getHighestAssetId;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const gateway_1 = require("./gateway");
const constants_1 = require("./constants");
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
    res.sendStatus(200);
});
/**
 * Fetch all documents
 */
app.get("/documents", (req, res) => {
    res.sendStatus(200);
});
app.get("/healthcheck", (req, res) => {
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
    });
    //connect 
    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        exports.network = exports.gateway.getNetwork(constants_1.channelName);
        // Get the smart contract from the network.
        exports.contract = exports.network.getContract(constants_1.chaincodeName);
    }
    catch (error) {
        console.error('FAILED TO CONNECT TO FABRIC GATEWAY', error);
        console.log('FAILED TO CONNECT TO FABRIC GATEWAY');
        process.exitCode = 1;
    }
    //connect to database 
}
