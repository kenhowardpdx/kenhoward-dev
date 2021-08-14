kenhoward-dev
=============

[![Continuous Integration](https://github.com/kenhowardpdx/kenhoward-dev/actions/workflows/ci.yaml/badge.svg)](https://github.com/kenhowardpdx/kenhoward-dev/actions/workflows/ci.yaml)

My personal website

## Development

1. Clone the repo
```sh
> git clone https://github.com/kenhowardpdx/kenhoward-dev.git && cd kenhoward-dev
```

2. Ensure your are using Node v14
```sh
> nvm use
```

3. Install dependencies
```sh
> npm install
```

4. Check that the build compiles
```sh
> npx eslint && npx tsc --noEmit
```

6. Check that tests pass
```sh
> npx jest
```

6. Start coding

7. Check formatting
```sh
> npx prettier --write src
```

## Run locally

```sh
> npx ts-node src/index.ts -dataPath testdata
```
