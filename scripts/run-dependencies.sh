#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common


TAG=seroanalytics/serovizr:$SEROVIZR_VERSION

docker pull $TAG || true
docker run -p 8888:8888 -d --rm --name serovizr $TAG
