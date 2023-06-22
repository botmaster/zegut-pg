# Zegut-pg

Zégut PG is a web application that allows me to create Spotify playlists from the podcast episodes of the [**RTL2 Pop-Rock Station**](https://www.rtl2.fr/programmes/poprockstation) show presented by Francis Zégut & Marjorie Hache. It's also an excuse for me to play around with Vue.js and the Spotify API 🤓.

## Demo

[https://zegut-pg.netlify.app/](https://zegut-pg.netlify.app/)

## Features

- [x] Display the podacst information
- [x] Select an episode
- [x] Login with Spotify
- [x] Display the list of tracks for each episode
- [x] Create a Spotify playlist from the tracks of an episode
- [x] Display the created playlist
- [x] Display user Spotify profile

## Tech Stack

- [Vue.js](https://vuejs.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [Spotify API](https://developer.spotify.com/documentation/web-api/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Pinia](https://pinia.esm.dev/)
- [pnpm](https://pnpm.io/)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Github Actions Bump Version](https://github.com/marketplace/actions/automated-version-bump)
- [Netlify](https://www.netlify.com/)


## Spotify API

Grant type: [Authorization Code with PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)

### Documentation
- [Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
- [Authorization Scopes](https://developer.spotify.com/documentation/general/guides/scopes/)



## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
