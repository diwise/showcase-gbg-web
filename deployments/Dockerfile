# --- frontend ---

FROM registry.access.redhat.com/ubi8/nodejs-16 AS frontend-builder

COPY ./web/package.json .
RUN npm install

COPY ./web/public public
COPY ./web/src src
RUN npm run build

# --- backend ---

FROM golang:1.19 AS backend-builder

WORKDIR /app

COPY ./api/go.mod .
COPY ./api/go.sum .

RUN go mod download

COPY ./api/. .

RUN GOOS=linux GOARCH=amd64 go build

# --- runner ---

FROM registry.access.redhat.com/ubi8/ubi-minimal
WORKDIR /opt/diwise

RUN mkdir static
COPY --from=frontend-builder --chown=1001 /opt/app-root/src/build ./static
COPY --from=backend-builder --chown=1001 /app/showcase-web /opt/diwise

ENV WEB_ROOT="./static"

EXPOSE 8080
USER 1001

ENTRYPOINT ["/opt/diwise/showcase-web"]