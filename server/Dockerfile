ARG GOVERSION=1.19

FROM golang:${GOVERSION}-alpine AS build

WORKDIR /go/src/

COPY go.mod ./
COPY go.sum ./
COPY *.go ./

RUN go mod download
RUN go build -o ctt
FROM alpine:latest
RUN apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community bash
COPY --from=build /go/src/ctt /
ENTRYPOINT ["/ctt"]