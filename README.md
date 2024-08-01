# Booking App

## Setup Node.js manager:

Install [FNM](https://github.com/Schniz/fnm)
Configure FNM with: `fnm env --use-on-cd --version-file-strategy=recursive --corepack-enabled --resolve-engines`

## Pre-setup

Clone the app and create .env file:

```bash
cp .env.example .env
```

After that you have two options: either run with docker compose or run locally

## Run via docker-compose

Database migrations are applied automatically on app startup.

```bash
docker compose up --build
```

## Local development setup

Install [pnpm](https://pnpm.io/installation)

Install dependencies:

```bash
pnpm install
```

You need to configure postgres.localhost in your hosts file to point to localhost.
Basically just add this line to your hosts file: `127.0.0.1       postgres.localhost`.
Location of hosts file depends on your OS, on MacOS/Linux it's `/etc/hosts`.
Start postgres container:

```bash
docker compose up postgres.localhost --build
```

Run the app locally:

```bash
pnpm dev
```
