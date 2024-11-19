import path from "path";

export const channelName = envOrDefault('CHANNEL_NAME', 'channel1');
export const chaincodeName = envOrDefault('CHAINCODE_NAME', 'document');
export const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
export const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
export const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore','priv_sk'));

// Path to user certificate directory.
export const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts','User1@org1.example.com-cert.pem'));
// Path to peer TLS certificate.
export const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
// gets the whole name because running in docker 
export const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'peer0.org1.example.com:7051');

// Gateway peer SSL host name override.
export const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');


//mongo db constants from env variables in docker compose
export const MONGO_URL = envOrDefault('MONGO_URL','') ;
export const DATABASE_NAME = envOrDefault('DATABASE_NAME','');
export const collectionName : string ="documents";
/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
export function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

//decoder
export const utf8Decoder = new TextDecoder();
