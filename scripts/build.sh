#!/bin/sh

cd "$(dirname "$0")/.."

rm -rf ./build/

webpack

cp -r src/api/ build/
cp -r src/translations/ build/

php ./scripts/generate-results-json.php
