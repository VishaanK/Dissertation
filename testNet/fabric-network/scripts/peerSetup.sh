#!/bin/bash

peers=("peer0.org1.example.com" "peer1.org1.example.com" "peer2.org1.example.com")
peerPorts=("7051" "7060" "7057")

export FABRIC_CFG_PATH=../config

# constant env variables 
export CORE_PEER_TLS_ENABLED=true

export CORE_PEER_MSPCONFIGPATH=../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export ORDERER_GENERAL_TLS_ROOTCAS=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt

# Iterate over the list of peers and their corresponding ports
for i in "${!peers[@]}"; do
    peer="${peers[$i]}"
    peerPort="${peerPorts[$i]}"
    
    echo "Performing operation on $peer with port $peerPort"

    # set peer specific env variables 
    export CORE_PEER_ADDRESS="localhost:$peerPort" 
    export CORE_PEER_ID=$peer
    export CORE_PEER_TLS_ROOTCERT_FILE=../organizations/peerOrganizations/org1.example.com/peers/$peer/tls/ca.crt


    #join the channel 
    ../bin/peer channel join -b ../channel-artifacts/genesis_block.pb -o localhost:7050
    
    #install the chaincode 
    response=$(../bin/peer lifecycle chaincode install ../chaincode/documentcc.tar.gz 2>&1)


    export CC_PACKAGE_ID=$(echo "$response" | sed -n 's/.*\(documentcc1:[a-f0-9]*\).*/\1/p')

    # Check if CC_PACKAGE_ID was extracted correctly
    if [[ -z "$CC_PACKAGE_ID" ]]; then
        echo "Error: Could not extract CC_PACKAGE_ID"
    else
        echo "Captured CC_PACKAGE_ID: $CC_PACKAGE_ID"
    fi

    #verify chaincode is installed 
    ../bin/peer lifecycle chaincode queryinstalled
done



