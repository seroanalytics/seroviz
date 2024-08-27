#!/usr/bin/env bash
set -ex

TAG=seroanalytics/serovizr:main

docker pull $TAG
docker run -p 8888:8888 -d --rm --name serovizr $TAG
