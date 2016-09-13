#!/bin/sh

cd "$(dirname "$0")/.."

rm -rf ./build/

webpack

cp src/vote.php build/
cp -r src/translations build/
