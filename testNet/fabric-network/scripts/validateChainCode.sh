
#!/bin/bash

peer="peer1.org1.example.com"
peerPort="7060"

export FABRIC_CFG_PATH=../config

export CORE_PEER_ADDRESS="localhost:$peerPort" 
export CORE_PEER_ID=$peer
export CORE_PEER_TLS_ROOTCERT_FILE=../organizations/peerOrganizations/org1.example.com/peers/$peer/tls/ca.crt
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_MSPCONFIGPATH=../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export ORDERER_GENERAL_TLS_ROOTCAS=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt


#check commit
../bin/peer lifecycle chaincode queryinstalled -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
  --tls --cafile $ORDERER_GENERAL_TLS_ROOTCAS --output json

../bin/peer lifecycle chaincode querycommitted -o localhost:7050 --ordererTLSHostnameOverride \
    orderer.example.com --channelID channel1 --tls --cafile "../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
