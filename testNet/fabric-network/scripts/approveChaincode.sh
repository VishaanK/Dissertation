
#!/bin/bash

peer="peer0.org1.example.com"
peerPort="7051"

export FABRIC_CFG_PATH=../config

export CORE_PEER_ADDRESS="localhost:$peerPort" 
export CORE_PEER_ID=$peer
export CORE_PEER_TLS_ROOTCERT_FILE=../organizations/peerOrganizations/org1.example.com/peers/$peer/tls/ca.crt
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_MSPCONFIGPATH=../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export ORDERER_GENERAL_TLS_ROOTCAS=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt


# get the id of the chaincode

response=$(../bin/peer lifecycle chaincode queryinstalled 2>&1)

export CC_PACKAGE_ID=$(echo "$response" | sed -n 's/.*Package ID: \(documentcc1:[a-f0-9]*\),.*/\1/p')


#approve by the last peer for the entire org 
../bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --channelID channel1 --name document --version "1.0" --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_GENERAL_TLS_ROOTCAS

#check commit
../bin/peer lifecycle chaincode checkcommitreadiness -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --channelID channel1 --name document --version "1.0" --sequence 1 --tls --cafile $ $ORDERER_GENERAL_TLS_ROOTCAS --output json

#commit the chaincode to each peer on the channel
../bin/peer lifecycle chaincode commit -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --channelID channel1 --name document --version "1.0" \
    --sequence 1 --tls --cafile "../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
    --peerAddresses localhost:7051 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:7060 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:7057 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/ca.crt"