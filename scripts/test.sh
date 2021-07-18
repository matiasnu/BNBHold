#!/usr/bin/env bash


echo "###### Running truffle migrate"

echo "[INFO] Deploy smart contracts (truffle migrate --reset --compile-all --network $NETWORK) ..."
output=$(truffle migrate --reset --compile-all --network $NETWORK) || { echo '[ERROR] Failed to migrate' ; exit 1; }


sleep 10

echo "[INFO] Exec truffle test--network $NETWORK) ..."
output=$(truffle test --network $NETWORK) || { echo '[ERROR] Failed to migrate' ; exit 1; }

echo "output: $output"

#echo "::set-output name=TESTRESULT::$output"
