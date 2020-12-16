.PHONY: \
	prebuild_checks \
	build \
	clean \
	deploy \

APP           := kenhoward-dev
APP_ENV       := ${APP}-test
GIT_COMMIT    := $(shell git rev-parse --short HEAD)
IMAGE         := kenhoward-dev
REGISTRY      := registry.digitalocean.com/kenhowardpdx
VERSION       := ${GIT_COMMIT}
WARNING       := only circleci should run this

ifeq ($(CIRCLE_BRANCH),main)
	APP_ENV = ${APP}
	VERSION = v$(shell cat version.txt | tr -d "\n")
endif

prebuild_checks:
	npx jest --ci --coverage
	npx eslint ./src
	npx tsc --noEmit

build:
	docker build --build-arg VERSION=${VERSION} -t ${IMAGE}:${VERSION} .

clean:
	rm -rf out

deploy:
ifeq ($(CIRCLE_BRANCH),main)
	# On merge to main publish update the "latest" alias to the new version
	docker tag ${IMAGE}:${VERSION} ${REGISTRY}/${IMAGE}:latest
	docker push ${REGISTRY}/${IMAGE}:latest
endif
	docker tag ${IMAGE}:${VERSION} ${REGISTRY}/${IMAGE}:${VERSION}
	docker push ${REGISTRY}/${IMAGE}:${VERSION}
	# rolling release
	bin/deploy --version ${VERSION} --token $(DO_TOKEN) --app ${APP_ENV}
