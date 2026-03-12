# AGENTS.md - AI Agent Guidelines

## Build, Lint & Test Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm run start:dev          # Start with watch mode
pnpm run start:debug        # Start with debugger
pnpm run build              # Build for production

# Code quality
pnpm run format             # Format with Prettier
pnpm run lint               # ESLint with auto-fix

# Tests
pnpm run test               # Run unit tests
pnpm run test:watch         # Watch mode
pnpm run test:cov           # Coverage report
pnpm run test:e2e           # E2E tests
pnpm run test -- --testNamePattern="description"  # Run single test by name
pnpm run test -- path/to/file.spec.ts             # Run single test file

# Database
pnpm prisma migrate dev     # Create & apply migration
pnpm prisma studio          # Open Prisma Studio
pnpm exec better-auth generate --config ./src/lib/auth.ts && pnpm exec better-auth migrate
```

## Code Style Guidelines

### Imports

- NestJS imports first (e.g., `@nestjs/common`)
- Third-party libraries next
- Local imports last (relative paths)
- Use named imports over default imports

### Formatting (Prettier)

- Single quotes for strings
- Trailing commas in all multi-line structures
- Semicolons required
- See `.prettierrc` for full config

### TypeScript

- Use explicit types for function parameters and return types
- `strictNullChecks: true` enforced
- `noImplicitAny: false` (some flexibility allowed)
- Use interfaces for DTOs and domain objects
- Avoid `any` type; use proper typing or `unknown`

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `categories.service.ts`)
- **Classes**: `PascalCase` (e.g., `CategoriesService`)
- **Functions/Methods**: `camelCase` (e.g., `getCategoryById`)
- **DTOs**: `[Action][Entity]Dto` (e.g., `CreateCategoryDto`)
- **Modules**: `[Entity]Module` (e.g., `CategoriesModule`)
- **Controllers**: `[Entity]Controller`
- **Services**: `[Entity]Service`
- **Domain**: `[Entity]Domain`
- **Test files**: `*.spec.ts` suffix

### Error Handling

- Handle errors at controller level
- Return appropriate HTTP status codes
- Return 404 for not found resources (GET single)
- Return 200 with empty array for GET collections when no data
- Use NestJS exception filters for consistent error responses

### Architecture Patterns

- **Modules**: Self-contained domain modules under `src/`
- **Controllers**: HTTP routing only, no business logic
- **Services**: Business logic layer
- **Domain**: Data access and Prisma operations
- **DTOs**: Request validation with `class-validator`
- **Pipes**: Global validation via `DtoValidationPipe`

### Testing

- Use Jest spies over mocks when possible:
  ```ts
  const spy = jest.spyOn(service, 'methodName');
  expect(spy).toHaveBeenCalledWith(args);
  ```
- Use `createMockContext` from `test/prisma.mock.ts` for Prisma mocking
- Test behavior, not implementation
- Maintain test isolation
- Use descriptive test names
- Cover both success and failure cases
- Avoid `any` type in tests

### NestJS Best Practices

- Use `async/await` for all async operations
- Use dependency injection throughout
- Register all modules in `app.module.ts`
- Use `@Global()` sparingly
- Leverage NestJS decorators for routing and validation

## Copilot Rules (from .github/copilot-instructions.md)

- Follow NestJS best practices
- Use Context7 for documentation searches
- Controllers follow RESTful conventions
- No frontend code in this repo
- When creating new modules:
  - Create folder under `src/` with module name
  - Include controller, service, dto, and test files
  - Register module in `app.module.ts`

## Project Structure

```
src/
├── [module]/           # Domain modules (categories, tags, transaction, etc.)
│   ├── [module].controller.ts
│   ├── [module].service.ts
│   ├── [module].domain.ts
│   ├── [module].dto.ts
│   ├── [module].module.ts
│   └── *.spec.ts
├── lib/                # Shared utilities (auth, ormClient, validations)
├── pipes/              # Custom pipes
├── database/           # Database module
└── app.module.ts       # Root module
```

## Key Dependencies

- NestJS v11
- Prisma v7 (PostgreSQL)
- better-auth (authentication)
- Jest v30 (testing)
- TypeScript v5.7
- ESLint v9 + Prettier v3
