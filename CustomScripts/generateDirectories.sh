#!/bin/bash

# Base directory for the network
BASE_DIR="./fabric-network"

# Create base directories
mkdir -p $BASE_DIR
mkdir -p $BASE_DIR/crypto-config
mkdir -p $BASE_DIR/configtx
mkdir -p $BASE_DIR/channel-artifacts
mkdir -p $BASE_DIR/scripts
mkdir -p $BASE_DIR/chaincode/mychaincode

# Create crypto-config subdirectories for orderer organization
mkdir -p $BASE_DIR/crypto-config/ordererOrganizations/example.com/orderers/orderer1.example.com
mkdir -p $BASE_DIR/crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com
mkdir -p $BASE_DIR/crypto-config/ordererOrganizations/example.com/msp
mkdir -p $BASE_DIR/crypto-config/ordererOrganizations/example.com/ca

# Create crypto-config subdirectories for peer organization Org1
mkdir -p $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com
mkdir -p $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com
mkdir -p $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer2.org1.example.com
mkdir -p $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/msp
mkdir -p $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/ca

# Create organizations directory
mkdir -p $BASE_DIR/organizations
mkdir -p $BASE_DIR/organizations/ordererOrganizations
mkdir -p $BASE_DIR/organizations/ordererOrganizations/example.com
mkdir -p $BASE_DIR/organizations/peerOrganizations
mkdir -p $BASE_DIR/organizations/peerOrganizations/org1.example.com

# Create compose directory for Docker Compose files
mkdir -p $BASE_DIR/compose
touch $BASE_DIR/compose/docker-compose.yaml
touch $BASE_DIR/compose/docker-compose.override.yaml

# Create channel-artifacts subdirectory (for storing the genesis block and channel configurations)
mkdir -p $BASE_DIR/channel-artifacts

# Create configtx directory (for storing configtx.yaml and related files)
mkdir -p $BASE_DIR/configtx

# Create scripts directory (for storing network and channel scripts)
mkdir -p $BASE_DIR/scripts

# Create chaincode directory structure
mkdir -p $BASE_DIR/chaincode/mychaincode

# Adding README files to directories

# For the crypto-config directory
echo "This directory stores all cryptographic material for the Fabric network (MSP, TLS certs)." > $BASE_DIR/crypto-config/README.md

# For the orderer organizations
echo "This directory contains cryptographic material for the orderer organization 'example.com'." > $BASE_DIR/crypto-config/ordererOrganizations/example.com/README.md
echo "This directory contains cryptographic material for the first orderer node (orderer1.example.com)." > $BASE_DIR/crypto-config/ordererOrganizations/example.com/orderers/orderer1.example.com/README.md
echo "This directory contains cryptographic material for the second orderer node (orderer2.example.com)." > $BASE_DIR/crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/README.md
echo "This directory contains the MSP (Membership Service Provider) information for the orderer organization." > $BASE_DIR/crypto-config/ordererOrganizations/example.com/msp/README.md
echo "This directory stores the CA (Certificate Authority) certificates for the orderer organization." > $BASE_DIR/crypto-config/ordererOrganizations/example.com/ca/README.md

# For the peer organization Org1
echo "This directory contains cryptographic material for the peer organization 'org1.example.com'." > $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/README.md
echo "This directory contains cryptographic material for the first peer node (peer0.org1.example.com)." > $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/README.md
echo "This directory contains cryptographic material for the second peer node (peer1.org1.example.com)." > $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/README.md
echo "This directory contains cryptographic material for the third peer node (peer2.org1.example.com)." > $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/README.md
echo "This directory contains the MSP (Membership Service Provider) information for the peer organization 'Org1'." > $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/msp/README.md
echo "This directory stores the CA (Certificate Authority) certificates for the peer organization 'Org1'." > $BASE_DIR/crypto-config/peerOrganizations/org1.example.com/ca/README.md

# For the organizations directory
echo "This directory contains organization-related configurations for the Fabric network." > $BASE_DIR/organizations/README.md
echo "This directory contains configurations for orderer organizations." > $BASE_DIR/organizations/ordererOrganizations/README.md
echo "This directory contains configurations for the orderer organization 'example.com'." > $BASE_DIR/organizations/ordererOrganizations/example.com/README.md
echo "This directory contains configurations for peer organizations." > $BASE_DIR/organizations/peerOrganizations/README.md
echo "This directory contains configurations for the peer organization 'org1.example.com'." > $BASE_DIR/organizations/peerOrganizations/org1.example.com/README.md

# For the compose directory
echo "This directory contains Docker Compose files used to deploy and manage the Hyperledger Fabric network." > $BASE_DIR/compose/README.md
echo "This file defines the services, networks, and volumes for the Hyperledger Fabric network." > $BASE_DIR/compose/docker-compose.yaml
echo "This file allows for overriding settings in the main docker-compose file." > $BASE_DIR/compose/docker-compose.override.yaml

# For the channel-artifacts directory
echo "This directory stores the channel configuration artifacts, including the genesis block and anchor peer updates." > $BASE_DIR/channel-artifacts/README.md

# For the
