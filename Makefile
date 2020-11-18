.PHONY: \
	build \
	clean \
	deploy \

APP           := kenhoward-dev
GIT_COMMIT    := $(shell git rev-parse --short HEAD)
IMAGE         := kenhoward-dev
REGISTRY      := registry.digitalocean.com/kenhowardpdx
VERSION       := ${GIT_COMMIT}
WARNING       := only circleci should run this

ifeq ($(CIRCLECI),true)
	VERSION  = v$(shell cat version.txt | tr -d "\n")
endif

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
	# rolling release - TODO: make this better
  wget https://github.com/digitalocean/doctl/releases/download/v1.52.0/doctl-1.52.0-linux-amd64.tar.gz
  tar xf doctl-1.52.0-linux-amd64.tar.gz
  mv doctl ../bin
  doctl apps list --format ID --no-header -t $DO_TOKEN | xargs doctl apps update --spec app.yaml -t $DO_TOKEN
