# AGENTS.md - AI Agent Guidelines

## Build, Lint & Test Commands

```bash
pnpm build        # Compile TypeScript
pnpm start        # Start application
pnpm start:dev   # Development mode with watch
pnpm start:prod   # Production mode
pnpm lint         # Run ESLint
pnpm test          # Run unit tests
pnpm test:e2e      # Run e2e tests
```

---

## Hexagonal Architecture Overview

This project follows **Hexagonal Architecture** (Ports and Adapters) pattern:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HEXAGONAL ARCHITECTURE LAYERS                       │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    PRIMARY ADAPTERS (Driving)                        │   │
│   │         Controllers - Handle HTTP, parse requests, return responses  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      APPLICATION LAYER                               │   │
│   │              Application Services - Use Case Orchestration            │   │
│   │                         (DTOs here)                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         DOMAIN LAYER (Core)                         │   │
│   │                   Pure Business Logic - No Framework Dependencies    │   │
│   │                                                                          │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐     │   │
│   │   │  Entities   │  │   Ports     │  │    Domain Services      │     │   │
│   │   │ (Value Objs)│  │ (Interfaces)│  │   (Business Logic)      │     │   │
│   │   └─────────────┘  └─────────────┘  └─────────────────────────┘     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    ▲                                         │
│                                    │                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                   SECONDARY ADAPTERS (Driven)                         │   │
│   │       Repositories - Implement ports, interact with databases        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Code Style Guidelines

### Imports Order

1. NestJS imports first (e.g., `@nestjs/common`)
2. Third-party libraries next
3. Local imports last (relative paths)
4. Use named imports over default imports

### Formatting (Prettier)

- Single quotes for strings
- Trailing commas in all multi-line structures
- Semicolons required
- See `.prettierrc` for full config

### TypeScript Rules

- Use explicit types for function parameters and return types
- `strictNullChecks: true` enforced
- `noImplicitAny: false` (some flexibility allowed)
- Use interfaces for DTOs and domain objects
- Avoid `any` type
- **Domain layer has ZERO framework imports** - pure TypeScript only

---

## Naming Conventions

### Files by Layer

| Layer                    | File Pattern                      | Example                           |
| ------------------------ | --------------------------------- | --------------------------------- |
| **Domain Entities**      | `[entity].entity.ts`              | `category.entity.ts`              |
| **Domain Ports**         | `[entity].repository.port.ts`     | `category.repository.port.ts`     |
| **Domain Services**      | `[entity].domain.service.ts`      | `categories.domain.service.ts`    |
| **Domain Errors**        | `[entity].errors.ts`              | `category.errors.ts`              |
| **Application Services** | `[entity].application.service.ts` | `category.application.service.ts` |
| **Application DTOs**     | `[action]-[entity].dto.ts`        | `create-category.dto.ts`          |
| **Response DTOs**        | `[entity]-response.dto.ts`        | `category-response.dto.ts`        |
| **Primary Adapters**     | `[entity].controller.ts`          | `categories.controller.ts`        |
| **Repository Impl**      | `[entity].repository.ts`          | `category.repository.ts`          |
| **Mappers**              | `[entity].mapper.ts`              | `category.mapper.ts`              |

### Classes by Layer

| Layer                    | Class Pattern                     | Example                      |
| ------------------------ | --------------------------------- | ---------------------------- |
| **Entities**             | `PascalCase + Entity`             | `CategoryEntity`             |
| **Value Objects**        | `PascalCase + VO`                 | `UserId`, `PaginationVO`     |
| **Ports**                | `I + PascalCase + Port`           | `ICategoryRepository`        |
| **Domain Services**      | `PascalCase + DomainService`      | `CategoriesDomainService`    |
| **Application Services** | `PascalCase + ApplicationService` | `CategoryApplicationService` |
| **Controllers**          | `PascalCase + Controller`         | `CategoriesController`       |
| **Repositories**         | `PascalCase + Repository`         | `CategoryRepository`         |
| **Mappers**              | `PascalCase + Mapper`             | `CategoryMapper`             |
| **Errors**               | `PascalCase + Exception`          | `CategoryNotFoundException`  |

### Functions/Methods

- `camelCase` (e.g., `getCategoryById`)
- Methods on domain services should describe business operations

---

## Layer Responsibilities

### 1. Domain Layer (Core - Framework Agnostic)

**Location**: `src/domains/`

**Rules**:

- ❌ NO NestJS imports (`@Injectable`, `@Controller`, etc.)
- ❌ NO Prisma imports
- ❌ NO `class-validator` decorators
- ✅ Pure TypeScript classes and interfaces
- ✅ Business logic only

**Contents**:

```
domains/
├── base/                          # Base classes
│   ├── entity.ts                  # Entity<T> base class
│   ├── value-object.ts            # ValueObject<T> base class
│   └── domain-service.ts          # DomainService marker class
│
├── shared/                        # Shared domain types
│   ├── errors/
│   │   └── domain.exception.ts     # DomainException, NotFoundDomainException
│   └── value-objects/
│       ├── user-id.value-object.ts
│       └── pagination.value-object.ts
│
└── [module]/                      # Per-module domain
    ├── entities/
    │   └── [entity].entity.ts      # Domain entity
    ├── ports/
    │   └── [entity].repository.port.ts  # Repository interface
    ├── domain/
    │   └── [entity].domain.service.ts   # Business logic
    └── errors/
        └── [entity].errors.ts     # Domain exceptions
```

### 2. Application Layer (Use Cases)

**Location**: `src/applications/`

**Rules**:

- Orchestrates domain services
- Transforms DTOs to domain inputs and domain outputs to responses
- NO database access (delegates to domain)
- NO HTTP handling (delegates to controllers)

**Contents**:

