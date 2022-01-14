#!/bin/bash

if [ $# -eq 0 ]; then
    echo "usage: ./destroy-inactive-environments <active-envs-bitbucket> (e.g \"PR-branch-1 PR-branch-2 PR-branch-3\")"
    exit 1
fi

# goal: get bitbucket space seperated open PR branch names in $1, find all k8 active envs as well
# destroy all k8 projects/apps that has cicd prefix in name but no open PR

# this script will be ran in intervals via node.js script that will pass bitbucket api info

bitbucket_pr_branches=($1)
k8_envs=( dev-env prod client-cicd-one client-cicd-two client-cicd-three client-cicd-four client-cicd-five int )
cicd_env_prefix="client-cicd-"

for active_env in "${bitbucket_pr_branches[@]}"
do
	echo "got active enviorment $active_env"
done

echo ""

for k8_env in "${k8_envs[@]}"
do
	echo "got k8 enviorment $k8_env"
done

echo ""
echo "searching for cicd envs with prefix '$cicd_env_prefix'"

for k8_env in "${k8_envs[@]}"
do
    if [[ "$k8_env" == *"$cicd_env_prefix"* ]]; then
        echo "found k8 cicd enviorment $k8_env"
        k8_has_open_pr=0
        for pr_branch in "${bitbucket_pr_branches[@]}"
        do
            if [ "$k8_env" == "$cicd_env_prefix$pr_branch" ]; then
                echo "cicd k8 env '$k8_env' has open PR branch '$pr_branch'"
                k8_has_open_pr=1
            fi
        done

        if [[ "$k8_has_open_pr" == 0 ]]; then
            echo "cicd k8 env '$k8_env' has no active matching PR branch -> destroying env"
            sh ./destroy-preview-environment.sh $k8_env
        fi
    fi

    echo ""
done