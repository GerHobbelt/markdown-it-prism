PATH        := ./node_modules/.bin:${PATH}

NPM_PACKAGE := $(shell node support/getGlobalName.js package)
NPM_VERSION := $(shell node support/getGlobalName.js version)

GLOBAL_NAME := $(shell node support/getGlobalName.js global)
BUNDLE_NAME := $(shell node support/getGlobalName.js microbundle)

TMP_PATH    := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD   := $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GITHUB_PROJ := https://github.com//GerHobbelt/${NPM_PACKAGE}


build: report-config lintfix bundle test coverage todo

lint:
	eslint . --ext .js,.ts

lintfix:
	eslint --fix . --ext .js,.ts

bundle:
	-rm -rf ./dist
	mkdir dist
	microbundle --no-compress --target node --strict --name ${GLOBAL_NAME}
	npx prepend-header 'dist/*js' support/header.js

bundle-test:
	-rm -rf ./test/dist
	mkdir test/dist
	microbundle --no-compress --target node --strict --name test test/test.ts --output test/dist/
	mv test/dist/*.mjs* test/
	-rm -rf ./test/dist

test: bundle-test
	mocha

coverage:
	-rm -rf coverage
	-rm -rf .nyc_output
	cross-env NODE_ENV=test nyc mocha

report-coverage: lint coverage


publish:
	@if test 0 -ne `git status --porcelain | wc -l` ; then \
		echo "Unclean working tree. Commit or stash changes first." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git fetch ; git status | grep '^# Your branch' | wc -l` ; then \
		echo "Local/Remote history differs. Please push/pull changes." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git tag -l ${NPM_VERSION} | wc -l` ; then \
		echo "Tag ${NPM_VERSION} exists. Update package.json" >&2 ; \
		exit 128 ; \
		fi
	git tag ${NPM_VERSION} && git push origin ${NPM_VERSION}
	npm run pub

todo:
	@echo ""
	@echo "TODO list"
	@echo "---------"
	@echo ""
	grep 'TODO' -n -r ./ --exclude-dir=node_modules --exclude-dir=unicode-homographs --exclude-dir=.nyc_output --exclude-dir=dist --exclude-dir=coverage --exclude=Makefile '--exclude=*.map' 2>/dev/null || test true

clean: report-config
	-rm -rf ./coverage/
	-rm -rf ./dist/
	-rm -rf ./.nyc_output/

superclean: clean
	-rm -rf ./node_modules/
	-rm -f ./package-lock.json

prep: superclean
	-ncu -a --packageFile=package.json
	-npm install
	-npm prune
	-npm audit fix --legacy-peer-deps

prep-ci: clean
	-rm -rf ./node_modules/
	# HACK to allow CI to pass the npm install phase (crash due to minimatch SHA failure **WTF?!**)
	-rm package-lock.json
	#-npm ci
	-npm install
	-npm prune
	-npm audit fix --legacy-peer-deps
	-mocha --version
	-node --version

report-config:
	-echo "NPM_PACKAGE=${NPM_PACKAGE} NPM_VERSION=${NPM_VERSION} GLOBAL_NAME=${GLOBAL_NAME} BUNDLE_NAME=${BUNDLE_NAME} TMP_PATH=${TMP_PATH} REMOTE_NAME=${REMOTE_NAME} REMOTE_REPO=${REMOTE_REPO} CURR_HEAD=${CURR_HEAD}"


.PHONY: clean superclean prep prep-ci report-config publish lint lintfix test todo coverage report-coverage doc build gh-doc bundle bundle-test
.SILENT: help lint test todo report-config
