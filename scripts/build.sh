#!/bin/sh

cd "$(dirname "$0")/.."

rm -rf ./build-new/

webpack

cp -r src/api/ build-new/
cp -r src/favicon.ico build-new/
cp -r src/opengraph.png build-new/
cp -r src/json/ build-new/
rm -rf build-new/json/results.*.json

php ./composer.phar install

php ./scripts/generate-results-json.php --scale=day --file=./build-new/json/results.day.json
php ./scripts/generate-results-json.php --scale=total --file=./build-new/json/results.total.json

du -sh build-new/ build/

while true; do
    read -p "Deploy new build to production? " yn
    case $yn in
        [Yy]* )
          rm -rf ./build/
          mv ./build-new/ build/
        break;;

        [Nn]* )
          echo "Aborted."
        exit;;

        * ) echo "Please answer yes or no.";;
    esac
done
