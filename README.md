# h3-typebox

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> JSON schema validation for [h3](https://github.com/unjs/h3), using [typebox](https://github.com/sinclairzx81/typebox) & [ajv](https://github.com/ajv-validator/ajv).

## Install

```sh
# Using npm
npm install h3-typebox

# Using yarn
yarn install h3-typebox

# Using pnpm
pnpm install h3-typebox
```

## Usage

```js
import { createServer } from 'http'
import { createApp } from 'h3'
import { useValidatedBody, useValidatedQuery, Type } from 'h3-typebox'

const app = createApp()
app.use('/', async (req) => {
  // Validate body
  const body = await useValidatedBody(req, Type.Object({
    optional: Type.Optional(Type.String()),
    required: Type.Boolean(),
  }))

  // Validate query
  const body = useValidatedQuery(req, Type.Object({
    required: Type.String(),
  }))
})

createServer(app).listen(process.env.PORT || 3000)
```

See how to define your schema with `Type` on [TypeBox documentation](https://github.com/sinclairzx81/typebox#usage).

## Development 💻 

- Clone this repository
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💙

Published under [MIT License](./LICENSE).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/h3-typebox?style=flat-square
[npm-version-href]: https://npmjs.com/package/h3-typebox

[npm-downloads-src]: https://img.shields.io/npm/dm/h3-typebox?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/h3-typebox

[github-actions-src]: https://img.shields.io/github/workflow/status/kevinmarrec/h3-typebox/ci/main?style=flat-square
[github-actions-href]: https://github.com/kevinmarrec/h3-typebox/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/gh/kevinmarrec/h3-typebox/main?style=flat-square
[codecov-href]: https://codecov.io/gh/kevinmarrec/h3-typebox
