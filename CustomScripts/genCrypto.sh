#prints commands as they are executed 
set -x
cryptogen generate --config=./organizations/cryptogen/crypto-config-org1.yaml --output="organizations"
res=$?
{ set +x; } 2>/dev/null
if [ $res -ne 0 ]; then
    fatalln "Failed to generate certificates..."
fi

cryptogen generate --config=./organizations/cryptogen/crypto-config-org1.yaml --output="organizations"
res=$?
{ set +x; } 2>/dev/null
if [ $res -ne 0 ]; then
    fatalln "Failed to generate certificates..."
fi

#set this vital env variable which the tool searches in for the config file
export FABRIC_CFG_PATH=${PWD}/configtx