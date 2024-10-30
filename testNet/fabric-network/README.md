# Fabric Network
This directory contains the base structure for a Hyperledger Fabric network.


## Packaging chaincode 
../bin/peer lifecycle chaincode package documentcc.tar.gz --path /home/vish/Dissertation/testNet/fabric-network/chaincode/documentChaincode/app --lang java --label documentcc1

# Note EXPORT HE FABRIC_CFC_PATH directory like so before running the peer command 
export FABRIC_CFG_PATH=/home/vish/Dissertation/testNet/fabric-network/config

## command for peers to join the channel 
peer channel join -b /etc/hyperledger/fabric/genesisblocks/genesis_block.pb

## command fo the orderer to start the channel
        osnadmin channel join --channelID channel1 --config-block /etc/hyperledger/fabric/genesisblocks/genesis_block.pb -o orderer.example.com:7053 --ca-file $OSN_TLS_CA_ROOT_CERT --client-cert $ADMIN_TLS_SIGN_CERT --client-key $ADMIN_TLS_PRIVATE_KEY || echo "Command failed"

