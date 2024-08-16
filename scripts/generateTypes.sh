#!/usr/bin/env bash
set -e

here=$(dirname "$0")

echo "Usage: ./generate-types.sh BRANCH_NAME"
target="src/generated.d.ts"
tmp_dir="/tmp/seroviz"
if [[ $# -ne 1 ]]; then
  echo "No branch provided. Defaulting to main"
  branch="main"
else
  branch=$1
fi

rm -rf $tmp_dir
mkdir -p $tmp_dir
wget https://github.com/seroanalytics/serovizr/archive/"${branch}".zip -P $tmp_dir
unzip /tmp/seroviz/"${branch}".zip -d $tmp_dir

rm -f ${target}
mkdir $tmp_dir/types
npx tsx "$here"/generateTypes "${branch}"

echo "/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the serovizr JSON schema files
  * and run ./generate_types.sh to regenerate this file.
*/" >>${target}

cat $tmp_dir/types/*.d.ts >>${target}
rm -rf $tmp_dir
