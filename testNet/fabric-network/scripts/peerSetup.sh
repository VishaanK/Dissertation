#!/bin/bash

peers=("peer0.org1.example.com" "peer1.org1.example.com" "peer2.org1.example.com")
peerPorts=("9444" "9445" "9446")

export FABRIC_CFG_PATH=../config

# constant env variables 
export CORE_CHANNEL_ID=channel1
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ENABLED=true

export ADMIN_TLS_SIGN_CERT=../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/tls/client.crt
export ADMIN_TLS_PRIVATE_KEY=../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/tls/client.key
export CORE_PEER_MSPCONFIGPATH=../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

#tls certs for org 1 
export CORE_PEER_TLS_ROOTCERT_FILE=../organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem

# Iterate over the list of peers and their corresponding ports
for i in "${!peers[@]}"; do
    peer="${peers[$i]}"
    peerPort="${peerPorts[$i]}"
    
    echo "Performing operation on $peer with port $peerPort"

    # set peer specific env variables 
    export CORE_PEER_ADDRESS="localhost:$peerPort" 
    export CORE_PEER_ID=$peer
    export CORE_PEER_TLS_CERT_FILE=../organizations/peerOrganizations/org1.example.com/peers/$peer/tls/server.crt
    export CORE_PEER_TLS_KEY_FILE=../organizations/peerOrganizations/org1.example.com/peers/$peer/tls/server.key


    export CORE_PEER_TLS_CA_CERT_FILE=../organizations/peerOrganizations/org1.example.com/peers/$peer/tls/ca.crt
    
        # Join the peer to the channel
    ../bin/peer channel join -b ../channel-artifacts/genesis_block.pb -o localhost:$peerPort --tls --cafile $CORE_PEER_TLS_CA_CERT_FILE --certfile $ADMIN_TLS_SIGN_CERT --keyfile $ADMIN_TLS_PRIVATE_KEY
done