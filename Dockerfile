ARG NODEJS_VERSION=14

FROM node:${NODEJS_VERSION} as builder
ENV SERVICE_HOME /opt/kenhoward-dev
WORKDIR ${SERVICE_HOME}

COPY package*.json ./
COPY ./src ./src
COPY ./src/templates ./out/templates
COPY tsconfig.prod.json .
# install dependencies
RUN npm install
# build
RUN npx tsc --project tsconfig.prod.json

FROM node:${NODEJS_VERSION}
ARG VERSION
ENV VERSION ${VERSION}
ENV SERVICE_HOME /opt/kenhoward-dev
WORKDIR ${SERVICE_HOME}
COPY --from=builder ${SERVICE_HOME}/out .
COPY package*.json ./
RUN npm ci --only=production

EXPOSE 8080
CMD ["node", "index.js"]
