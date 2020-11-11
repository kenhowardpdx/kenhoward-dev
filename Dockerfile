ARG NODEJS_VERSION=14

FROM node:${NODEJS_VERSION} as builder
ENV SERVICE_HOME /opt/kenhoward-dev
WORKDIR ${SERVICE_HOME}

COPY package*.json .
COPY ./src ./src
COPY tsconfig.json .
# install dependencies
RUN npm install
# build
RUN npx tsc --outDir ./out/kenhoward-dev

FROM node:${NODEJS_VERSION}
ARG VERSION
ENV SERVICE_HOME /opt/kenhoward-dev
ENV VERSION ${VERSION}
WORKDIR ${SERVICE_HOME}
COPY --from=builder ${SERVICE_HOME}/out .
COPY package*.json .
RUN npm ci --only=production

EXPOSE 8080
CMD ["node", "kenhoward-dev/server.js"]
