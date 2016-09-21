#!/bin/sh

cd "$(dirname "$0")/.."

rm -rf ./build/

webpack

cp -r src/api/ build/
cp -r src/translations/ build/
cp -r src/json/ build/
cp -r src/favicon.ico build/
cp -r src/opengraph.png build/

php ./composer.phar install
php ./scripts/generate-results-json.php

