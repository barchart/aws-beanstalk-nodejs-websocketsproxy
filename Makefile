VERSION = 1.1.3
SOURCE_BUNDLE = jerqproxy-node-$(VERSION).zip

build:
	zip -r dist/$(SOURCE_BUNDLE) app.js package.json instructions.txt