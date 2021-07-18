#!/usr/bin/env bash

export output="error 1"

echo "output: $output"

echo "::set-output name=TESTRESULT::$output"