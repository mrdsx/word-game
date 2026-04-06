FROM oven/bun:1.3.11-alpine

RUN apk add --no-cache openjdk21-jre-headless

RUN bun i -g firebase-tools
RUN bun -g pm cache rm

WORKDIR /app
COPY . .

CMD ["firebase", "emulators:start", "--import=firebase-data", "--export-on-exit"]