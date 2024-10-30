# Fabric Network
This directory contains the base structure for a Hyperledger Fabric network.


## Packaging chaincode 
../bin/peer lifecycle chaincode package documentcc.tar.gz --path /home/vish/Dissertation/testNet/fabric-network/chaincode/documentChaincode/app --lang java --label documentcc1

# Note EXPORT HE FABRIC_CFC_PATH directory like so before running the peer command 
export FABRIC_CFG_PATH=/home/vish/Dissertation/testNet/fabric-network/config