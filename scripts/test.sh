#!/usr/bin/env bash


echo "###### Running truffle migrate"

# tail -F waitfile

echo "[INFO] Deploy smart contracts (truffle migrate --reset --compile-all --network $NETWORK -f 3) ..."
output=$(truffle migrate --reset --compile-all --network $NETWORK -f 3) || { echo '[ERROR] Failed to migrate' ; exit 1; }


# sleep 10

echo "[INFO] Exec truffle test--network $NETWORK) ..."
output=$(truffle test --network $NETWORK) || { echo '[ERROR] Failed testing contract' ; exit 1; }

echo "output: $output"

