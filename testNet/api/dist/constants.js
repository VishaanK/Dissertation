"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8Decoder = exports.peerHostAlias = exports.peerEndpoint = exports.tlsCertPath = exports.certDirectoryPath = exports.keyDirectoryPath = exports.cryptoPath = exports.mspId = exports.chaincodeName = exports.channelName = void 0;
exports.envOrDefault = envOrDefault;
const path_1 = __importDefault(require("path"));
exports.channelName = envOrDefault('CHANNEL_NAME', 'channel1');
exports.chaincodeName = envOrDefault('CHAINCODE_NAME', 'document');
exports.mspId = envOrDefault('MSP_ID', 'Org1MSP');
// Path to crypto materials.
exports.cryptoPath = envOrDefault('CRYPTO_PATH', path_1.default.resolve(__dirname, 'organizations', 'peerOrganizations', 'org1.example.com'));
// Path to user private key directory.
exports.keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path_1.default.resolve(exports.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));
// Path to user certificate directory.
exports.certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path_1.default.resolve(exports.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));
// Path to peer TLS certificate.
exports.tlsCertPath = envOrDefault('TLS_CERT_PATH', path_1.default.resolve(exports.cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
// Gateway peer endpoint.
// gets the whole name because running in docker 
exports.peerEndpoint = envOrDefault('PEER_ENDPOINT', 'peer0.org1.example.com:7051');
// Gateway peer SSL host name override.
exports.peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}
//decoder
exports.utf8Decoder = new TextDecoder();
