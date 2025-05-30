```plaintext
├── .editorconfig
├── .github
│   └── workflows
│       └── ci.yml
├── .gitignore
├── .husky
│   └── pre-commit
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── README.md
├── apps
│   ├── admin-portal
│   │   ├── .swcrc
│   │   ├── eslint.config.mjs
│   │   ├── index.d.ts
│   │   ├── next-env.d.ts
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── public
│   │   │   ├── .gitkeep
│   │   │   └── favicon.ico
│   │   ├── src
│   │   │   └── app
│   │   │       ├── api
│   │   │       │   └── hello
│   │   │       │       └── route.ts
│   │   │       ├── global.css
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   └── main-server
│       ├── .env.development
│       ├── .env.example
│       ├── .env.production
│       ├── .spec.swcrc
│       ├── eslint.config.mjs
│       ├── jest.config.ts
│       ├── package.json
│       ├── src
│       │   ├── assets
│       │   │   └── .gitkeep
│       │   ├── config
│       │   │   ├── corsOptions.ts
│       │   │   ├── env.ts
│       │   │   └── openapiRegistry.ts
│       │   ├── createApp.ts
│       │   ├── loaders
│       │   │   └── registerRoutes.ts
│       │   ├── main.ts
│       │   ├── middlewares
│       │   │   ├── errorHandler.ts
│       │   │   └── requestId.ts
│       │   ├── modules
│       │   │   ├── common
│       │   │   │   ├── errors
│       │   │   │   │   ├── BadRequestError.ts
│       │   │   │   │   ├── BaseError.ts
│       │   │   │   │   ├── DatabaseConnectionError.ts
│       │   │   │   │   ├── FileNotFoundError.ts
│       │   │   │   │   ├── InternalServerError.ts
│       │   │   │   │   ├── InvocationError.ts
│       │   │   │   │   ├── NotAuthorizedError.ts
│       │   │   │   │   ├── NotFoundError.ts
│       │   │   │   │   ├── UnauthorizedError.ts
│       │   │   │   │   └── ValidationError.ts
│       │   │   │   └── libs
│       │   │   │       └── logger.ts
│       │   │   └── test
│       │   │       ├── docs
│       │   │       │   └── openapi.ts
│       │   │       ├── routes.ts
│       │   │       └── test.controller.ts
│       │   ├── swagger
│       │   │   └── swagger.ts
│       │   └── types
│       │       └── express
│       │           └── index.d.ts
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       └── tsconfig.spec.json
├── eslint.config.mjs
├── jest.config.ts
├── jest.preset.js
├── libs
│   ├── server-common
│   │   ├── .spec.swcrc
│   │   ├── .swcrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── server-common.spec.ts
│   │   │       └── server-common.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.spec.json
│   ├── shared-ui
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       └── shared-ui.tsx
│   │   ├── tsconfig.json
│   │   └── tsconfig.lib.json
│   ├── shared-utils
│   │   ├── .spec.swcrc
│   │   ├── .swcrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── shared-utils.spec.ts
│   │   │       └── shared-utils.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.spec.json
│   └── storybook-host
│       ├── .babelrc
│       ├── README.md
│       ├── eslint.config.mjs
│       ├── package.json
│       ├── rollup.config.cjs
│       ├── src
│       │   ├── index.ts
│       │   └── lib
│       │       └── storybook-host.tsx
│       ├── tsconfig.json
│       └── tsconfig.lib.json
├── nx.json
├── package-lock.json
├── package.json
├── scripts
│   └── generateTree.ts
├── structure.md
├── tsconfig.base.json
└── tsconfig.json

```