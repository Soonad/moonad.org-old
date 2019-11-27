# Moonad website
<!-- [![Cirrus CI](https://api.cirrus-ci.com/github/moonad/Moonad.svg)](https://cirrus-ci.com/github/moonad/Moonad) -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

### Build Instructions

```
npm i
npm run build
cd src
node server.js
```

Access `localhost` on your browser.


### CLI Commands

- `npm install`: Installs dependencies

- `npm run start`: Runs serve or dev, depending on NODE_ENV value. Defaults to dev server

- `npm run typecheck`: Check TypeScript files for type errors.

- `npm run build`: Production-ready build

- `npm run lint`: Pass TypeScript files using TSLint

- `npm run lint-fix`: Automaticaly fix some lint errors