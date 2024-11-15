import { certDirectoryPath, keyDirectoryPath, peerEndpoint, peerHostAlias, tlsCertPath } from "./constants";
import * as grpc from '@grpc/grpc-js';
import * as fs from 'fs';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';


export function newGrpcConnection(): grpc.Client {
    
    const tlsRootCert = fs.readFileSync(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {'grpc.ssl_target_name_override': peerHostAlias,});
  }

export function newIdentity(): Identity {
    const credentials = fs.readFileSync(certDirectoryPath);
    return { mspId: 'Org1MSP', credentials };
}

export function newSigner(): Signer {
    const privateKeyPem = fs.readFileSync(keyDirectoryPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}
