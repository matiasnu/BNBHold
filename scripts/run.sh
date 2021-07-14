#!/usr/bin/env bash


echo "###### Running truffle-docker [v."



echo "[INFO] Deploy smart contracts (truffle migrate --reset --compile-all --network $NETWORK) ..."
output=$(truffle migrate --reset --compile-all --network $NETWORK) || { echo '[ERROR] Failed to migrate' ; exit 1; }


echo "output: $output"
