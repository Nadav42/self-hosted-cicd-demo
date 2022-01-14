#!/bin/bash

if [ $# -eq 0 ]; then
    echo "usage: <enviornment-name>"
    exit 1
fi

echo "[destroy-preview-environment] destroying k8 enviornment '$1'"

# goal: get project/app name in $1 and remove pods with this env name or something
# this script will be triggered by either:
# 1. the pereodic destroy-inactive-environments.sh script
# 2. webhook call to this script with the branch name from the webhook