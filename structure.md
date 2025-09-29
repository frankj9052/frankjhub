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
├── .rollup.cache
│   └── home
│       └── frank
│           └── projects
│               └── frankjhub
│                   └── tsconfig.tsbuildinfo
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── README.md
├── apps
│   ├── admin-portal
│   │   ├── .env.development
│   │   ├── .env.example
│   │   ├── .env.production
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
│   │   ├── scripts
│   │   │   └── collectSourceFiles.ts
│   │   ├── src
│   │   │   ├── app
│   │   │   │   ├── (auth)
│   │   │   │   │   └── login
│   │   │   │   │       ├── LoginForm.tsx
│   │   │   │   │       ├── layout.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── actions
│   │   │   │   │   └── auth.ts
│   │   │   │   ├── api
│   │   │   │   │   └── hello
│   │   │   │   │       └── route.ts
│   │   │   │   ├── dashboard
│   │   │   │   │   ├── actions
│   │   │   │   │   │   ├── ActionTable.tsx
│   │   │   │   │   │   ├── BottomContent.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── [id]
│   │   │   │   │   │   │       ├── EditActionForm.tsx
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── invitations
│   │   │   │   │   │   ├── BottomContent.tsx
│   │   │   │   │   │   ├── InvitationTable.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── organization-roles
│   │   │   │   │   │   ├── OrganizationRoleForm.tsx
│   │   │   │   │   │   ├── OrganizationSelection.tsx
│   │   │   │   │   │   ├── RoleSelection.tsx
│   │   │   │   │   │   ├── UserSelection.tsx
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
│   │   │   │   │   ├── organizations
│   │   │   │   │   │   ├── BottomContent.tsx
│   │   │   │   │   │   ├── OrganizationTable.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── [id]
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── permissions
│   │   │   │   │   │   ├── BottomContent.tsx
│   │   │   │   │   │   ├── PermissionTable.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── [id]
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── resources
│   │   │   │   │   │   ├── BottomContent.tsx
│   │   │   │   │   │   ├── ResourceTable.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── [id]
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── roles
│   │   │   │   │   │   ├── BottomContent.tsx
│   │   │   │   │   │   ├── RoleTable.tsx
│   │   │   │   │   │   ├── TopContent.tsx
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── [id]
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── page.tsx
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
│   │   │   │   │   ├── CreateActionForm.tsx
│   │   │   │   │   ├── CreateOrganizationForm.tsx
│   │   │   │   │   ├── CreateOrganizationTypeForm.tsx
│   │   │   │   │   ├── CreatePermissionForm.tsx
│   │   │   │   │   ├── CreateResourceForm.tsx
│   │   │   │   │   ├── CreateRoleForm.tsx
│   │   │   │   │   ├── EditOrganizationForm.tsx
│   │   │   │   │   ├── EditPermissionForm.tsx
│   │   │   │   │   ├── EditResourceForm.tsx
│   │   │   │   │   ├── EditRoleForm.tsx
│   │   │   │   │   └── IssueInvitationForm.tsx
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
│   │   │   │   ├── axios
│   │   │   │   │   ├── client.ts
│   │   │   │   │   ├── instance.ts
│   │   │   │   │   └── server.ts
│   │   │   │   └── redux
│   │   │   │       ├── createAppAsyncThunk.ts
│   │   │   │       ├── index.ts
│   │   │   │       ├── rootReducer.ts
│   │   │   │       ├── slices
│   │   │   │       │   ├── actionSlice
│   │   │   │       │   │   ├── actionSlice.ts
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   └── thunk.ts
│   │   │   │       │   ├── currentUserSlice
│   │   │   │       │   │   ├── currentUserSlice.tsx
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   └── thunks.ts
│   │   │   │       │   ├── index.ts
│   │   │   │       │   ├── invitationSlice
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── invitation.slice.ts
│   │   │   │       │   │   └── thunk.ts
│   │   │   │       │   ├── organizationSlice
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── organizationSlice.ts
│   │   │   │       │   │   └── thunk.ts
│   │   │   │       │   ├── organizationTypeSlice
│   │   │   │       │   │   ├── index.tsx
│   │   │   │       │   │   ├── orgnizationTypeSlice.ts
│   │   │   │       │   │   └── thunk.ts
│   │   │   │       │   ├── permissionSlice
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── permissionSlice.ts
│   │   │   │       │   │   └── thunk.ts
│   │   │   │       │   ├── resourceSlice
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── resourceSlice.ts
│   │   │   │       │   │   └── thunk.ts
│   │   │   │       │   ├── roleSlice
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── roleSlice.ts
│   │   │   │       │   │   └── thunk.ts
│   │   │   │       │   ├── testSlice
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   └── testSlice.tsx
│   │   │   │       │   ├── userOrganizationRoleSlice
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── thunk.ts
│   │   │   │       │   │   └── userOrganizationRoleSlice.ts
│   │   │   │       │   └── usersSlice
│   │   │   │       │       ├── index.ts
│   │   │   │       │       ├── thunk.ts
│   │   │   │       │       └── usersSlice.tsx
│   │   │   │       └── store.ts
│   │   │   ├── services
│   │   │   │   ├── action.service.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── invitation.service.ts
│   │   │   │   ├── organization.service.ts
│   │   │   │   ├── organizationType.ts
│   │   │   │   ├── permission.service.ts
│   │   │   │   ├── resource.service.ts
│   │   │   │   ├── role.service.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── userOrganizationRole.service.ts
│   │   │   ├── types
│   │   │   │   └── index.d.ts
│   │   │   └── utils
│   │   │       └── tableClassnames.ts
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   ├── clinic-portal
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
│   │   ├── scripts
│   │   │   └── collectSourceFiles.ts
│   │   ├── src
│   │   │   ├── app
│   │   │   │   ├── (auth)
│   │   │   │   │   └── root-register
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── api
│   │   │   │   │   └── hello
│   │   │   │   │       └── route.ts
│   │   │   │   ├── global.css
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   ├── Providers.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── cards
│   │   │   │   │   └── registerCard.tsx
│   │   │   │   └── forms
│   │   │   │       └── root-register.form.tsx
│   │   │   └── libs
│   │   │       └── redux
│   │   │           ├── createAppAsyncThunk.ts
│   │   │           ├── index.ts
│   │   │           ├── rootReducer.ts
│   │   │           ├── slices
│   │   │           │   ├── index.ts
│   │   │           │   └── testSlice
│   │   │           │       ├── index.ts
│   │   │           │       └── testSlice.tsx
│   │   │           └── store.ts
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   ├── main-server
│   │   ├── .env.development
│   │   ├── .env.example
│   │   ├── .env.production
│   │   ├── .spec.swcrc
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── scripts
│   │   │   ├── collectSourceFiles.ts
│   │   │   └── register-pgvector.cjs
│   │   ├── src
│   │   │   ├── assets
│   │   │   │   └── .gitkeep
│   │   │   ├── config
│   │   │   │   ├── corsOptions.ts
│   │   │   │   ├── data-source.ts
│   │   │   │   ├── env.ts
│   │   │   │   ├── openapiRegistry.ts
│   │   │   │   ├── rawBodyOption.ts
│   │   │   │   ├── sessionByHost.ts
│   │   │   │   └── sessionOptions.ts
│   │   │   ├── createApp.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── database.ts
│   │   │   │   └── redis.ts
│   │   │   ├── jobs
│   │   │   │   ├── constants.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── invitations.expire.ts
│   │   │   │   ├── jobFactory.ts
│   │   │   │   └── types.ts
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
│   │   │   │   └── 1758729199626-AutoMigration.ts
│   │   │   ├── modules
│   │   │   │   ├── Invitation
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── Invitation.ts
│   │   │   │   │   ├── invitation.controller.ts
│   │   │   │   │   ├── invitation.service.ts
│   │   │   │   │   └── routes.ts
│   │   │   │   ├── action
│   │   │   │   │   ├── action.controller.ts
│   │   │   │   │   ├── action.service.ts
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── Action.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── seeds
│   │   │   │   │       └── 02-action-prod.seed.ts
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
│   │   │   │   ├── clinic
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── Clinic.ts
│   │   │   │   │   ├── factories
│   │   │   │   │   │   ├── accreditations.ts
│   │   │   │   │   │   ├── clinic.factory.ts
│   │   │   │   │   │   ├── clinic_tags.ts
│   │   │   │   │   │   └── northYorkPostalCode.ts
│   │   │   │   │   └── seeds
│   │   │   │   │       └── 09-clinic.seed.ts
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
│   │   │   │   │   │   └── order.enum.ts
│   │   │   │   │   ├── errors
│   │   │   │   │   │   ├── BadRequestError.ts
│   │   │   │   │   │   ├── BaseError.ts
│   │   │   │   │   │   ├── DatabaseConnectionError.ts
│   │   │   │   │   │   ├── FileNotFoundError.ts
│   │   │   │   │   │   ├── ForbiddenError.ts
│   │   │   │   │   │   ├── InternalServerError.ts
│   │   │   │   │   │   ├── InvocationError.ts
│   │   │   │   │   │   ├── NotAuthorizedError.ts
│   │   │   │   │   │   ├── NotFoundError.ts
│   │   │   │   │   │   ├── RedisConnectionError.ts
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
│   │   │   │   │       ├── applyFilters.ts
│   │   │   │   │       ├── loadFactories.ts
│   │   │   │   │       ├── loadSeeders.ts
│   │   │   │   │       ├── paginateWithOffset.ts
│   │   │   │   │       ├── registerErrorResponseFromFiles.ts
│   │   │   │   │       ├── runSeedersInOrder.ts
│   │   │   │   │       └── waitForEntity.ts
│   │   │   │   ├── email
│   │   │   │   │   ├── adapters
│   │   │   │   │   │   └── resend.provider.ts
│   │   │   │   │   ├── application
│   │   │   │   │   │   └── email.usecases.ts
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── email.module.ts
│   │   │   │   │   ├── email.service.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   ├── EmailOutbox.ts
│   │   │   │   │   │   ├── EmailReceipt.ts
│   │   │   │   │   │   └── EmailSuppression.ts
│   │   │   │   │   ├── infra
│   │   │   │   │   │   ├── email.controller.ts
│   │   │   │   │   │   ├── resend.webhook.controller.ts
│   │   │   │   │   │   └── verify-resend-webhook.ts
│   │   │   │   │   ├── persistence
│   │   │   │   │   │   └── email.repository.ts
│   │   │   │   │   ├── queue
│   │   │   │   │   │   ├── bullmq.email.queue.ts
│   │   │   │   │   │   └── workers
│   │   │   │   │   │       └── email.worker.ts
│   │   │   │   │   ├── renderer
│   │   │   │   │   │   └── mjml.renderer.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── template
│   │   │   │   │       └── transactional
│   │   │   │   │           └── invitation.mjml
│   │   │   │   ├── organization
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── Organization.ts
│   │   │   │   │   ├── factories
│   │   │   │   │   │   └── organization.factory.ts
│   │   │   │   │   ├── organization.controller.ts
│   │   │   │   │   ├── organization.service.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── seeds
│   │   │   │   │       └── 02-organization-prod.seed.ts
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
│   │   │   │   ├── permission
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   ├── Permission.ts
│   │   │   │   │   │   └── PermissionAction.ts
│   │   │   │   │   ├── permission.controller.ts
│   │   │   │   │   ├── permission.service.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   ├── seeds
│   │   │   │   │   │   └── 04-permission-prod.seed.ts
│   │   │   │   │   └── utils
│   │   │   │   │       ├── extractUserPermissionStrings.ts
│   │   │   │   │       └── hasPermission.ts
│   │   │   │   ├── resource
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── Resource.ts
│   │   │   │   │   ├── resource.controller.ts
│   │   │   │   │   ├── resource.service.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── seeds
│   │   │   │   │       └── 03-resource-prod.seed.ts
│   │   │   │   ├── role
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   ├── Role.ts
│   │   │   │   │   │   └── RolePermission.ts
│   │   │   │   │   ├── role.controller.ts
│   │   │   │   │   ├── role.service.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── seeds
│   │   │   │   │       ├── 05-role-prod.seed.ts
│   │   │   │   │       └── 06-rolePermission-prod.seed.ts
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
│   │   │   │   │   │   └── public-pem.example
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
│   │   │   │   ├── user
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── openapi.ts
│   │   │   │   │   ├── entities
│   │   │   │   │   │   └── User.ts
│   │   │   │   │   ├── factories
│   │   │   │   │   │   └── user.factory.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   ├── seeds
│   │   │   │   │   │   ├── 07-user-prod.seed.ts
│   │   │   │   │   │   └── 08-user.seed.ts
│   │   │   │   │   ├── user.controller.ts
│   │   │   │   │   └── user.service.ts
│   │   │   │   └── userOrganizationRole
│   │   │   │       ├── docs
│   │   │   │       │   └── openapi.ts
│   │   │   │       ├── entities
│   │   │   │       │   └── UserOrganizationRole.ts
│   │   │   │       ├── routes.ts
│   │   │   │       ├── seeds
│   │   │   │       │   └── 08-userOrganizationRole-prod.seed.ts
│   │   │   │       ├── userOrganizationRole.controller.ts
│   │   │   │       └── userOrganizationRole.service.ts
│   │   │   ├── swagger
│   │   │   │   └── swagger.ts
│   │   │   └── types
│   │   │       └── express
│   │   │           └── index.d.ts
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.spec.json
│   ├── patient-portal
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
│   │   ├── scripts
│   │   │   └── collectSourceFiles.ts
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
│   └── portfolio
│       ├── .env.development
│       ├── .env.production
│       ├── .swcrc
│       ├── eslint.config.mjs
│       ├── index.d.ts
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── public
│       │   ├── .gitkeep
│       │   ├── cv
│       │   │   └── Frank-Jia-CV.pdf
│       │   ├── favicon.ico
│       │   └── images
│       │       ├── address-list-map-view.png
│       │       ├── avatar-01.png
│       │       ├── avatar-02.png
│       │       ├── claclaws.png
│       │       ├── dmsolving.png
│       │       ├── frankjhub.png
│       │       ├── noqclinic-calendar.png
│       │       ├── noqclinic.png
│       │       └── plush-up.png
│       ├── src
│       │   ├── app
│       │   │   ├── about
│       │   │   │   └── page.tsx
│       │   │   ├── api
│       │   │   │   └── hello
│       │   │   │       └── route.ts
│       │   │   ├── contact
│       │   │   │   └── page.tsx
│       │   │   ├── error.tsx
│       │   │   ├── global.css
│       │   │   ├── layout.tsx
│       │   │   ├── loading.tsx
│       │   │   ├── not-found.tsx
│       │   │   ├── page.tsx
│       │   │   ├── portfolio
│       │   │   │   └── page.tsx
│       │   │   └── skill
│       │   │       └── page.tsx
│       │   ├── components
│       │   │   ├── LandGuard.tsx
│       │   │   ├── LandingAnimationPage.tsx
│       │   │   ├── PageLayout.tsx
│       │   │   ├── Providers.tsx
│       │   │   ├── home
│       │   │   │   ├── AboutSectionLayout
│       │   │   │   │   └── NumberRiserComponent.tsx
│       │   │   │   ├── AboutSectionLayout.tsx
│       │   │   │   ├── ContactPageLayout.tsx
│       │   │   │   ├── HeroSectionLayout.tsx
│       │   │   │   ├── PortfolioSectionLayout.tsx
│       │   │   │   ├── SkillSectionLayout
│       │   │   │   │   ├── AccordionTitleCard.tsx
│       │   │   │   │   ├── EducationCard.tsx
│       │   │   │   │   ├── SkillContent.tsx
│       │   │   │   │   ├── SkillItem.tsx
│       │   │   │   │   └── WorkCard.tsx
│       │   │   │   ├── SkillSectionLayout.tsx
│       │   │   │   └── heroSectionLayout
│       │   │   │       ├── AvatarImage.tsx
│       │   │   │       ├── Info.tsx
│       │   │   │       └── MediaIcons.tsx
│       │   │   └── navbar
│       │   │       ├── TextBrand.tsx
│       │   │       └── TopNav.tsx
│       │   ├── libs
│       │   │   └── redux
│       │   │       ├── createAppAsyncThunk.ts
│       │   │       ├── index.ts
│       │   │       ├── rootReducer.ts
│       │   │       ├── slices
│       │   │       │   ├── index.ts
│       │   │       │   └── systemSlice
│       │   │       │       ├── index.ts
│       │   │       │       └── systemSlice.ts
│       │   │       └── store.ts
│       │   └── utils
│       │       └── hasSeenLanding.ts
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
│   │   │   └── index.esm.js
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
│   ├── shared-errors
│   │   ├── .swcrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── packageBuild
│   │   │   └── package.json
│   │   ├── rollup.config.cjs
│   │   ├── rollup.utils.js
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── BaseError.ts
│   │   │       ├── ValidationError.ts
│   │   │       └── index.ts
│   │   ├── tsconfig.json
│   │   └── tsconfig.lib.json
│   ├── shared-hooks
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── packageBuild
│   │   │   └── package.json
│   │   ├── rollup.config.cjs
│   │   ├── rollup.utils.js
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── index.ts
│   │   │       ├── useClickOutside.tsx
│   │   │       ├── useConfirmModal.tsx
│   │   │       ├── useControlledState.tsx
│   │   │       ├── useDebouncedCallback.tsx
│   │   │       ├── useMarkdown.tsx
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
│   │   ├── rollup.utils.js
│   │   ├── scripts
│   │   │   └── collectSourceFiles.ts
│   │   ├── src
│   │   │   ├── enums
│   │   │   │   ├── amenities.enum.ts
│   │   │   │   ├── data_source.enum.ts
│   │   │   │   ├── email_type.enum.ts
│   │   │   │   ├── gender.enum.ts
│   │   │   │   ├── honorific.enum.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── languages.enum.ts
│   │   │   │   ├── order.enum.ts
│   │   │   │   ├── phone_type.enum.ts
│   │   │   │   └── roleSource.enum.ts
│   │   │   ├── factories
│   │   │   │   ├── createFilters.schema.ts
│   │   │   │   ├── createOffsetPaginatedResponse.schema.ts
│   │   │   │   ├── createOffsetPagination.schema.ts
│   │   │   │   ├── createSuccessResponse.schema.ts
│   │   │   │   ├── enumUtils.ts
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── libs
│   │   │   │   └── z.ts
│   │   │   ├── modules
│   │   │   │   ├── action
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── order-by-fields.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── create.request.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── list.request.schema.ts
│   │   │   │   │   │   └── update.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       ├── option-list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   ├── auth
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── login.request.schema.ts
│   │   │   │   │   ├── response
│   │   │   │   │   │   ├── getCurrentUser.response.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── login.response.schema.ts
│   │   │   │   │   └── userPayload.schema.ts
│   │   │   │   ├── clinic
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── insurances.enum.ts
│   │   │   │   │   │   ├── services.enum.ts
│   │   │   │   │   │   ├── specialties.enum.ts
│   │   │   │   │   │   └── status.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── common
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── amenityItem.schema.ts
│   │   │   │   │   │   ├── baseEntity.schema.ts
│   │   │   │   │   │   ├── emailItem.schema.ts
│   │   │   │   │   │   ├── geoJSONPoint.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── openHours.schema.ts
│   │   │   │   │   │   └── phoneItem.schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── baseErrorExamples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── idParams.schema.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── openapi
│   │   │   │   │   │   ├── errorTypes.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── responseBuilder.ts
│   │   │   │   │   ├── response
│   │   │   │   │   │   ├── baseErrorResponse.schema.ts
│   │   │   │   │   │   ├── baseResponse.schema.ts
│   │   │   │   │   │   ├── errorDetails.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── sessionResponse.schema.ts
│   │   │   │   │   │   └── simpleResponse.schema.ts
│   │   │   │   │   └── zodIssueSchema.schema.ts
│   │   │   │   ├── contact
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── request
│   │   │   │   │       ├── create.request.schema.ts
│   │   │   │   │       └── index.ts
│   │   │   │   ├── email
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── channel.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── provider.enum.ts
│   │   │   │   │   │   ├── receiptEvent.enum.ts
│   │   │   │   │   │   ├── status.enum.ts
│   │   │   │   │   │   └── suppressionReason.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── emailOutbox.schema.ts
│   │   │   │   │   │   ├── emailReceipt.schema.ts
│   │   │   │   │   │   ├── emailSuppression.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── resendWebhookBodySchema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── resendWebhookBodyExample.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── interface
│   │   │   │   │   │   ├── email.interface.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── render.request.schema.ts
│   │   │   │   │   │   └── send.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── render.response.schema.ts
│   │   │   │   │       └── send.response.schema.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── invitation
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── order-by-fields.enum.ts
│   │   │   │   │   │   └── status.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── accept.request.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── issue.request.schema.ts
│   │   │   │   │   │   └── list.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── accept.response.schema.ts
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── issue.response.schema.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   ├── organization
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── order-by-fields.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── create.request.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── list.request.schema.ts
│   │   │   │   │   │   └── update.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       ├── option-list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   ├── organizationType
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── order-by-fields.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── create.request.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── list.request.schema.ts
│   │   │   │   │   │   └── update.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       ├── option-list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   ├── permission
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── order-by-fields.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── create.request.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── list.request.schema.ts
│   │   │   │   │   │   └── update.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       ├── option-list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   ├── permission-action
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── resource
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── order-by-fields.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── create.request.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── list.request.schema.ts
│   │   │   │   │   │   └── update.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       ├── option-list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   ├── role
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── order-by-fields.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── create.request.schema.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── list.request.schema.ts
│   │   │   │   │   │   └── update.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       ├── option-list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   ├── rolePermission
│   │   │   │   │   └── entity
│   │   │   │   │       └── schema.ts
│   │   │   │   ├── user
│   │   │   │   │   ├── constants
│   │   │   │   │   │   ├── filter.enum.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── order-by-fields.enum.ts
│   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── schema.ts
│   │   │   │   │   ├── examples
│   │   │   │   │   │   ├── examples.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── registerExample.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── request
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── list.request.schema.ts
│   │   │   │   │   │   ├── option-list.request.schema.ts
│   │   │   │   │   │   ├── register.request.schema.ts
│   │   │   │   │   │   └── update.request.schema.ts
│   │   │   │   │   └── response
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── list.response.schema.ts
│   │   │   │   │       ├── option-list.response.schema.ts
│   │   │   │   │       └── single.response.schema.ts
│   │   │   │   └── userOrganizationRole
│   │   │   │       ├── entity
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── schema.ts
│   │   │   │       ├── examples
│   │   │   │       │   ├── examples.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── index.ts
│   │   │   │       ├── request
│   │   │   │       │   ├── create.request.schema.ts
│   │   │   │       │   ├── delete.request.schema.ts
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── update.request.schema.ts
│   │   │   │       └── response
│   │   │   │           ├── index.ts
│   │   │   │           └── single.response.schema.ts
│   │   │   └── types
│   │   │       ├── apiResponse.type.ts
│   │   │       ├── index.ts
│   │   │       ├── labeledEnumItem.type.ts
│   │   │       ├── paginated-response.type.ts
│   │   │       └── tableColumn.type.ts
│   │   ├── tsconfig.json
│   │   └── tsconfig.lib.json
│   ├── shared-ui-client
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── packageBuild
│   │   │   └── package.json
│   │   ├── rollup.config.cjs
│   │   ├── rollup.utils.js
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── animations
│   │   │       │   ├── AnimatedSwitcher.stories.tsx
│   │   │       │   ├── AnimatedSwitcher.tsx
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
│   │   │           ├── MarkdownViewer
│   │   │           │   ├── MarkdownViewer.stories.tsx
│   │   │           │   ├── MarkdownViewer.tsx
│   │   │           │   └── index.tsx
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
│   │   ├── packageBuild
│   │   │   └── package.json
│   │   ├── rollup.config.cjs
│   │   ├── rollup.utils.js
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   │   ├── Background
│   │   │   │   │   ├── FrankTiledBackground.stories.tsx
│   │   │   │   │   ├── FrankTiledBackground.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── feedback
│   │   │   │   │   ├── Loading
│   │   │   │   │   │   ├── FrankLoadingSignature.module.css
│   │   │   │   │   │   ├── FrankLoadingSignature.stories.tsx
│   │   │   │   │   │   ├── FrankLoadingSignature.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── icons
│   │   │   │   │   ├── SVGIcon
│   │   │   │   │   │   ├── FrankSVGIcon.stories.tsx
│   │   │   │   │   │   ├── FrankSVGIcon.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── navigation
│   │   │   │   │   ├── Link
│   │   │   │   │   │   ├── SocialMediaLinks.stories.tsx
│   │   │   │   │   │   ├── SocialMediaLinks.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── Tabs
│   │   │   │   │   │   ├── FrankArrowSwitcher.stories.tsx
│   │   │   │   │   │   ├── FrankArrowSwitcher.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── provider
│   │   │   │   │   ├── RuntimeConfigProvider.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── staticEffects
│   │   │   │       ├── HeroTitle.stories.tsx
│   │   │   │       ├── HeroTitle.tsx
│   │   │   │       ├── LinearGradientTextColor.stories.tsx
│   │   │   │       ├── LinearGradientTextColor.tsx
│   │   │   │       └── index.ts
│   │   │   └── utils
│   │   │       ├── index.ts
│   │   │       └── renderToElement.tsx
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.storybook.json
│   ├── shared-ui-hero-client
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── packageBuild
│   │   │   └── package.json
│   │   ├── rollup.config.cjs
│   │   ├── rollup.utils.js
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
│   │   │       │   ├── Card
│   │   │       │   │   ├── ProjectCard.stories.tsx
│   │   │       │   │   ├── ProjectCard.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Carousel
│   │   │       │   │   ├── CarouselNavigation.stories.tsx
│   │   │       │   │   ├── CarouselNavigation.tsx
│   │   │       │   │   ├── CarouselPagination.stories.tsx
│   │   │       │   │   ├── CarouselPagination.tsx
│   │   │       │   │   ├── FrankCarousel.stories.tsx
│   │   │       │   │   ├── FrankCarousel.tsx
│   │   │       │   │   ├── ProjectListCarousel.stories.tsx
│   │   │       │   │   ├── ProjectListCarousel.tsx
│   │   │       │   │   ├── carouselProjects.ts
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Dropdown
│   │   │       │   │   ├── Base
│   │   │       │   │   │   ├── FrankDropdown.stories.tsx
│   │   │       │   │   │   ├── FrankDropdown.tsx
│   │   │       │   │   │   ├── FrankDropdownItem.stories.tsx
│   │   │       │   │   │   ├── FrankDropdownItem.tsx
│   │   │       │   │   │   ├── FrankDropdownMenu.stories.tsx
│   │   │       │   │   │   ├── FrankDropdownMenu.tsx
│   │   │       │   │   │   ├── FrankDropdownTrigger.stories.tsx
│   │   │       │   │   │   ├── FrankDropdownTrigger.tsx
│   │   │       │   │   │   └── index.ts
│   │   │       │   │   ├── general
│   │   │       │   │   │   ├── FrankActionsDropdown.stories.tsx
│   │   │       │   │   │   ├── FrankActionsDropdown.tsx
│   │   │       │   │   │   └── index.ts
│   │   │       │   │   └── index.ts
│   │   │       │   ├── GoogleMap
│   │   │       │   │   ├── AddressCard.stories.tsx
│   │   │       │   │   ├── AddressCard.tsx
│   │   │       │   │   ├── AddressListMapView.stories.tsx
│   │   │       │   │   ├── AddressListMapView.tsx
│   │   │       │   │   ├── CostomLocationMarker.stories.tsx
│   │   │       │   │   ├── CustomLocationMarker.tsx
│   │   │       │   │   ├── CustomPopup.stories.tsx
│   │   │       │   │   ├── CustomPopup.tsx
│   │   │       │   │   ├── FrankGoogleMap.tsx
│   │   │       │   │   ├── FrankGoolgeMap.stories.tsx
│   │   │       │   │   ├── PopupOverlay.ts
│   │   │       │   │   ├── cleanupMarkerNode.ts
│   │   │       │   │   ├── deferUnmount.ts
│   │   │       │   │   └── index.tsx
│   │   │       │   ├── Rating
│   │   │       │   │   ├── FrankRating.stories.tsx
│   │   │       │   │   ├── FrankRating.tsx
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
│   │   │       │   ├── Tooltip
│   │   │       │   │   ├── FrankTooltip.stories.tsx
│   │   │       │   │   └── FrankTooltip.tsx
│   │   │       │   └── index.ts
│   │   │       ├── form
│   │   │       │   ├── AutoComplete
│   │   │       │   │   ├── FrankAutocomplete.stories.tsx
│   │   │       │   │   ├── FrankAutocomplete.tsx
│   │   │       │   │   ├── NoqPublicSearchBar.stories.tsx
│   │   │       │   │   ├── NoqPublicSearchBar.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Base
│   │   │       │   │   ├── FrankForm.stories.tsx
│   │   │       │   │   ├── FrankForm.tsx
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
│   │   │       │   ├── Forms
│   │   │       │   │   ├── ContactForm.stories.ts
│   │   │       │   │   ├── ContactForm.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Input
│   │   │       │   │   ├── FrankInput.stories.tsx
│   │   │       │   │   ├── FrankInput.tsx
│   │   │       │   │   ├── FrankInputBase.stories.tsx
│   │   │       │   │   ├── FrankInputBase.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Radio-Group
│   │   │       │   │   ├── FrankRadioGroupBasic.stories.tsx
│   │   │       │   │   ├── FrankRadioGroupBasic.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Select
│   │   │       │   │   ├── FrankSelect.stories.tsx
│   │   │       │   │   ├── FrankSelect.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Textarea
│   │   │       │   │   ├── FrankTextarea.stories.tsx
│   │   │       │   │   ├── FrankTextarea.tsx
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
│   │   │       ├── navigation
│   │   │       │   ├── Navbar
│   │   │       │   │   ├── FrankTopNav.stories.tsx
│   │   │       │   │   ├── FrankTopNav.tsx
│   │   │       │   │   ├── NavLink.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── Tabs
│   │   │       │   │   ├── FrankTabs.stories.tsx
│   │   │       │   │   ├── FrankTabs.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       └── table
│   │   │           ├── base
│   │   │           │   ├── FrankTable.stories.tsx
│   │   │           │   ├── FrankTable.tsx
│   │   │           │   ├── FrankTableBody.stories.tsx
│   │   │           │   ├── FrankTableBody.tsx
│   │   │           │   ├── FrankTableCell.stories.tsx
│   │   │           │   ├── FrankTableCell.tsx
│   │   │           │   ├── FrankTableColumn.stories.tsx
│   │   │           │   ├── FrankTableColumn.tsx
│   │   │           │   ├── FrankTableHeader.stories.tsx
│   │   │           │   ├── FrankTableHeader.tsx
│   │   │           │   ├── FrankTableRow.stories.tsx
│   │   │           │   ├── FrankTableRow.tsx
│   │   │           │   └── index.ts
│   │   │           ├── general
│   │   │           │   ├── FrankGeneralTable.stories.tsx
│   │   │           │   ├── FrankGeneralTable.tsx
│   │   │           │   └── index.ts
│   │   │           ├── index.ts
│   │   │           └── pagination
│   │   │               ├── FrankPagination.stories.tsx
│   │   │               ├── FrankPagination.tsx
│   │   │               └── index.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.storybook.json
│   ├── shared-ui-hero-ssr
│   │   ├── .babelrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── packageBuild
│   │   │   └── package.json
│   │   ├── rollup.config.cjs
│   │   ├── rollup.utils.js
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   │   ├── dataDisplay
│   │   │   │   │   ├── Avatar
│   │   │   │   │   │   ├── FrankAvatar.stories.tsx
│   │   │   │   │   │   ├── FrankAvatar.tsx
│   │   │   │   │   │   ├── UserListItem.stories.tsx
│   │   │   │   │   │   ├── UserListItem.tsx
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── Card
│   │   │   │   │   │   ├── base
│   │   │   │   │   │   │   ├── FrankCard.stories.tsx
│   │   │   │   │   │   │   ├── FrankCard.tsx
│   │   │   │   │   │   │   ├── FrankCardBody.stories.tsx
│   │   │   │   │   │   │   ├── FrankCardBody.tsx
│   │   │   │   │   │   │   ├── FrankCardFooter.stories.tsx
│   │   │   │   │   │   │   ├── FrankCardFooter.tsx
│   │   │   │   │   │   │   ├── FrankCardHeader.stories.tsx
│   │   │   │   │   │   │   ├── FrankCardHeader.tsx
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── general
│   │   │   │   │   │   │   ├── FrankGeneralCard.stories.tsx
│   │   │   │   │   │   │   ├── FrankGeneralCard.tsx
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── Progress
│   │   │   │   │   │   ├── FrankProgress.stories.tsx
│   │   │   │   │   │   ├── FrankProgress.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── feedback
│   │   │   │   │   ├── Spinner
│   │   │   │   │   │   ├── FrankSpinner.stories.tsx
│   │   │   │   │   │   ├── FrankSpinner.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── general
│   │   │   │       ├── Button
│   │   │   │       │   ├── FrankButton.stories.tsx
│   │   │   │       │   ├── FrankButton.tsx
│   │   │   │       │   ├── FrankButtonBase.stories.tsx
│   │   │   │       │   ├── FrankButtonBase.tsx
│   │   │   │       │   ├── NoqButton.stories.tsx
│   │   │   │       │   ├── NoqButton.tsx
│   │   │   │       │   └── index.ts
│   │   │   │       └── index.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── props.types.ts
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
│   │   ├── rollup.utils.js
│   │   ├── src
│   │   │   ├── components
│   │   │   │   └── general
│   │   │   │       └── button
│   │   │   │           ├── ButtonShadcn.tsx
│   │   │   │           └── button.stories.tsx
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   │   ├── shared-ui-shadcn.stories.tsx
│   │   │   │   ├── shared-ui-shadcn.tsx
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
│   │   ├── packageBuild
│   │   │   └── package.json
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
│   │   │       ├── cookieDomain.util.ts
│   │   │       ├── dateUtils.ts
│   │   │       ├── errorUtils.ts
│   │   │       ├── eventUtils.ts
│   │   │       ├── heroui.utils.ts
│   │   │       ├── imageUtils.ts
│   │   │       ├── tableUtils.ts
│   │   │       ├── testUtils.ts
│   │   │       ├── textUtils.ts
│   │   │       ├── token.util.ts
│   │   │       ├── updateEntityUtils.ts
│   │   │       └── validationUtils.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   └── tsconfig.spec.json
│   └── storybook-host
│       ├── .babelrc
│       ├── .env.development
│       ├── .env.production
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
│       ├── public
│       │   └── assets
│       │       └── privacy-policy.md
│       ├── src
│       │   ├── Introduction.mdx
│       │   ├── config
│       │   │   └── googleMapsConfig.ts
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