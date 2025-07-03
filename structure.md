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
│   │   ├── .env.development
│   │   ├── .env.example
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
│   │   │   ├── app
│   │   │   │   ├── (auth)
│   │   │   │   │   └── login
│   │   │   │   │       ├── LoginForm.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── actions
│   │   │   │   │   ├── auth.ts
│   │   │   │   │   └── users.ts
│   │   │   │   ├── api
│   │   │   │   │   └── hello
│   │   │   │   │       └── route.ts
│   │   │   │   ├── dashboard
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── organization
│   │   │   │   │   │   ├── OrganizationTable.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── organization-types
│   │   │   │   │   │   ├── BottomContent.tsx
│   │   │   │   │   │   ├── OrganizationTypeTable.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── [id]
│   │   │   │   │   │   │       ├── EditOrgnizationTypesForm.tsx
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── users
│   │   │   │   │       ├── BottomContent.tsx
│   │   │   │   │       ├── TopContent.tsx
│   │   │   │   │       ├── UsersTable.tsx
│   │   │   │   │       ├── edit
│   │   │   │   │       │   └── [id]
│   │   │   │   │       │       └── page.tsx
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── view
│   │   │   │   │           └── [id]
│   │   │   │   │               └── page.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── global.css
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   ├── Providers.tsx
│   │   │   │   ├── ReduxProviders.tsx
│   │   │   │   ├── buttons
│   │   │   │   │   └── GoBackButton.tsx
│   │   │   │   ├── forms
│   │   │   │   │   └── CreateOrganizationTypeForm.tsx
│   │   │   │   ├── loadings
│   │   │   │   │   └── LodingSpinner.tsx
│   │   │   │   ├── navbar
│   │   │   │   │   ├── AccountMenu.tsx
│   │   │   │   │   ├── NavLinks.tsx
│   │   │   │   │   ├── TopNav.tsx
│   │   │   │   │   └── UserMenu.tsx
│   │   │   │   └── sidebar
│   │   │   │       ├── Sidebar.tsx
│   │   │   │       └── SidebarNavLink.tsx
│   │   │   ├── libs
│   │   │   │   ├── redux
│   │   │   │   │   ├── createAppAsyncThunk.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── rootReducer.ts
│   │   │   │   │   ├── slices
│   │   │   │   │   │   ├── currentUserSlice
│   │   │   │   │   │   │   ├── currentUserSlice.tsx
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── thunks.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── organizationSlice
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── orgnizationSlice.ts
│   │   │   │   │   │   │   └── thunk.ts
│   │   │   │   │   │   ├── organizationTypeSlice
│   │   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   │   ├── orgnizationTypeSlice.ts
│   │   │   │   │   │   │   └── thunk.ts
│   │   │   │   │   │   ├── testSlice
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── testSlice.tsx
│   │   │   │   │   │   └── usersSlice
│   │   │   │   │   │       ├── index.ts
│   │   │   │   │   │       ├── thunk.ts
│   │   │   │   │   │       └── usersSlice.tsx
│   │   │   │   │   └── store.ts
│   │   │   │   └── schemas
│   │   │   │       └── loginSchema.ts
│   │   │   ├── services
│   │   │   │   ├── auth.ts
│   │   │   │   ├── organization.service.ts
│   │   │   │   ├── organizationType.ts
│   │   │   │   └── user.ts
│   │   │   ├── types
│   │   │   │   └── index.d.ts
│   │   │   └── utils
│   │   │       └── tableClassnames.ts
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   ├── main-server
│   │   ├── .env.development
│   │   ├── .env.example
│   │   ├── .env.production
│   │   ├── .spec.swcrc
│   │   ├── dist
│   │   │   ├── apps
│   │   │   │   └── main-server
│   │   │   │       └── src
│   │   │   │           ├── config
│   │   │   │           │   ├── corsOptions.d.ts
│   │   │   │           │   ├── corsOptions.d.ts.map
│   │   │   │           │   ├── corsOptions.js
│   │   │   │           │   ├── data-source.d.ts
│   │   │   │           │   ├── data-source.d.ts.map
│   │   │   │           │   ├── data-source.js
│   │   │   │           │   ├── env.d.ts
│   │   │   │           │   ├── env.d.ts.map
│   │   │   │           │   ├── env.js
│   │   │   │           │   ├── openapiRegistry.d.ts
│   │   │   │           │   ├── openapiRegistry.d.ts.map
│   │   │   │           │   ├── openapiRegistry.js
│   │   │   │           │   ├── sessionOptions.d.ts
│   │   │   │           │   ├── sessionOptions.d.ts.map
│   │   │   │           │   └── sessionOptions.js
│   │   │   │           ├── createApp.d.ts
│   │   │   │           ├── createApp.d.ts.map
│   │   │   │           ├── createApp.js
│   │   │   │           ├── infrastructure
│   │   │   │           │   ├── database.d.ts
│   │   │   │           │   ├── database.d.ts.map
│   │   │   │           │   ├── database.js
│   │   │   │           │   ├── redis.d.ts
│   │   │   │           │   ├── redis.d.ts.map
│   │   │   │           │   └── redis.js
│   │   │   │           ├── loaders
│   │   │   │           │   ├── registerRoutes.d.ts
│   │   │   │           │   ├── registerRoutes.d.ts.map
│   │   │   │           │   └── registerRoutes.js
│   │   │   │           ├── main.d.ts
│   │   │   │           ├── main.d.ts.map
│   │   │   │           ├── main.js
│   │   │   │           ├── middlewares
│   │   │   │           │   ├── currentUser.d.ts
│   │   │   │           │   ├── currentUser.d.ts.map
│   │   │   │           │   ├── currentUser.js
│   │   │   │           │   ├── errorHandler.d.ts
│   │   │   │           │   ├── errorHandler.d.ts.map
│   │   │   │           │   ├── errorHandler.js
│   │   │   │           │   ├── requestId.d.ts
│   │   │   │           │   ├── requestId.d.ts.map
│   │   │   │           │   ├── requestId.js
│   │   │   │           │   ├── securityHeaders.d.ts
│   │   │   │           │   ├── securityHeaders.d.ts.map
│   │   │   │           │   ├── securityHeaders.js
│   │   │   │           │   ├── sessionMiddleware.d.ts
│   │   │   │           │   ├── sessionMiddleware.d.ts.map
│   │   │   │           │   └── sessionMiddleware.js
│   │   │   │           ├── migrations
│   │   │   │           │   ├── 1750977192747-AutoMigration.d.ts
│   │   │   │           │   ├── 1750977192747-AutoMigration.d.ts.map
│   │   │   │           │   └── 1750977192747-AutoMigration.js
│   │   │   │           ├── modules
│   │   │   │           │   ├── auth
│   │   │   │           │   │   ├── auth.controller.d.ts
│   │   │   │           │   │   ├── auth.controller.d.ts.map
│   │   │   │           │   │   ├── auth.controller.js
│   │   │   │           │   │   ├── auth.service.d.ts
│   │   │   │           │   │   ├── auth.service.d.ts.map
│   │   │   │           │   │   ├── auth.service.js
│   │   │   │           │   │   ├── docs
│   │   │   │           │   │   │   ├── openapi.d.ts
│   │   │   │           │   │   │   ├── openapi.d.ts.map
│   │   │   │           │   │   │   └── openapi.js
│   │   │   │           │   │   ├── middlewares
│   │   │   │           │   │   │   ├── requireAuth.d.ts
│   │   │   │           │   │   │   ├── requireAuth.d.ts.map
│   │   │   │           │   │   │   ├── requireAuth.js
│   │   │   │           │   │   │   ├── requirePlatformAuth.d.ts
│   │   │   │           │   │   │   ├── requirePlatformAuth.d.ts.map
│   │   │   │           │   │   │   └── requirePlatformAuth.js
│   │   │   │           │   │   ├── routes.d.ts
│   │   │   │           │   │   ├── routes.d.ts.map
│   │   │   │           │   │   ├── routes.js
│   │   │   │           │   │   └── utils
│   │   │   │           │   │       ├── password.d.ts
│   │   │   │           │   │       ├── password.d.ts.map
│   │   │   │           │   │       └── password.js
│   │   │   │           │   ├── codecs
│   │   │   │           │   │   ├── permissionCodec.d.ts
│   │   │   │           │   │   ├── permissionCodec.d.ts.map
│   │   │   │           │   │   └── permissionCodec.js
│   │   │   │           │   ├── common
│   │   │   │           │   │   ├── constants
│   │   │   │           │   │   │   ├── system-actions.d.ts
│   │   │   │           │   │   │   ├── system-actions.d.ts.map
│   │   │   │           │   │   │   ├── system-actions.js
│   │   │   │           │   │   │   ├── system-organizationTypes.d.ts
│   │   │   │           │   │   │   ├── system-organizationTypes.d.ts.map
│   │   │   │           │   │   │   ├── system-organizationTypes.js
│   │   │   │           │   │   │   ├── system-organizations.d.ts
│   │   │   │           │   │   │   ├── system-organizations.d.ts.map
│   │   │   │           │   │   │   ├── system-organizations.js
│   │   │   │           │   │   │   ├── system-permissions.d.ts
│   │   │   │           │   │   │   ├── system-permissions.d.ts.map
│   │   │   │           │   │   │   ├── system-permissions.js
│   │   │   │           │   │   │   ├── system-resources.d.ts
│   │   │   │           │   │   │   ├── system-resources.d.ts.map
│   │   │   │           │   │   │   ├── system-resources.js
│   │   │   │           │   │   │   ├── system-role.d.ts
│   │   │   │           │   │   │   ├── system-role.d.ts.map
│   │   │   │           │   │   │   ├── system-role.js
│   │   │   │           │   │   │   ├── system-services.d.ts
│   │   │   │           │   │   │   ├── system-services.d.ts.map
│   │   │   │           │   │   │   └── system-services.js
│   │   │   │           │   │   ├── entities
│   │   │   │           │   │   │   ├── BaseEntity.d.ts
│   │   │   │           │   │   │   ├── BaseEntity.d.ts.map
│   │   │   │           │   │   │   └── BaseEntity.js
│   │   │   │           │   │   ├── enums
│   │   │   │           │   │   │   ├── gender.enum.d.ts
│   │   │   │           │   │   │   ├── gender.enum.d.ts.map
│   │   │   │           │   │   │   ├── gender.enum.js
│   │   │   │           │   │   │   ├── honorific.enum.d.ts
│   │   │   │           │   │   │   ├── honorific.enum.d.ts.map
│   │   │   │           │   │   │   ├── honorific.enum.js
│   │   │   │           │   │   │   ├── order.enum.d.ts
│   │   │   │           │   │   │   ├── order.enum.d.ts.map
│   │   │   │           │   │   │   ├── order.enum.js
│   │   │   │           │   │   │   ├── roleSource.enum.d.ts
│   │   │   │           │   │   │   ├── roleSource.enum.d.ts.map
│   │   │   │           │   │   │   └── roleSource.enum.js
│   │   │   │           │   │   ├── errors
│   │   │   │           │   │   │   ├── BadRequestError.d.ts
│   │   │   │           │   │   │   ├── BadRequestError.d.ts.map
│   │   │   │           │   │   │   ├── BadRequestError.js
│   │   │   │           │   │   │   ├── BaseError.d.ts
│   │   │   │           │   │   │   ├── BaseError.d.ts.map
│   │   │   │           │   │   │   ├── BaseError.js
│   │   │   │           │   │   │   ├── DatabaseConnectionError.d.ts
│   │   │   │           │   │   │   ├── DatabaseConnectionError.d.ts.map
│   │   │   │           │   │   │   ├── DatabaseConnectionError.js
│   │   │   │           │   │   │   ├── FileNotFoundError.d.ts
│   │   │   │           │   │   │   ├── FileNotFoundError.d.ts.map
│   │   │   │           │   │   │   ├── FileNotFoundError.js
│   │   │   │           │   │   │   ├── InternalServerError.d.ts
│   │   │   │           │   │   │   ├── InternalServerError.d.ts.map
│   │   │   │           │   │   │   ├── InternalServerError.js
│   │   │   │           │   │   │   ├── InvocationError.d.ts
│   │   │   │           │   │   │   ├── InvocationError.d.ts.map
│   │   │   │           │   │   │   ├── InvocationError.js
│   │   │   │           │   │   │   ├── NotAuthorizedError.d.ts
│   │   │   │           │   │   │   ├── NotAuthorizedError.d.ts.map
│   │   │   │           │   │   │   ├── NotAuthorizedError.js
│   │   │   │           │   │   │   ├── NotFoundError.d.ts
│   │   │   │           │   │   │   ├── NotFoundError.d.ts.map
│   │   │   │           │   │   │   ├── NotFoundError.js
│   │   │   │           │   │   │   ├── TooManyRequestsError.d.ts
│   │   │   │           │   │   │   ├── TooManyRequestsError.d.ts.map
│   │   │   │           │   │   │   ├── TooManyRequestsError.js
│   │   │   │           │   │   │   ├── UnauthorizedError.d.ts
│   │   │   │           │   │   │   ├── UnauthorizedError.d.ts.map
│   │   │   │           │   │   │   ├── UnauthorizedError.js
│   │   │   │           │   │   │   ├── ValidationError.d.ts
│   │   │   │           │   │   │   ├── ValidationError.d.ts.map
│   │   │   │           │   │   │   └── ValidationError.js
│   │   │   │           │   │   ├── libs
│   │   │   │           │   │   │   ├── BaseSeeder.d.ts
│   │   │   │           │   │   │   ├── BaseSeeder.d.ts.map
│   │   │   │           │   │   │   ├── BaseSeeder.js
│   │   │   │           │   │   │   ├── logger.d.ts
│   │   │   │           │   │   │   ├── logger.d.ts.map
│   │   │   │           │   │   │   ├── logger.js
│   │   │   │           │   │   │   ├── safeCreateEnum.d.ts
│   │   │   │           │   │   │   ├── safeCreateEnum.d.ts.map
│   │   │   │           │   │   │   └── safeCreateEnum.js
│   │   │   │           │   │   ├── middlewares
│   │   │   │           │   │   │   ├── requirePermission.d.ts
│   │   │   │           │   │   │   ├── requirePermission.d.ts.map
│   │   │   │           │   │   │   ├── requirePermission.js
│   │   │   │           │   │   │   ├── requireRole.d.ts
│   │   │   │           │   │   │   ├── requireRole.d.ts.map
│   │   │   │           │   │   │   ├── requireRole.js
│   │   │   │           │   │   │   ├── validateRequest.d.ts
│   │   │   │           │   │   │   ├── validateRequest.d.ts.map
│   │   │   │           │   │   │   └── validateRequest.js
│   │   │   │           │   │   ├── rateLimiter
│   │   │   │           │   │   │   ├── createRateLimiter.d.ts
│   │   │   │           │   │   │   ├── createRateLimiter.d.ts.map
│   │   │   │           │   │   │   ├── createRateLimiter.js
│   │   │   │           │   │   │   ├── strategies.d.ts
│   │   │   │           │   │   │   ├── strategies.d.ts.map
│   │   │   │           │   │   │   └── strategies.js
│   │   │   │           │   │   └── utils
│   │   │   │           │   │       ├── loadFactories.d.ts
│   │   │   │           │   │       ├── loadFactories.d.ts.map
│   │   │   │           │   │       ├── loadFactories.js
│   │   │   │           │   │       ├── loadSeeders.d.ts
│   │   │   │           │   │       ├── loadSeeders.d.ts.map
│   │   │   │           │   │       ├── loadSeeders.js
│   │   │   │           │   │       ├── paginateWithOffset.d.ts
│   │   │   │           │   │       ├── paginateWithOffset.d.ts.map
│   │   │   │           │   │       ├── paginateWithOffset.js
│   │   │   │           │   │       ├── runSeedersInOrder.d.ts
│   │   │   │           │   │       ├── runSeedersInOrder.d.ts.map
│   │   │   │           │   │       ├── runSeedersInOrder.js
│   │   │   │           │   │       ├── waitForEntity.d.ts
│   │   │   │           │   │       ├── waitForEntity.d.ts.map
│   │   │   │           │   │       └── waitForEntity.js
│   │   │   │           │   ├── organization
│   │   │   │           │   │   ├── docs
│   │   │   │           │   │   │   ├── openapi.d.ts
│   │   │   │           │   │   │   ├── openapi.d.ts.map
│   │   │   │           │   │   │   └── openapi.js
│   │   │   │           │   │   ├── entities
│   │   │   │           │   │   │   ├── Organization.d.ts
│   │   │   │           │   │   │   ├── Organization.d.ts.map
│   │   │   │           │   │   │   ├── Organization.js
│   │   │   │           │   │   │   ├── UserOrganizationRole.d.ts
│   │   │   │           │   │   │   ├── UserOrganizationRole.d.ts.map
│   │   │   │           │   │   │   └── UserOrganizationRole.js
│   │   │   │           │   │   ├── factories
│   │   │   │           │   │   │   ├── organization.factory.d.ts
│   │   │   │           │   │   │   ├── organization.factory.d.ts.map
│   │   │   │           │   │   │   └── organization.factory.js
│   │   │   │           │   │   ├── organization.controller.d.ts
│   │   │   │           │   │   ├── organization.controller.d.ts.map
│   │   │   │           │   │   ├── organization.controller.js
│   │   │   │           │   │   ├── organization.service.d.ts
│   │   │   │           │   │   ├── organization.service.d.ts.map
│   │   │   │           │   │   ├── organization.service.js
│   │   │   │           │   │   ├── routes.d.ts
│   │   │   │           │   │   ├── routes.d.ts.map
│   │   │   │           │   │   ├── routes.js
│   │   │   │           │   │   └── seeds
│   │   │   │           │   │       ├── 02-organization-prod.seed.d.ts
│   │   │   │           │   │       ├── 02-organization-prod.seed.d.ts.map
│   │   │   │           │   │       ├── 02-organization-prod.seed.js
│   │   │   │           │   │       ├── 08-userOrganizationRole-prod.seed.d.ts
│   │   │   │           │   │       ├── 08-userOrganizationRole-prod.seed.d.ts.map
│   │   │   │           │   │       └── 08-userOrganizationRole-prod.seed.js
│   │   │   │           │   ├── organizationType
│   │   │   │           │   │   ├── docs
│   │   │   │           │   │   │   ├── openapi.d.ts
│   │   │   │           │   │   │   ├── openapi.d.ts.map
│   │   │   │           │   │   │   └── openapi.js
│   │   │   │           │   │   ├── entities
│   │   │   │           │   │   │   ├── OrganizationType.d.ts
│   │   │   │           │   │   │   ├── OrganizationType.d.ts.map
│   │   │   │           │   │   │   └── OrganizationType.js
│   │   │   │           │   │   ├── organizationType.controller.d.ts
│   │   │   │           │   │   ├── organizationType.controller.d.ts.map
│   │   │   │           │   │   ├── organizationType.controller.js
│   │   │   │           │   │   ├── organizationType.service.d.ts
│   │   │   │           │   │   ├── organizationType.service.d.ts.map
│   │   │   │           │   │   ├── organizationType.service.js
│   │   │   │           │   │   ├── routes.d.ts
│   │   │   │           │   │   ├── routes.d.ts.map
│   │   │   │           │   │   ├── routes.js
│   │   │   │           │   │   └── seeds
│   │   │   │           │   │       ├── 01-organizationType-prod.seed.d.ts
│   │   │   │           │   │       ├── 01-organizationType-prod.seed.d.ts.map
│   │   │   │           │   │       └── 01-organizationType-prod.seed.js
│   │   │   │           │   ├── rbac
│   │   │   │           │   │   ├── entities
│   │   │   │           │   │   │   ├── Action.d.ts
│   │   │   │           │   │   │   ├── Action.d.ts.map
│   │   │   │           │   │   │   ├── Action.js
│   │   │   │           │   │   │   ├── Permission.d.ts
│   │   │   │           │   │   │   ├── Permission.d.ts.map
│   │   │   │           │   │   │   ├── Permission.js
│   │   │   │           │   │   │   ├── PermissionAction.d.ts
│   │   │   │           │   │   │   ├── PermissionAction.d.ts.map
│   │   │   │           │   │   │   ├── PermissionAction.js
│   │   │   │           │   │   │   ├── Resource.d.ts
│   │   │   │           │   │   │   ├── Resource.d.ts.map
│   │   │   │           │   │   │   ├── Resource.js
│   │   │   │           │   │   │   ├── Role.d.ts
│   │   │   │           │   │   │   ├── Role.d.ts.map
│   │   │   │           │   │   │   ├── Role.js
│   │   │   │           │   │   │   ├── RolePermission.d.ts
│   │   │   │           │   │   │   ├── RolePermission.d.ts.map
│   │   │   │           │   │   │   └── RolePermission.js
│   │   │   │           │   │   ├── seeds
│   │   │   │           │   │   │   ├── 02-action-prod.seed.d.ts
│   │   │   │           │   │   │   ├── 02-action-prod.seed.d.ts.map
│   │   │   │           │   │   │   ├── 02-action-prod.seed.js
│   │   │   │           │   │   │   ├── 03-resource-prod.seed.d.ts
│   │   │   │           │   │   │   ├── 03-resource-prod.seed.d.ts.map
│   │   │   │           │   │   │   ├── 03-resource-prod.seed.js
│   │   │   │           │   │   │   ├── 04-permission-prod.seed.d.ts
│   │   │   │           │   │   │   ├── 04-permission-prod.seed.d.ts.map
│   │   │   │           │   │   │   ├── 04-permission-prod.seed.js
│   │   │   │           │   │   │   ├── 05-role-prod.seed.d.ts
│   │   │   │           │   │   │   ├── 05-role-prod.seed.d.ts.map
│   │   │   │           │   │   │   ├── 05-role-prod.seed.js
│   │   │   │           │   │   │   ├── 06-rolePermission-prod.seed.d.ts
│   │   │   │           │   │   │   ├── 06-rolePermission-prod.seed.d.ts.map
│   │   │   │           │   │   │   └── 06-rolePermission-prod.seed.js
│   │   │   │           │   │   └── utils
│   │   │   │           │   │       ├── extractUserPermissionStrings.d.ts
│   │   │   │           │   │       ├── extractUserPermissionStrings.d.ts.map
│   │   │   │           │   │       ├── extractUserPermissionStrings.js
│   │   │   │           │   │       ├── hasPermission.d.ts
│   │   │   │           │   │       ├── hasPermission.d.ts.map
│   │   │   │           │   │       └── hasPermission.js
│   │   │   │           │   ├── service-auth
│   │   │   │           │   │   ├── client
│   │   │   │           │   │   │   ├── RedisServiceTokenStore.d.ts
│   │   │   │           │   │   │   ├── RedisServiceTokenStore.d.ts.map
│   │   │   │           │   │   │   ├── RedisServiceTokenStore.js
│   │   │   │           │   │   │   ├── ServiceClient.d.ts
│   │   │   │           │   │   │   ├── ServiceClient.d.ts.map
│   │   │   │           │   │   │   └── ServiceClient.js
│   │   │   │           │   │   ├── docs
│   │   │   │           │   │   │   ├── openapi.d.ts
│   │   │   │           │   │   │   ├── openapi.d.ts.map
│   │   │   │           │   │   │   └── openapi.js
│   │   │   │           │   │   ├── entities
│   │   │   │           │   │   │   ├── Service.d.ts
│   │   │   │           │   │   │   ├── Service.d.ts.map
│   │   │   │           │   │   │   ├── Service.js
│   │   │   │           │   │   │   ├── ServiceRole.d.ts
│   │   │   │           │   │   │   ├── ServiceRole.d.ts.map
│   │   │   │           │   │   │   └── ServiceRole.js
│   │   │   │           │   │   ├── jwks
│   │   │   │           │   │   │   ├── jwks.service.d.ts
│   │   │   │           │   │   │   ├── jwks.service.d.ts.map
│   │   │   │           │   │   │   └── jwks.service.js
│   │   │   │           │   │   ├── libs
│   │   │   │           │   │   │   ├── lazyJose.d.ts
│   │   │   │           │   │   │   ├── lazyJose.d.ts.map
│   │   │   │           │   │   │   └── lazyJose.js
│   │   │   │           │   │   ├── middlewares
│   │   │   │           │   │   │   ├── requireServiceAuth.d.ts
│   │   │   │           │   │   │   ├── requireServiceAuth.d.ts.map
│   │   │   │           │   │   │   ├── requireServiceAuth.js
│   │   │   │           │   │   │   ├── requireServiceJwt.d.ts
│   │   │   │           │   │   │   ├── requireServiceJwt.d.ts.map
│   │   │   │           │   │   │   └── requireServiceJwt.js
│   │   │   │           │   │   ├── routes.d.ts
│   │   │   │           │   │   ├── routes.d.ts.map
│   │   │   │           │   │   ├── routes.js
│   │   │   │           │   │   ├── seeds
│   │   │   │           │   │   │   ├── 09-service-prod.seed.d.ts
│   │   │   │           │   │   │   ├── 09-service-prod.seed.d.ts.map
│   │   │   │           │   │   │   └── 09-service-prod.seed.js
│   │   │   │           │   │   ├── serviceAuth.controller.d.ts
│   │   │   │           │   │   ├── serviceAuth.controller.d.ts.map
│   │   │   │           │   │   ├── serviceAuth.controller.js
│   │   │   │           │   │   ├── serviceToken.service.d.ts
│   │   │   │           │   │   ├── serviceToken.service.d.ts.map
│   │   │   │           │   │   ├── serviceToken.service.js
│   │   │   │           │   │   └── utils
│   │   │   │           │   │       ├── verifyWithJwks.d.ts
│   │   │   │           │   │       ├── verifyWithJwks.d.ts.map
│   │   │   │           │   │       └── verifyWithJwks.js
│   │   │   │           │   ├── test
│   │   │   │           │   │   ├── docs
│   │   │   │           │   │   │   ├── openapi.d.ts
│   │   │   │           │   │   │   ├── openapi.d.ts.map
│   │   │   │           │   │   │   └── openapi.js
│   │   │   │           │   │   ├── routes.d.ts
│   │   │   │           │   │   ├── routes.d.ts.map
│   │   │   │           │   │   ├── routes.js
│   │   │   │           │   │   ├── test.controller.d.ts
│   │   │   │           │   │   ├── test.controller.d.ts.map
│   │   │   │           │   │   └── test.controller.js
│   │   │   │           │   └── user
│   │   │   │           │       ├── docs
│   │   │   │           │       │   ├── openapi.d.ts
│   │   │   │           │       │   ├── openapi.d.ts.map
│   │   │   │           │       │   └── openapi.js
│   │   │   │           │       ├── entities
│   │   │   │           │       │   ├── User.d.ts
│   │   │   │           │       │   ├── User.d.ts.map
│   │   │   │           │       │   └── User.js
│   │   │   │           │       ├── enums
│   │   │   │           │       │   ├── UserOrderByFields.enum.d.ts
│   │   │   │           │       │   ├── UserOrderByFields.enum.d.ts.map
│   │   │   │           │       │   └── UserOrderByFields.enum.js
│   │   │   │           │       ├── factories
│   │   │   │           │       │   ├── user.factory.d.ts
│   │   │   │           │       │   ├── user.factory.d.ts.map
│   │   │   │           │       │   └── user.factory.js
│   │   │   │           │       ├── routes.d.ts
│   │   │   │           │       ├── routes.d.ts.map
│   │   │   │           │       ├── routes.js
│   │   │   │           │       ├── seeds
│   │   │   │           │       │   ├── 07-user-prod.seed.d.ts
│   │   │   │           │       │   ├── 07-user-prod.seed.d.ts.map
│   │   │   │           │       │   ├── 07-user-prod.seed.js
│   │   │   │           │       │   ├── 08-user.seed.d.ts
│   │   │   │           │       │   ├── 08-user.seed.d.ts.map
│   │   │   │           │       │   └── 08-user.seed.js
│   │   │   │           │       ├── user.controller.d.ts
│   │   │   │           │       ├── user.controller.d.ts.map
│   │   │   │           │       ├── user.controller.js
│   │   │   │           │       ├── user.service.d.ts
│   │   │   │           │       ├── user.service.d.ts.map
│   │   │   │           │       └── user.service.js
│   │   │   │           ├── swagger
│   │   │   │           │   ├── swagger.d.ts
│   │   │   │           │   ├── swagger.d.ts.map
│   │   │   │           │   └── swagger.js
│   │   │   │           └── types
│   │   │   │               └── express
│   │   │   │                   └── index.d.js
│   │   │   ├── libs
│   │   │   │   ├── server-common
│   │   │   │   │   └── src
│   │   │   │   │       ├── index.js
│   │   │   │   │       └── utils
│   │   │   │   │           └── rollup.utils.js
│   │   │   │   └── shared-schema
│   │   │   │       └── src
│   │   │   │           ├── constants
│   │   │   │           │   ├── index.js
│   │   │   │           │   ├── organizationFilter.js
│   │   │   │           │   ├── organizationOrderByField.js
│   │   │   │           │   ├── organizationTypeFilter.js
│   │   │   │           │   ├── organizationTypeOrderByField.js
│   │   │   │           │   ├── userOrderByField.js
│   │   │   │           │   └── userStatusFilter.js
│   │   │   │           ├── enums
│   │   │   │           │   ├── gender.enum.js
│   │   │   │           │   ├── honorific.enum.js
│   │   │   │           │   ├── index.js
│   │   │   │           │   ├── order.enum.js
│   │   │   │           │   └── roleSource.enum.js
│   │   │   │           ├── examples
│   │   │   │           │   ├── authExamples.js
│   │   │   │           │   ├── index.js
│   │   │   │           │   ├── organizationExamples.js
│   │   │   │           │   ├── organizationTypeExamples.js
│   │   │   │           │   └── userExamples.js
│   │   │   │           ├── factories
│   │   │   │           │   ├── createOffsetPaginatedResponse.schema.js
│   │   │   │           │   ├── createOffsetPagination.schema.js
│   │   │   │           │   ├── createSuccessResponse.schema.js
│   │   │   │           │   └── index.js
│   │   │   │           ├── index.js
│   │   │   │           ├── libs
│   │   │   │           │   └── z.js
│   │   │   │           ├── modules
│   │   │   │           │   ├── auth
│   │   │   │           │   │   ├── currentUser.schema.js
│   │   │   │           │   │   ├── index.js
│   │   │   │           │   │   └── login.schema.js
│   │   │   │           │   ├── common
│   │   │   │           │   │   ├── idParams.schema.js
│   │   │   │           │   │   └── index.js
│   │   │   │           │   ├── index.js
│   │   │   │           │   ├── organization
│   │   │   │           │   │   ├── index.js
│   │   │   │           │   │   ├── organization.schema.js
│   │   │   │           │   │   ├── organizationCreate.schema.js
│   │   │   │           │   │   ├── organizationPagination.schema.js
│   │   │   │           │   │   └── organizationUpdate.schema.js
│   │   │   │           │   ├── organizationType
│   │   │   │           │   │   ├── index.js
│   │   │   │           │   │   ├── organizationType.schema.js
│   │   │   │           │   │   ├── organizationTypeCreate.schema.js
│   │   │   │           │   │   ├── organizationTypeOptions.schema.js
│   │   │   │           │   │   ├── organizationTypeUpdate.schema.js
│   │   │   │           │   │   └── orgnizationTypePagination.schema.js
│   │   │   │           │   └── user
│   │   │   │           │       ├── index.js
│   │   │   │           │       ├── userAdminUpdateSchema.js
│   │   │   │           │       ├── userAllProfile.schema.js
│   │   │   │           │       ├── userPagination.schema.js
│   │   │   │           │       └── userProfile.schema.js
│   │   │   │           └── types
│   │   │   │               ├── index.js
│   │   │   │               ├── labeledEnumItem.type.js
│   │   │   │               └── paginated-response.type.js
│   │   │   ├── main.js
│   │   │   └── tsconfig.app.tsbuildinfo
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── assets
│   │   │   │   └── .gitkeep
│   │   │   ├── config
│   │   │   │   ├── corsOptions.ts
│   │   │   │   ├── data-source.ts
│   │   │   │   ├── env.ts
│   │   │   │   ├── openapiRegistry.ts
│   │   │   │   └── sessionOptions.ts
│   │   │   ├── createApp.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── database.ts
│   │   │   │   └── redis.ts
│   │   │   ├── loaders
│   │   │   │   └── registerRoutes.ts
│   │   │   ├── main.ts
│   │   │   ├── middlewares
│   │   │   │   ├── currentUser.ts
│   │   │   │   ├── errorHandler.ts
│   │   │   │   ├── requestId.ts
│   │   │   │   ├── securityHeaders.ts
│   │   │   │   └── sessionMiddleware.ts
│   │   │   ├── migrations
│   │   │   │   └── 1750977192747-AutoMigration.ts
│   │   │   ├── modules
│   │   │   │   ├── auth
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── middlewares
│   │   │   │   │   │   ├── requireAuth.ts
│   │   │   │   │   │   └── requirePlatformAuth.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── utils
│   │   │   │   │       └── password.ts
│   │   │   │   ├── codecs
│   │   │   │   │   └── permissionCodec.ts
│   │   │   │   ├── common
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── system-actions.ts
│   │   │   │   │   │   ├── system-organizationTypes.ts
│   │   │   │   │   │   ├── system-organizations.ts
│   │   │   │   │   │   ├── system-permissions.ts
│   │   │   │   │   │   ├── system-resources.ts
│   │   │   │   │   │   ├── system-role.ts
│   │   │   │   │   │   └── system-services.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── BaseEntity.ts
│   │   │   │   │   ├── enums
│   │   │   │   │   │   ├── gender.enum.ts
│   │   │   │   │   │   ├── honorific.enum.ts
│   │   │   │   │   │   ├── order.enum.ts
│   │   │   │   │   │   └── roleSource.enum.ts
│   │   │   │   │   ├── errors
│   │   │   │   │   │   ├── BadRequestError.ts
│   │   │   │   │   │   ├── BaseError.ts
│   │   │   │   │   │   ├── DatabaseConnectionError.ts
│   │   │   │   │   │   ├── FileNotFoundError.ts
│   │   │   │   │   │   ├── InternalServerError.ts
│   │   │   │   │   │   ├── InvocationError.ts
│   │   │   │   │   │   ├── NotAuthorizedError.ts
│   │   │   │   │   │   ├── NotFoundError.ts
│   │   │   │   │   │   ├── TooManyRequestsError.ts
│   │   │   │   │   │   ├── UnauthorizedError.ts
│   │   │   │   │   │   └── ValidationError.ts
│   │   │   │   │   ├── libs
│   │   │   │   │   │   ├── BaseSeeder.ts
│   │   │   │   │   │   ├── logger.ts
│   │   │   │   │   │   └── safeCreateEnum.ts
│   │   │   │   │   ├── middlewares
│   │   │   │   │   │   ├── requirePermission.ts
│   │   │   │   │   │   ├── requireRole.ts
│   │   │   │   │   │   └── validateRequest.ts
│   │   │   │   │   ├── rateLimiter
│   │   │   │   │   │   ├── createRateLimiter.ts
│   │   │   │   │   │   └── strategies.ts
│   │   │   │   │   └── utils
│   │   │   │   │       ├── loadFactories.ts
│   │   │   │   │       ├── loadSeeders.ts
│   │   │   │   │       ├── paginateWithOffset.ts
│   │   │   │   │       ├── runSeedersInOrder.ts
│   │   │   │   │       └── waitForEntity.ts
│   │   │   │   ├── organization
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   ├── Organization.ts
│   │   │   │   │   │   └── UserOrganizationRole.ts
│   │   │   │   │   ├── factories
│   │   │   │   │   │   └── organization.factory.ts
│   │   │   │   │   ├── organization.controller.ts
│   │   │   │   │   ├── organization.service.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── seeds
│   │   │   │   │       ├── 02-organization-prod.seed.ts
│   │   │   │   │       └── 08-userOrganizationRole-prod.seed.ts
│   │   │   │   ├── organizationType
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── OrganizationType.ts
│   │   │   │   │   ├── organizationType.controller.ts
│   │   │   │   │   ├── organizationType.service.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── seeds
│   │   │   │   │       └── 01-organizationType-prod.seed.ts
│   │   │   │   ├── rbac
│   │   │   │   │   ├── entities
│   │   │   │   │   │   ├── Action.ts
│   │   │   │   │   │   ├── Permission.ts
│   │   │   │   │   │   ├── PermissionAction.ts
│   │   │   │   │   │   ├── Resource.ts
│   │   │   │   │   │   ├── Role.ts
│   │   │   │   │   │   └── RolePermission.ts
│   │   │   │   │   ├── seeds
│   │   │   │   │   │   ├── 02-action-prod.seed.ts
│   │   │   │   │   │   ├── 03-resource-prod.seed.ts
│   │   │   │   │   │   ├── 04-permission-prod.seed.ts
│   │   │   │   │   │   ├── 05-role-prod.seed.ts
│   │   │   │   │   │   └── 06-rolePermission-prod.seed.ts
│   │   │   │   │   └── utils
│   │   │   │   │       ├── extractUserPermissionStrings.ts
│   │   │   │   │       └── hasPermission.ts
│   │   │   │   ├── service-auth
│   │   │   │   │   ├── client
│   │   │   │   │   │   ├── RedisServiceTokenStore.ts
│   │   │   │   │   │   └── ServiceClient.ts
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   ├── Service.ts
│   │   │   │   │   │   └── ServiceRole.ts
│   │   │   │   │   ├── jwks
│   │   │   │   │   │   └── jwks.service.ts
│   │   │   │   │   ├── keys
│   │   │   │   │   │   ├── private-pem.example
│   │   │   │   │   │   ├── private.pem
│   │   │   │   │   │   ├── public-pem.example
│   │   │   │   │   │   └── public.pem
│   │   │   │   │   ├── libs
│   │   │   │   │   │   └── lazyJose.ts
│   │   │   │   │   ├── middlewares
│   │   │   │   │   │   ├── requireServiceAuth.ts
│   │   │   │   │   │   └── requireServiceJwt.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   ├── seeds
│   │   │   │   │   │   └── 09-service-prod.seed.ts
│   │   │   │   │   ├── serviceAuth.controller.ts
│   │   │   │   │   ├── serviceToken.service.ts
│   │   │   │   │   └── utils
│   │   │   │   │       └── verifyWithJwks.ts
│   │   │   │   ├── test
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── test.controller.ts
│   │   │   │   └── user
│   │   │   │       ├── docs
│   │   │   │       │   └── openapi.ts
│   │   │   │       ├── entities
│   │   │   │       │   └── User.ts
│   │   │   │       ├── enums
│   │   │   │       │   └── UserOrderByFields.enum.ts
│   │   │   │       ├── factories
│   │   │   │       │   └── user.factory.ts
│   │   │   │       ├── routes.ts
│   │   │   │       ├── seeds
│   │   │   │       │   ├── 07-user-prod.seed.ts
│   │   │   │       │   └── 08-user.seed.ts
│   │   │   │       ├── user.controller.ts
│   │   │   │       └── user.service.ts
│   │   │   ├── swagger
│   │   │   │   └── swagger.ts
│   │   │   └── types
│   │   │       └── express
│   │   │           └── index.d.ts
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.spec.json
│   └── portfolio
│       ├── .swcrc
│       ├── eslint.config.mjs
│       ├── index.d.ts
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── public
│       │   ├── .gitkeep
│       │   ├── favicon.ico
│       │   └── images
│       │       ├── avatar-01.png
│       │       └── avatar-02.png
│       ├── src
│       │   ├── app
│       │   │   ├── about
│       │   │   │   └── page.tsx
│       │   │   ├── api
│       │   │   │   └── hello
│       │   │   │       └── route.ts
│       │   │   ├── error.tsx
│       │   │   ├── global.css
│       │   │   ├── layout.tsx
│       │   │   ├── loading.tsx
│       │   │   ├── not-found.tsx
│       │   │   ├── page.tsx
│       │   │   └── skill
│       │   │       └── page.tsx
│       │   └── components
│       │       ├── LandingAnimationPage.tsx
│       │       ├── PageLayout.tsx
│       │       ├── home
│       │       │   ├── AboutSectionLayout
│       │       │   │   └── NumberRiserComponent.tsx
│       │       │   ├── AboutSectionLayout.tsx
│       │       │   ├── HeroSectionLayout.tsx
│       │       │   ├── SkillSectionLayout
│       │       │   │   ├── EducationCard.tsx
│       │       │   │   └── WorkCard.tsx
│       │       │   ├── SkillSectionLayout.tsx
│       │       │   └── heroSectionLayout
│       │       │       ├── AvatarImage.tsx
│       │       │       ├── Info.tsx
│       │       │       └── MediaIcons.tsx
│       │       └── navbar
│       │           ├── TextBrand.tsx
│       │           └── TopNav.tsx
│       ├── tailwind.config.js
│       └── tsconfig.json
├── eslint.config.mjs
├── jest.config.ts
├── jest.preset.js
├── libs
│   ├── server-common
│   │   ├── .spec.swcrc
│   │   ├── .swcrc
│   │   ├── README.md
│   │   ├── dist
│   │   │   ├── index.esm.d.ts
│   │   │   ├── index.esm.js
│   │   │   └── src
│   │   │       ├── index.d.ts
│   │   │       ├── index.d.ts.map
│   │   │       └── utils
│   │   │           ├── rollup.utils.d.ts
│   │   │           └── rollup.utils.d.ts.map
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── utils
│   │   │       └── rollup.utils.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.spec.json
│   ├── shared-hooks
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── index.ts
│   │   │       ├── useClickOutside.tsx
│   │   │       ├── useControlledState.tsx
│   │   │       ├── useDebouncedCallback.tsx
│   │   │       ├── usePagination.tsx
│   │   │       ├── useTimer.tsx
│   │   │       └── useWindowSize.tsx
│   │   ├── tsconfig.json
│   │   └── tsconfig.lib.json
│   ├── shared-schema
│   │   ├── .swcrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── packageBuild
│   │   │   └── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── constants
│   │   │   │   ├── index.ts
│   │   │   │   ├── organizationFilter.ts
│   │   │   │   ├── organizationOrderByField.ts
│   │   │   │   ├── organizationTypeFilter.ts
│   │   │   │   ├── organizationTypeOrderByField.ts
│   │   │   │   ├── userOrderByField.ts
│   │   │   │   └── userStatusFilter.ts
│   │   │   ├── enums
│   │   │   │   ├── gender.enum.ts
│   │   │   │   ├── honorific.enum.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── order.enum.ts
│   │   │   │   └── roleSource.enum.ts
│   │   │   ├── examples
│   │   │   │   ├── authExamples.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── organizationExamples.ts
│   │   │   │   ├── organizationTypeExamples.ts
│   │   │   │   └── userExamples.ts
│   │   │   ├── factories
│   │   │   │   ├── createOffsetPaginatedResponse.schema.ts
│   │   │   │   ├── createOffsetPagination.schema.ts
│   │   │   │   ├── createSuccessResponse.schema.ts
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── libs
│   │   │   │   └── z.ts
│   │   │   ├── modules
│   │   │   │   ├── auth
│   │   │   │   │   ├── currentUser.schema.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── login.schema.ts
│   │   │   │   ├── common
│   │   │   │   │   ├── idParams.schema.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── organization
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── organization.schema.ts
│   │   │   │   │   ├── organizationCreate.schema.ts
│   │   │   │   │   ├── organizationPagination.schema.ts
│   │   │   │   │   └── organizationUpdate.schema.ts
│   │   │   │   ├── organizationType
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── organizationType.schema.ts
│   │   │   │   │   ├── organizationTypeCreate.schema.ts
│   │   │   │   │   ├── organizationTypeOptions.schema.ts
│   │   │   │   │   ├── organizationTypeUpdate.schema.ts
│   │   │   │   │   └── orgnizationTypePagination.schema.ts
│   │   │   │   └── user
│   │   │   │       ├── index.ts
│   │   │   │       ├── userAdminUpdateSchema.ts
│   │   │   │       ├── userAllProfile.schema.ts
│   │   │   │       ├── userPagination.schema.ts
│   │   │   │       └── userProfile.schema.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       ├── labeledEnumItem.type.ts
│   │   │       └── paginated-response.type.ts
│   │   ├── tsconfig.json
│   │   └── tsconfig.lib.json
│   ├── shared-ui-client
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── animations
│   │   │       │   ├── BreathingGlow.stories.tsx
│   │   │       │   ├── BreathingGlow.tsx
│   │   │       │   ├── CardParallax.stories.tsx
│   │   │       │   ├── CardParallax.tsx
│   │   │       │   ├── NumberRiser.stories.tsx
│   │   │       │   ├── NumberRiser.tsx
│   │   │       │   └── index.ts
│   │   │       ├── general
│   │   │       │   ├── Button
│   │   │       │   │   ├── FrankToggleButton.stories.tsx
│   │   │       │   │   ├── FrankToggleButton.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── navigation
│   │   │       │   ├── NavLinks
│   │   │       │   │   ├── NavLinkClient.stories.tsx
│   │   │       │   │   ├── NavLinkClient.tsx
│   │   │       │   │   └── index.tsx
│   │   │       │   ├── Tabs
│   │   │       │   │   ├── CalendarViewSwitcher.stories.tsx
│   │   │       │   │   ├── CalendarViewSwitcher.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       └── typography
│   │   │           ├── Text
│   │   │           │   ├── ReadMoreText.stories.tsx
│   │   │           │   ├── ReadMoreText.tsx
│   │   │           │   └── index.ts
│   │   │           └── index.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.storybook.json
│   ├── shared-ui-core
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── Background
│   │   │       │   ├── FrankTiledBackground.stories.tsx
│   │   │       │   ├── FrankTiledBackground.tsx
│   │   │       │   └── index.ts
│   │   │       ├── feedback
│   │   │       │   ├── Loading
│   │   │       │   │   ├── FrankLoadingSignature.module.css
│   │   │       │   │   ├── FrankLoadingSignature.stories.tsx
│   │   │       │   │   ├── FrankLoadingSignature.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── icons
│   │   │       │   ├── SVGIcon
│   │   │       │   │   ├── FrankSVGIcon.stories.tsx
│   │   │       │   │   ├── FrankSVGIcon.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── navigation
│   │   │       │   ├── Link
│   │   │       │   │   ├── SocialMediaLinks.stories.tsx
│   │   │       │   │   ├── SocialMediaLinks.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Tabs
│   │   │       │   │   ├── FrankArrowSwitcher.stories.tsx
│   │   │       │   │   ├── FrankArrowSwitcher.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── index.ts
│   │   │       │   └── navigation
│   │   │       └── staticEffects
│   │   │           ├── HeroTitle.stories.tsx
│   │   │           ├── HeroTitle.tsx
│   │   │           ├── LinearGradientTextColor.stories.tsx
│   │   │           ├── LinearGradientTextColor.tsx
│   │   │           └── index.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.storybook.json
│   ├── shared-ui-hero-client
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── dataDisplay
│   │   │       │   ├── Calendar
│   │   │       │   │   ├── FrankBigCalendar.stories.tsx
│   │   │       │   │   ├── FrankBigCalendar.tsx
│   │   │       │   │   ├── FrankBigCalendarParts
│   │   │       │   │   │   ├── CalendarGrid.stories.tsx
│   │   │       │   │   │   ├── CalendarGrid.tsx
│   │   │       │   │   │   ├── CalendarShiftComponent.stories.tsx
│   │   │       │   │   │   ├── CalendarShiftComponent.tsx
│   │   │       │   │   │   ├── CurrentTimeIndicator.tsx
│   │   │       │   │   │   ├── DraggableShift.tsx
│   │   │       │   │   │   ├── DropContainer.tsx
│   │   │       │   │   │   ├── ListDay.stories.tsx
│   │   │       │   │   │   ├── ListDay.tsx
│   │   │       │   │   │   ├── ListDayBookingEvent.tsx
│   │   │       │   │   │   ├── ListDayBookingStatusChip.tsx
│   │   │       │   │   │   ├── ResizableShift.tsx
│   │   │       │   │   │   ├── TimeGridDay.stories.tsx
│   │   │       │   │   │   ├── TimeGridDay.tsx
│   │   │       │   │   │   ├── TimeGridWeek.stories.tsx
│   │   │       │   │   │   ├── TimeGridWeek.tsx
│   │   │       │   │   │   ├── TimeScale.stories.tsx
│   │   │       │   │   │   ├── TimeScale.tsx
│   │   │       │   │   │   ├── calendarSampleData.ts
│   │   │       │   │   │   └── listDayBookingEvent.module.css
│   │   │       │   │   ├── FrankCalendar.stories.tsx
│   │   │       │   │   ├── FrankCalendar.tsx
│   │   │       │   │   ├── FrankFullCalendar.module.css
│   │   │       │   │   ├── FrankFullCalendar.stories.tsx
│   │   │       │   │   ├── FrankFullCalendar.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Carousel
│   │   │       │   │   ├── FrankCarousel.stories.tsx
│   │   │       │   │   ├── FrankCarousel.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── feedback
│   │   │       │   ├── Modal
│   │   │       │   │   ├── FrankModal.stories.tsx
│   │   │       │   │   ├── FrankModal.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Popover
│   │   │       │   │   ├── FrankPopover.stories.tsx
│   │   │       │   │   ├── FrankPopover.tsx
│   │   │       │   │   ├── FrankPopoverGeneral.stories.tsx
│   │   │       │   │   ├── FrankPopoverGeneral.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── form
│   │   │       │   ├── AutoComplete
│   │   │       │   │   ├── FrankAutocomplete.stories.tsx
│   │   │       │   │   ├── FrankAutocomplete.tsx
│   │   │       │   │   ├── NoqPublicSearchBar.stories.tsx
│   │   │       │   │   ├── NoqPublicSearchBar.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Checkbox
│   │   │       │   │   ├── FrankCheckbox.stories.tsx
│   │   │       │   │   ├── FrankCheckbox.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Checkbox-Group
│   │   │       │   │   ├── FrankCheckboxGroup.stories.tsx
│   │   │       │   │   ├── FrankCheckboxGroup.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── DatePicker
│   │   │       │   │   ├── FrankDatePicker.stories.tsx
│   │   │       │   │   ├── FrankDatePicker.tsx
│   │   │       │   │   ├── NoqDatePicker.stories.tsx
│   │   │       │   │   ├── NoqDatePicker.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Input
│   │   │       │   │   ├── FrankInputBase.stories.tsx
│   │   │       │   │   ├── FrankInputBase.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Radio-Group
│   │   │       │   │   ├── FrankRadioGroupBasic.stories.tsx
│   │   │       │   │   ├── FrankRadioGroupBasic.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Time-Input
│   │   │       │   │   ├── FrankTimeInput.stories.tsx
│   │   │       │   │   ├── FrankTimeInput.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── general
│   │   │       │   ├── Accordion
│   │   │       │   │   ├── FrankAccordion.stories.tsx
│   │   │       │   │   ├── FrankAccordion.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       └── navigation
│   │   │           ├── Navbar
│   │   │           │   ├── FrankTopNav.stories.tsx
│   │   │           │   ├── FrankTopNav.tsx
│   │   │           │   ├── NavLink.tsx
│   │   │           │   └── index.ts
│   │   │           ├── Sidebar
│   │   │           ├── Tabs
│   │   │           │   ├── FrankTabs.stories.tsx
│   │   │           │   ├── FrankTabs.tsx
│   │   │           │   └── index.ts
│   │   │           └── index.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.storybook.json
│   ├── shared-ui-hero-ssr
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── dataDisplay
│   │   │       │   ├── Avatar
│   │   │       │   │   ├── FrankAvatar.stories.tsx
│   │   │       │   │   ├── FrankAvatar.tsx
│   │   │       │   │   ├── UserListItem.stories.tsx
│   │   │       │   │   ├── UserListItem.tsx
│   │   │       │   │   └── index.tsx
│   │   │       │   ├── Card
│   │   │       │   │   ├── FrankCard.stories.tsx
│   │   │       │   │   ├── FrankCard.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Progress
│   │   │       │   │   ├── FrankProgress.stories.tsx
│   │   │       │   │   ├── FrankProgress.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── feedback
│   │   │       │   ├── Spinner
│   │   │       │   │   ├── FrankSpinner.stories.tsx
│   │   │       │   │   ├── FrankSpinner.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       └── general
│   │   │           ├── Button
│   │   │           │   ├── FrankButtonBase.stories.tsx
│   │   │           │   ├── FrankButtonBase.tsx
│   │   │           │   ├── NoqButton.stories.tsx
│   │   │           │   ├── NoqButton.tsx
│   │   │           │   └── index.ts
│   │   │           └── index.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.storybook.json
│   ├── shared-ui-shadcn
│   │   ├── .babelrc
│   │   ├── .storybook
│   │   │   ├── main.ts
│   │   │   └── preview.tsx
│   │   ├── README.md
│   │   ├── components.json
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── rollup.config.cjs
│   │   ├── src
│   │   │   ├── components
│   │   │   │   └── general
│   │   │   │       └── button
│   │   │   │           ├── ButtonShadcn.tsx
│   │   │   │           └── button.stories.tsx
│   │   │   ├── hooks
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   │   ├── shared-ui-shadcn.stories.tsx
│   │   │   │   ├── shared-ui-shadcn.tsx
│   │   │   │   ├── sidebar
│   │   │   │   └── utils.ts
│   │   │   ├── styles
│   │   │   │   ├── chadcn.css
│   │   │   │   └── globals.css
│   │   │   └── ui
│   │   │       └── button.tsx
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.storybook.json
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
│   │   │   ├── types
│   │   │   │   └── globalTypes.ts
│   │   │   └── utils
│   │   │       ├── __test__
│   │   │       │   ├── dateUtils.test.ts
│   │   │       │   └── testUtils.test.ts
│   │   │       ├── chatUtils.ts
│   │   │       ├── colorUtils.ts
│   │   │       ├── dateUtils.ts
│   │   │       ├── errorUtils.ts
│   │   │       ├── eventUtils.ts
│   │   │       ├── imageUtils.ts
│   │   │       ├── tableUtils.ts
│   │   │       ├── testUtils.ts
│   │   │       └── textUtils.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.spec.json
│   └── storybook-host
│       ├── .babelrc
│       ├── .storybook
│       │   ├── main.ts
│       │   ├── mocks
│       │   │   ├── mock-api.ts
│       │   │   ├── mock-next-image.tsx
│       │   │   ├── mock-next-link.tsx
│       │   │   └── mock-next-navigation.ts
│       │   └── preview.tsx
│       ├── README.md
│       ├── eslint.config.mjs
│       ├── package.json
│       ├── postcss.config.js
│       ├── src
│       │   ├── index.ts
│       │   ├── lib
│       │   │   └── storybook-host.tsx
│       │   └── styles
│       │       └── globals.css
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── tsconfig.lib.json
│       └── tsconfig.storybook.json
├── nx.json
├── package-lock.json
├── package.json
├── scripts
│   ├── add-shadcn-component.ts
│   ├── argon2Test.ts
│   └── generateTree.ts
├── structure.md
├── tsconfig.base.json
└── tsconfig.json

```