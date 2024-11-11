#!/bin/bash

CORE_PEER_MSPCONFIGPATH=/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=localhost:7051
CORE_PEER_TLS_ROOTCERT_FILE=/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
CORE_PEER_TLS_ENABLED=true


CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_ID=peer0.org1.example.com

export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/admin/tls/peer.crt
export CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/admin/tls/peer.key
export CORE_PEER_TLS_CA_CERT_FILE=/etc/hyperledger/admin/tls/ca.org1.example.com-cert.pem

export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/admin/msp

export CORE_CHANNEL_ID=channel1

