# Fabric Network
This directory contains the base structure for a Hyperledger Fabric network.

## REMEMBER THE ADDRESS HAS MOVED INTO  Diss/Dissertation
## Packaging chaincode -> run this in the config folder so the command has access to core.yaml
../bin/peer lifecycle chaincode package documentcc.tar.gz --path /home/vish/actualDiss/Dissertation/testNet/fabric-network/chaincode/documentChaincode/app --lang java --label documentcc1

# Note EXPORT HE FABRIC_CFC_PATH directory like so before running the peer command 
export FABRIC_CFG_PATH=/home/vish/Diss/Dissertation/testNet/fabric-network/config

## installing chaincode 
peer lifecycle chaincode install /etc/hyperledger/fabric/chaincode/documentcc.tar.gz

## approve the chaincode 
peer lifecycle chaincode queryinstalled

## take the returned package id and export : 
export CC_PACKAGE_ID= {ID}

## approve the chaincode 
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID channel1 --name document --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA_FILE



"${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# THE ABOVE PROCESS ONLY NEEDS TO HAPPEN FOR A MAJORITY OF THE ORGANISATIONS , IN THIS CASE THEREFORE JUST NEEDS TO BE DONE ONCE 


### check that the chaincode has been approved 
 peer lifecycle chaincode checkcommitreadiness --channelID channel1 --name document --version 1.0 --sequence 1 --tls --cafile $ORDERER_CA_FILE --output json
 
 "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" 


## set the msp to admin : 
CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/org1.example.com/peers/peer0.org1.example.com/msp
## command for peers to join the channel 
peer channel join -b /etc/hyperledger/fabric/genesisblocks/genesis_block.pb --cafile /etc/hyperledger/admin/msp/cacerts/ca.org1.example.com-cert.pem
testNet/fabric-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/cacerts/ca.org1.example.com-cert.pem

## command fo the orderer to start the channel
        osnadmin channel join --channelID channel1 --config-block /etc/hyperledger/fabric/genesisblocks/genesis_block.pb -o orderer.example.com:7053 --ca-file $OSN_TLS_CA_ROOT_CERT --client-cert $ADMIN_TLS_SIGN_CERT --client-key $ADMIN_TLS_PRIVATE_KEY || echo "Command failed"

