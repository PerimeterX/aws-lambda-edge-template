#!/bin/bash
set -e

# variable declarations
build_dir=dist
lambdas=( PXEnforcer PXFirstParty PXActivities )

# clear previous zips
rm -f *.zip

# create zip for each lambda
for lambda in "${lambdas[@]}"
do
    echo "Zipping $lambda"
    (
        cd $build_dir
        mv $lambda.js index.js
        files_to_zip="index.js custom px"
        zip -r ../$lambda.zip $files_to_zip
        mv index.js $lambda.js
    )
done

# cleanup
rm -rf $build_dir/custom
rm -rf $build_dir/px/templates