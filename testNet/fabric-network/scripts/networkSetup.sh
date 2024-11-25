#!/bin/bash

source ./ordererSetup.sh

sleep 1

source ./peerSetup.sh

sleep 2

source ./approveChaincode.sh

sleep 2

source ./initialiseLedger.sh
