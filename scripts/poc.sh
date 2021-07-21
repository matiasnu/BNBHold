#!/usr/bin/env bash

docker-compose -f docker-compose-gh-pages.yml build \
--build-arg GIT_SSH_KEY="$(cat ~/.ssh/id_rsa)" \
--build-arg GIT_PUBLIC_SSH_KEY="$(cat ~/.ssh/id_rsa.pub)" \
--build-arg GITHUB_CONFIG_USERNAME="Mariano Di Maggio" \
--build-arg GITHUB_CONFIG_EMAIL="mariano.dim@gmail.com" \
gh-pages-deploy
