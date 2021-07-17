#!/usr/bin/env bash


echo "###### Running truffle-docker [v."



echo "[INFO] Exec truffle --network $NETWORK) ..."
output=$(truffle test --network $NETWORK) || { echo '[ERROR] Failed to migrate' ; exit 1; }


echo "output: $output"
