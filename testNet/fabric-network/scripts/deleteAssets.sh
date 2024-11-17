
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

echo "deleting the assets creating while initialising"

../bin/peer chaincode invoke --ctor '{"Function":"DeleteDocument", "Args":["doc1"]}' -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --channelID channel1 --name document \
    --peerAddresses localhost:7051 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:7060 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:7057 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/ca.crt" \
    --tls --cafile $ORDERER_GENERAL_TLS_ROOTCAS

sleep 1.5

../bin/peer chaincode invoke --ctor '{"Function":"DeleteDocument", "Args":["doc2"]}' -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --channelID channel1 --name document \
    --peerAddresses localhost:7051 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:7060 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:7057 --tlsRootCertFiles "../organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/ca.crt" \
    --tls --cafile $ORDERER_GENERAL_TLS_ROOTCAS
