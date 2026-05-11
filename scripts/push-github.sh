#!/bin/bash
# Push current changes to GitHub trends-landing repo
# Uses GITHUB_PERSONAL_ACCESS_TOKEN secret from environment

if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "Error: GITHUB_PERSONAL_ACCESS_TOKEN is not set"
  exit 1
fi

REPO_URL="https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/darcynj757-svg/trends-landing.git"

git push "$REPO_URL" HEAD:main "$@"
echo "Pushed to GitHub: darcynj757-svg/trends-landing"
