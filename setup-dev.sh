#!/bin/bash
REPO="https://github.com/jylescoad-ward/diddle.js"
BRANCH_DEV="dev"
BRANCH_STABLE="stable"
BRANCH_DOCS="docs"

printdt() {
	printf "\n\033[1;07m$1\033[0m\n"
}

printdt "$ mkdir diddle.js"
mkdir diddle.js/
cd diddle.js/

printdt "$ git clone $REPO -b $BRANCH_DEV $BRANCH_DEV"
git clone $REPO -b $BRANCH_DEV $BRANCH_DEV
printdt "$ git clone $REPO -b $BRANCH_DOCS $BRANCH_DOCS"
git clone $REPO -b $BRANCH_DOCS $BRANCH_DOCS

#  ==== Install Modules
printdt "$ cd dev"
cd dev
printdt "# [dev]  Installing Modules"
printdt "$ npm i --include=dev"
npm i --include=dev

#  ==== Link diddle.js
printdt "$ npm link"
if npm link; then
	printdt "Linked 'diddle.js' as local module"
else
	printdt "Need superuser permissions to link module"
	printdt "$ sudo npm link"
	sudo npm link
fi


#  ==== Create Script Testing Enviroment
printdt "# creating script testing enviroment"
printdt "$ cd .. && mkdir test && cd test"
cd ..
mkdir test
cd test
#  ==== Link diddle.js dev
printdt "$ npm link diddle.js"
if npm link diddle.js; then
	printdt "Linked development diddle.js"
else
	printdt "$ sudo npm link diddle.js"
	sudo npm link diddle.js
	printdt "[sudo] Linked development diddle.js"
fi
#  ==== Initialize diddle.js
printdt "$ diddlejs init"
#diddlejs init

#  ==== Initalize Submodules
printdt "# [docs] Installing git submodules"
printdt "$ git submodule init ."
git submodule init .
printdt "$ git submodule update --init --recursive ."
git submodule update --init --recursive .

printdt "# [docs] To update submodules do 'npm run update' in 'diddle.js/docs/'"

#  ==== Install Modules
printdt "$ cd .. && cd docs"
cd .. && cd docs
printdt "# [docs] Installing Modules"
printdt "$ npm i --include=dev"
npm i --include=dev