```
applications/
└── [module]/
    ├── [entity].application.service.ts  # Use case orchestration
    └── dtos/
        ├── create-[entity].dto.ts
        ├── update-[entity].dto.ts
        └── [entity]-response.dto.ts
```

### 3. Infrastructure - Primary Adapters (Controllers)

**Location**: `src/infrastructure/adapters/primary/`

**Rules**:

- Handle HTTP concerns only (status codes, headers, parsing)
- Call application services
- Extract session/user context and pass userId to application layer
- NO business logic

**Contents**:

```
infrastructure/adapters/primary/
└── [module]/
    └── [entity].controller.ts
```

### 4. Infrastructure - Secondary Adapters (Repositories)

**Location**: `src/infrastructure/adapters/secondary/`

**Rules**:

- Implement domain ports (repository interfaces)
- Handle database access (Prisma)
- Map between database models and domain entities
- ONE repository per domain entity

**Contents**:

```
infrastructure/adapters/secondary/
└── persistence/
    ├── prisma/
    │   └── prisma-client.provider.ts  # Prisma client singleton
    └── repositories/
        └── [entity].repository.ts     # Repository implementation
    └── mappers/
        └── [entity].mapper.ts         # Entity <-> DB model mapping
```

### 5. Infrastructure - Wiring (NestJS Modules)

**Location**: `src/infrastructure/wiring/`

**Rules**:

- Configure NestJS dependency injection
- Wire ports to repository implementations
- Import and export services between layers

**Contents**:

```
infrastructure/wiring/
├── app.module.ts            # Root module
├── infrastructure.module.ts # Global infrastructure (DB, config)
├── application.module.ts    # Application services
├── primary-adapter.module.ts # Controllers
├── domain.module.ts         # Domain services
└── tokens.ts               # DI injection tokens (Symbols)
```

---

## Error Handling

### Domain Layer

- Throw domain-specific exceptions (e.g., `CategoryNotFoundException`)
- Exceptions should have error codes for client handling

### Application Layer

- Let domain exceptions propagate
- Transform domain exceptions to HTTP exceptions if needed

### Controller Layer

- Catch domain exceptions
- Return appropriate HTTP status codes:
  - `404 Not Found` - Resource not found
  - `400 Bad Request` - Validation errors
  - `401 Unauthorized` - Authentication required
  - `409 Conflict` - Business rule violations (e.g., duplicate)

---

## Dependency Rules

### The Dependency Funnel

```
Primary Adapter → Application → Domain → Ports (interfaces)
                                    ↑
                            Repository implementations
                            (secondary adapters)
```

### Key Principles

1. **Domain never imports outside itself** - No NestJS, Prisma, or application imports
2. **Ports are defined in domain** - Interfaces live in `domains/[module]/ports/`
3. **Repositories implement ports** - Implementations live in infrastructure
4. **Controllers never access repositories directly** - Go through application → domain → port

---

## Testing Strategy

### Domain Layer Tests

- Pure unit tests with Jest
- No NestJS bootstrap needed
- Mock repository ports

### Application Layer Tests

- Test use case orchestration
- Mock domain services

### Controller Tests

- Use NestJS testing module
- Mock application services
- Use `supertest` for HTTP testing

### Example Test Structure

```typescript
// Domain service test (pure unit)
describe('CategoriesDomainService', () => {
  let service: CategoriesDomainService;
  let mockRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockRepository = { create: jest.fn(), ... };
    service = new CategoriesDomainService(mockRepository);
  });

  it('should create category', async () => {
    // Test business logic
  });
});
```

---

## Project Structure

```
src/
├── domains/                           # DOMAIN LAYER (Core)
│   ├── base/                          # Base classes
│   │   ├── entity.ts
│   │   ├── value-object.ts
│   │   └── domain-service.ts
│   ├── shared/                        # Shared domain types
│   │   ├── errors/
│   │   │   └── domain.exception.ts
│   │   └── value-objects/
│   ├── categories/
│   │   ├── entities/
│   │   ├── ports/
│   │   ├── domain/
│   │   └── errors/
│   ├── transactions/
│   ├── tags/
│   └── periodic/
│
├── applications/                      # APPLICATION LAYER
│   ├── categories/
│   │   ├── category.application.service.ts
│   │   └── dtos/
│   ├── transactions/
│   ├── tags/
│   └── periodic/
│
├── infrastructure/                    # INFRASTRUCTURE LAYER
│   ├── adapters/
│   │   ├── primary/                  # Controllers
│   │   │   ├── categories/
│   │   │   ├── transactions/
│   │   │   ├── tags/
│   │   │   └── periodic/
│   │   └── secondary/                # Repositories
│   │       └── persistence/
│   │           ├── prisma/
│   │           │   └── prisma-client.provider.ts
│   │           ├── repositories/
│   │           └── mappers/
│   └── wiring/
│       ├── app.module.ts
│       ├── infrastructure.module.ts
│       ├── application.module.ts
│       ├── primary-adapter.module.ts
│       ├── domain.module.ts
│       └── tokens.ts
│
├── lib/                               # Shared (keep existing)
│   ├── auth.ts
│   ├── auth.types.ts
│   ├── consts.ts
│   ├── env.ts
│   ├── validations.ts
│   └── ormClient/                    # Prisma generated client
│
├── pipes/                             # Keep existing
│   └── dtoValidation.pipe.ts
│
└── utils/                             # Keep existing
    └── validations.ts
```

---

## Key Dependencies

- **NestJS v11** - Core framework
- **Prisma v7** - ORM with PostgreSQL adapter
- **better-auth** - Authentication library
- **@thallesp/nestjs-better-auth** - NestJS integration for better-auth
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **Jest v30** - Testing
- **TypeScript v5.7** - Language
- **ESLint v9 + Prettier v3** - Linting and formatting
