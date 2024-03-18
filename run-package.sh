#!/bin/bash
set -e

# variable declarations
build_dir=dist
lambdas=( PXEnforcer PXFirstParty PXActivities )

# clear previous zips
rm -f *.zip

# copy custom into px folder
cp -r src/custom $build_dir/custom

# copy mustache templates into px folder
cp -r node_modules/perimeterx-node-core/lib/templates $build_dir/px/templates

# create zip for each lambda
for lambda in "${lambdas[@]}"
do
    echo "Zipping $lambda"
    (
        cd $build_dir
        mv $lambda.js index.js
        if [[ $lambda != "PXFirstParty" ]]; then
            files_to_zip="index.js custom px"
        else
            files_to_zip="index.js custom/config.js"
        fi
        zip -r ../$lambda.zip $files_to_zip
        mv index.js $lambda.js
    )
done

# cleanup
rm -rf $build_dir/custom
rm -rf $build_dir/px/templates