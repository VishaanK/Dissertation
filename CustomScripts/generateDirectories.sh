# Base directory for the network
BASE_DIR="./fabric-network"

# Create base directories
mkdir -p $BASE_DIR
mkdir -p $BASE_DIR/crypto-config
mkdir -p $BASE_DIR/scripts
mkdir -p $BASE_DIR/organizations
mkdir -p $BASE_DIR/chaincode/mychaincode
mkdir -p $BASE_DIR/channel-artifacts
mkdir -p $BASE_DIR/organizations/cryptogen

# Create the config files needed
touch $BASE_DIR/organizations/cryptogen/crypto-config-orderer.yaml
touch $BASE_DIR/organizations/cryptogen/crypto-config-org1.yaml

# Create compose directory for Docker Compose files
mkdir -p $BASE_DIR/compose
touch $BASE_DIR/compose/docker-compose.yaml
touch $BASE_DIR/compose/docker-compose.override.yaml

# Create channel-artifacts subdirectory (for storing the genesis block and channel configurations)
mkdir -p $BASE_DIR/channel-artifacts

# Create configtx directory (for storing configtx.yaml and related files)
mkdir -p $BASE_DIR/configtx
touch $BASE_DIR/configtx/configtx.yaml

# Create README.md files for documentation
echo "# Fabric Network" > $BASE_DIR/README.md
echo "This directory contains the base structure for a Hyperledger Fabric network." >> $BASE_DIR/README.md

echo "# Crypto Config" > $BASE_DIR/crypto-config/README.md
echo "This directory contains cryptographic material and configuration files for the network." >> $BASE_DIR/crypto-config/README.md

echo "# Scripts" > $BASE_DIR/scripts/README.md
echo "This directory contains scripts for managing the Hyperledger Fabric network." >> $BASE_DIR/scripts/README.md

echo "# Organizations" > $BASE_DIR/organizations/README.md
echo "This directory contains configurations for the organizations involved in the network." >> $BASE_DIR/organizations/README.md

echo "# Chaincode" > $BASE_DIR/chaincode/README.md
echo "This directory contains the chaincode implementations for the Hyperledger Fabric network." >> $BASE_DIR/chaincode/README.md

echo "# Channel Artifacts" > $BASE_DIR/channel-artifacts/README.md
echo "This directory stores channel artifacts like genesis block and channel configuration." >> $BASE_DIR/channel-artifacts/README.md

echo "# Cryptogen" > $BASE_DIR/organizations/cryptogen/README.md
echo "This directory contains configurations for generating cryptographic materials using cryptogen." >> $BASE_DIR/organizations/cryptogen/README.md

echo "# Compose" > $BASE_DIR/compose/README.md
echo "This directory contains Docker Compose files to set up and manage the Hyperledger Fabric network." >> $BASE_DIR/compose/README.md

echo "# Configtx" > $BASE_DIR/configtx/README.md
echo "This directory contains configuration transaction files used for channel management and network configuration." >> $BASE_DIR/configtx/README.md

# Print completion message
echo "Directory structure for Hyperledger Fabric network has been created successfully."
