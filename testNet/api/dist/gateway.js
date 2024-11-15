"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newGrpcConnection = newGrpcConnection;
exports.newIdentity = newIdentity;
exports.newSigner = newSigner;
const constants_1 = require("./constants");
const grpc = __importStar(require("@grpc/grpc-js"));
const fs = __importStar(require("fs"));
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const crypto = __importStar(require("crypto"));
function newGrpcConnection() {
    const tlsRootCert = fs.readFileSync(constants_1.tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(constants_1.peerEndpoint, tlsCredentials, { 'grpc.ssl_target_name_override': constants_1.peerHostAlias, });
}
function newIdentity() {
    const credentials = fs.readFileSync(constants_1.certDirectoryPath);
    return { mspId: 'Org1MSP', credentials };
}
function newSigner() {
    const privateKeyPem = fs.readFileSync(constants_1.keyDirectoryPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
}
