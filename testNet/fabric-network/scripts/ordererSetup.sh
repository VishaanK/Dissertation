#!/bin/bash

export FABRIC_CFG_PATH=../config
# Set environment variables for Orderer
export ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
export ORDERER_GENERAL_LOCALMSPID=OrdererMSP
export ORDERER_GENERAL_LOCALMSPDIR=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp

# Enable TLS if required
export ORDERER_GENERAL_TLS_ENABLED=true
export ORDERER_GENERAL_TLS_CERTIFICATE=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
export ORDERER_GENERAL_TLS_PRIVATEKEY=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key
export ORDERER_GENERAL_TLS_ROOTCAS=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt

export ADMIN_TLS_SIGN_CERT=../organizations/ordererOrganizations/example.com/users/Admin@example.com/tls/client.crt
export ADMIN_TLS_PRIVATE_KEY=../organizations/ordererOrganizations/example.com/users/Admin@example.com/tls/client.key

# Set log level for the orderer
export ORDERER_LOGLEVEL=INFO

export OSN_TLS_CA_ROOT_CERT=../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
# Print the environment variables to check if they are set correctly
echo "Orderer environment variables set:"
echo "ORDERER_GENERAL_LISTENADDRESS=$ORDERER_GENERAL_LISTENADDRESS"
echo "ORDERER_GENERAL_LOCALMSPID=$ORDERER_GENERAL_LOCALMSPID"
echo "ORDERER_GENERAL_LOCALMSPDIR=$ORDERER_GENERAL_LOCALMSPDIR"
echo "ORDERER_GENERAL_TLS_ENABLED=$ORDERER_GENERAL_TLS_ENABLED"
echo "ORDERER_LOGLEVEL=$ORDERER_LOGLEVEL"

# Now you can run Fabric CLI commands to interact with the Orderer
# Example: List channels on the Orderer
# Make sure the peer environment variables are set (you may need to set them separately for the peer)

# Example of listing the channels
#../bin/peer channel list -o orderer.example.com:7050 --tls --cafile $OSN_TLS_CA_ROOT_CERT
../bin/osnadmin channel join --channelID channel1 --config-block ../channel-artifacts/genesis_block.pb -o localhost:7053 --ca-file $OSN_TLS_CA_ROOT_CERT --client-cert $ADMIN_TLS_SIGN_CERT --client-key $ADMIN_TLS_PRIVATE_KEY || echo "Command failed"
# Example of joining the O

