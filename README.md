# 5minutechess

[![Create and publish Docker image to ghcr.io](https://github.com/thieleju/5minutechess/actions/workflows/dockerize.yml/badge.svg?branch=main)](https://github.com/thieleju/5minutechess/actions/workflows/dockerize.yml)

![Preview Image](./preview.png)

## 🚀 How it works

Players are able to vote for a move. You can log in via OAuth for Github, Discord and Lichess. 
Every 5 minutes the most voted move is played on the board. If there are no votes, the timer resets and starts again.

## Environment Variables

> **Warning** <br>
> Due to a bug in Nuxt 3, the pre-build docker container does not read environment variables at runtime. The env variables have to be provided at build time. <br>

These environment variables are required to implement OAuth Login:

```html
GITHUB_CLIENT_ID=<github oauth>
GITHUB_CLIENT_SECRET=<github oauth>
DISCORD_CLIENT_ID=<discord oauth>
DISCORD_CLIENT_SECRET=<discord oauth>
LICHESS_CLIENT_ID=<lichess oauth>
LICHESS_CLIENT_SECRET=<lichess oauth>
JWT_TOKEN_EXPIRATION=1d
JWT_SECRET=<random string>
DB_REDIS_HOST=<redis host>
DB_REDIS_PORT=<redis port>
BASE_URL=http://localhost:3000
```

# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
