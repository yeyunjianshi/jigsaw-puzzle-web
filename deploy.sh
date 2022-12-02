#!/usr/bin/env sh

set -e

npm run build

cd dist

echo > .nojekyll

git init
git checkout -B gh-pages
git add -A
git commit -m 'deploy'

git push -f git@github.com:yeyunjianshi/jigsaw-puzzle-web.git gh-pages

cd -
