#!/bin/sh
REPO="https://github.com/jylescoad-ward/diddle.js"
BRANCH_DEV="dev"
BRANCH_STABLE="stable"
BRANCH_DOCS="docs"
echo "% mkdir diddle.js/"
mkdir diddle.js/
cd diddle.js/
echo "% git clone $REPO -b $BRANCH_DEV $BRANCH_DEV"
git clone $REPO -b $BRANCH_DEV $BRANCH_DEV
echo "% git clone $REPO -b $BRANCH_DOCS $BRANCH_DOCS"
git clone $REPO -b $BRANCH_DOCS $BRANCH_DOCS
echo "% cd dev"
cd dev
echo "\n# [dev]  Installing Modules"
echo "% npm i --include=dev"
npm i --include=dev

echo "\n% npm link"
if npm link; then
	echo "Linked 'diddle.js' as local module"
else
	echo "Need superuser permissions to link module"
	echo "\n% sudo npm link"
	sudo npm link
fi

echo "% cd .. && cd docs"
cd .. && cd docs
echo "\n# [docs] Installing Modules"
echo "% npm i --include=dev"
npm i --include=dev

echo "\n# [docs] Installing git submodules"
git submodule add -b $BRANCH_DEV -f $REPO.git source-dev
git submodule add -b $BRANCH_STABLE -f $REPO.git source
