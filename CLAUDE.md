# CLAUDE.md - AI Assistant Guide for Allori Repository

> **Last Updated:** 2026-01-04
> **Repository:** Allori (Monorepo)
> **Status:** Greenfield/Skeleton Project

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Current State](#current-state)
3. [Repository Structure](#repository-structure)
4. [Development Workflows](#development-workflows)
5. [Key Conventions](#key-conventions)
6. [Technologies & Tooling](#technologies--tooling)
7. [Git Workflow](#git-workflow)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Common Tasks](#common-tasks)
10. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Repository Overview

**Allori** is a monorepo project following a standard workspace structure with separate directories for applications, shared packages, and documentation.

- **Type:** Monorepo
- **License:** MIT (Copyright 2025 Tony)
- **Primary Runtime:** Node.js 18 (intended)
- **Development Environment:** VS Code Dev Containers (Debian Bullseye)
- **Repository Owner:** aadkatz21-bit/Allori

---

## Current State

⚠️ **IMPORTANT:** This is a **skeleton/greenfield project** with minimal implementation.

**What Exists:**
- Basic directory structure (`apps/`, `packages/`, `docs/`)
- Placeholder GitHub Actions CI workflow
- Basic VS Code Dev Container configuration
- MIT License and minimal README

**What's Missing:**
- No `package.json` or workspace configuration
- No build system or package manager configured
- No linting, formatting, or testing setup
- No TypeScript configuration
- No `.gitignore` file
- No actual application or package code
- CI workflow is a placeholder (no real tests/builds)

**Recommendation:** Before implementing features, establish foundational tooling (package manager, build system, linting, testing). Always check if these are configured before proceeding with feature development.

---

## Repository Structure

```
/home/user/Allori/
├── .devcontainer/
│   └── devcontainer.json         # VS Code Dev Container config
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI (placeholder)
├── apps/
│   └── .gitkeep                  # Future applications (web, mobile, api)
├── packages/
│   └── .gitkeep                  # Future shared packages (ui, utils, config)
├── docs/
│   └── .gitkeep                  # Future documentation
├── LICENSE                       # MIT License
├── README.md                     # Project overview
└── CLAUDE.md                     # This file
```

### Directory Purposes

#### `apps/`
- **Purpose:** Contains standalone applications
- **Examples:** web app, mobile app, API server, admin dashboard
- **Naming:** Descriptive names (e.g., `web`, `api`, `mobile`, `admin`)
- **Current State:** Empty (placeholder only)

#### `packages/`
- **Purpose:** Shared code and libraries used across applications
- **Examples:**
  - `ui-components` - Shared React/Vue components
  - `utils` - Common utility functions
  - `config` - Shared configuration (ESLint, TypeScript, etc.)
  - `types` - Shared TypeScript types
  - `api-client` - API client library
- **Naming:** Descriptive, kebab-case names
- **Current State:** Empty (placeholder only)

#### `docs/`
- **Purpose:** Project documentation
- **Examples:** Architecture decisions, API docs, setup guides, troubleshooting
- **Current State:** Empty (placeholder only)

---

## Development Workflows

### Initial Setup (When Starting Fresh)

Since this is a skeleton project, the first developer/AI assistant will need to:

1. **Choose and Configure Package Manager**
   - Options: npm, yarn, or pnpm (pnpm recommended for monorepos)
   - Create root `package.json` with workspace configuration
   - Add workspace definitions for `apps/*` and `packages/*`

2. **Add `.gitignore`**
   ```gitignore
   # Dependencies
   node_modules/
   .pnp
   .pnp.js

   # Build outputs
   dist/
   build/
   .next/
   out/

   # Environment variables
   .env
   .env*.local

   # IDE
   .vscode/
   .idea/
   *.swp
   *.swo

   # OS
   .DS_Store
   Thumbs.db

   # Testing
   coverage/
   .nyc_output/

   # Logs
   *.log
   npm-debug.log*
   yarn-debug.log*
   ```

3. **Configure TypeScript (Recommended)**
   - Create root `tsconfig.json` with base configuration
   - Create workspace-specific configs that extend the root
   - Configure path aliases for cleaner imports

4. **Set Up Linting and Formatting**
   - ESLint configuration (`.eslintrc.json`)
   - Prettier configuration (`.prettierrc`)
   - EditorConfig (`.editorconfig`)
   - Pre-commit hooks with husky and lint-staged

5. **Configure Testing Framework**
   - Choose: Jest, Vitest, or other
   - Add test scripts to package.json
   - Configure coverage thresholds

6. **Update CI Workflow**
   - Replace placeholder with actual build/test commands
   - Add dependency caching
   - Add code quality checks

### Adding a New Application

1. Create directory in `apps/` (e.g., `apps/web`)
2. Initialize with appropriate framework (Next.js, Vite, etc.)
3. Add to workspace configuration
4. Configure build and dev scripts
5. Add to CI pipeline
6. Update documentation

### Adding a New Package

1. Create directory in `packages/` (e.g., `packages/ui-components`)
2. Initialize with `package.json`
3. Add to workspace configuration
4. Configure build process (if needed)
5. Export main entry point
6. Add README with usage instructions
7. Other workspaces can reference with workspace protocol (e.g., `"@allori/ui-components": "workspace:*"`)

### Development Process

1. **Create Feature Branch**
   - Branch naming: `<type>/<description>` or `claude/<description>-<session-id>`
   - Examples: `feature/add-authentication`, `fix/login-bug`, `docs/setup-guide`

2. **Make Changes**
   - Follow existing patterns and conventions
   - Write tests for new functionality
   - Update documentation as needed
   - Run linters and formatters before committing

3. **Commit Changes**
   - Follow Conventional Commits format
   - Format: `<type>(<scope>): <description>`
   - Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`
   - Examples:
     - `feat(web): add user authentication`
     - `fix(api): resolve CORS issue`
     - `docs: update setup instructions`
     - `chore: configure ESLint`

4. **Push and Create PR**
   - Push to feature branch: `git push -u origin <branch-name>`
   - Create pull request targeting `main` branch
   - Ensure CI passes before requesting review

---

## Key Conventions

### Commit Message Convention

**Format:** `<type>(<scope>): <description>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `chore`: Maintenance tasks (dependencies, config)
- `refactor`: Code restructuring without behavior change
- `test`: Adding or updating tests
- `style`: Code formatting (no logic change)
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat(auth): implement JWT authentication
fix(api): handle null user profile
docs(readme): add installation instructions
chore(deps): upgrade React to 18.2
refactor(utils): simplify date formatting
test(auth): add login integration tests
```

### Branch Naming Convention

- **Feature:** `feature/<description>` or `feat/<description>`
- **Bug Fix:** `fix/<description>` or `bugfix/<description>`
- **Documentation:** `docs/<description>`
- **Chore:** `chore/<description>`
- **Claude AI Branches:** `claude/<description>-<session-id>`

**Examples:**
- `feature/user-dashboard`
- `fix/authentication-error`
- `docs/api-documentation`
- `chore/setup-eslint`
- `claude/add-testing-framework-abc123`

### File and Folder Naming

- **Directories:** kebab-case (e.g., `ui-components`, `api-client`)
- **Source Files:** Depends on framework/language
  - TypeScript/JavaScript: camelCase or PascalCase for components
  - Config files: lowercase with dots (e.g., `.eslintrc.json`)
- **Test Files:** `*.test.ts`, `*.spec.ts`, or `__tests__/` directory

### Code Style (To Be Established)

When establishing code style:
- Use ESLint for code quality
- Use Prettier for formatting
- Configure EditorConfig for consistency
- Set up pre-commit hooks to enforce
- Document any project-specific preferences

---

## Technologies & Tooling

### Current Stack

**Confirmed:**
- Node.js 18 (CI configuration)
- Debian Bullseye (Dev Container)
- GitHub Actions (CI/CD)

**To Be Decided:**
- Package manager (npm/yarn/pnpm)
- Monorepo tool (Turborepo/Nx/Lerna/workspaces-only)
- Frontend framework (React/Vue/Svelte/etc.)
- Backend framework (Express/Fastify/NestJS/etc.)
- Language variant (JavaScript/TypeScript)
- Build tool (Vite/Webpack/esbuild/Turbopack)
- Testing framework (Jest/Vitest/Mocha)
- Database (if applicable)

### Recommended Tools for Monorepo

1. **Package Manager:** pnpm (best monorepo support, efficient)
2. **Monorepo Tool:** Turborepo (fast builds, good caching)
3. **Language:** TypeScript (type safety, better DX)
4. **Linting:** ESLint with TypeScript support
5. **Formatting:** Prettier
6. **Testing:** Vitest (fast, Vite-compatible)
7. **Git Hooks:** husky + lint-staged
8. **Commit Linting:** commitlint

---

## Git Workflow

### Branch Strategy

- **Main Branch:** `main` (protected, requires PR)
- **Feature Branches:** Created from `main`, merged via PR
- **Branch Protection:** Should be enabled on `main` (if not, recommend it)

### Standard Workflow

```bash
# 1. Ensure you're on the correct branch
git checkout <feature-branch>

# 2. Make your changes
# ... edit files ...

# 3. Stage changes
git add <files>

# 4. Commit with conventional commit message
git commit -m "feat(scope): description"

# 5. Push to remote
git push -u origin <feature-branch>

# 6. Create PR via GitHub UI or gh CLI
gh pr create --title "Title" --body "Description"
```

### Git Best Practices

1. **Commit Often:** Small, logical commits are better than large ones
2. **Write Clear Messages:** Follow conventional commits format
3. **Pull Before Push:** Avoid conflicts by staying updated
4. **Review Before Committing:** Check `git status` and `git diff`
5. **Don't Commit Secrets:** Use `.env` files (gitignored) for sensitive data
6. **Test Before Pushing:** Run tests locally to catch issues early

### Working with Remotes

```bash
# Check current branch
git status

# Fetch latest changes
git fetch origin <branch-name>

# Pull with retry on network failure (up to 4 times, exponential backoff)
git pull origin <branch-name>

# Push with retry on network failure (up to 4 times, exponential backoff)
git push -u origin <branch-name>
```

**Note:** Branch names for pushing should start with `claude/` and end with matching session ID for AI assistant branches.

---

## CI/CD Pipeline

### Current CI Configuration

**File:** `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` branch
- Pull requests targeting `main` branch

**Current Jobs:**
- Checkout code
- Set up Node.js 18
- Placeholder echo statement (no real tests)

### Recommended CI Enhancements

When the project has actual code, the CI should:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'  # or 'npm'/'yarn'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()
```

### CI Best Practices

1. **Cache Dependencies:** Use `cache: 'pnpm'` in setup-node action
2. **Fail Fast:** Run quick checks (lint, type-check) before slow ones (tests)
3. **Parallel Jobs:** Run independent tasks (lint, test, build) in parallel when possible
4. **Code Coverage:** Track and report test coverage
5. **Security Scanning:** Add Dependabot or Snyk for dependency scanning
6. **Preview Deployments:** Consider deploying PR previews for apps

---

## Common Tasks

### Task: Set Up New Workspace

```bash
# 1. Choose package manager and create root package.json
pnpm init

# 2. Configure workspace
# Add to package.json:
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}

# 3. Add .gitignore
touch .gitignore
# (populate with standard ignores)

# 4. Install workspace dependencies
pnpm install
```

### Task: Add TypeScript

```bash
# 1. Install TypeScript
pnpm add -D -w typescript

# 2. Create root tsconfig.json
npx tsc --init

# 3. Configure for monorepo (add to tsconfig.json)
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "paths": {
      "@allori/*": ["./packages/*/src"]
    }
  }
}
```

### Task: Add ESLint and Prettier

```bash
# 1. Install ESLint and Prettier
pnpm add -D -w eslint prettier eslint-config-prettier

# 2. Initialize ESLint
npx eslint --init

# 3. Create .prettierrc
echo '{ "semi": true, "singleQuote": true }' > .prettierrc

# 4. Add lint scripts to package.json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### Task: Add Pre-commit Hooks

```bash
# 1. Install husky and lint-staged
pnpm add -D -w husky lint-staged

# 2. Initialize husky
npx husky init

# 3. Add pre-commit hook
echo "npx lint-staged" > .husky/pre-commit

# 4. Configure lint-staged in package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Task: Create New App

```bash
# Example: Create a Next.js app
cd apps
npx create-next-app@latest web --typescript --tailwind --app

# Add to root package.json scripts:
{
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "build:web": "pnpm --filter web build"
  }
}
```

### Task: Create New Package

```bash
# 1. Create package directory
mkdir -p packages/utils

# 2. Initialize package
cd packages/utils
pnpm init

# 3. Configure package.json
{
  "name": "@allori/utils",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}

# 4. Create src/index.ts
mkdir src
echo "export const hello = () => 'Hello from utils';" > src/index.ts

# 5. Add tsconfig.json (extends root)
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### Task: Run Tests

```bash
# Install test framework (example: Vitest)
pnpm add -D -w vitest

# Add test script to package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  }
}

# Run tests
pnpm test
```

---

## Important Notes for AI Assistants

### Critical Guidelines

1. **Check Project State First**
   - This is a skeleton project with minimal setup
   - Always verify if foundational tools (package.json, TypeScript, linting) are configured before implementing features
   - If missing, propose setting them up first or ask the user

2. **Monorepo Awareness**
   - Understand workspace structure: apps/ vs packages/
   - Use workspace protocol for internal dependencies
   - Run commands with proper workspace filters (e.g., `pnpm --filter web dev`)

3. **Follow Conventions**
   - Use conventional commits for all commits
   - Follow branch naming conventions
   - Maintain consistency with existing code style (once established)

4. **Don't Over-Engineer**
   - Keep solutions simple and focused
   - Only add what's requested or clearly necessary
   - Don't add unnecessary abstractions or future-proofing
   - Don't add comments/docs to code you didn't change

5. **Test Before Committing**
   - Run linters and formatters (once configured)
   - Run tests (once tests exist)
   - Verify builds succeed (once build system exists)
   - Check `git status` and `git diff` before committing

6. **Security Awareness**
   - Never commit secrets, API keys, or credentials
   - Validate user input at system boundaries
   - Be aware of common vulnerabilities (XSS, SQL injection, CSRF, etc.)
   - Use environment variables for configuration

7. **Communication**
   - Be transparent about what exists vs. what needs to be created
   - If multiple approaches are valid, explain trade-offs
   - If setup is required before feature work, communicate this clearly
   - Ask clarifying questions when requirements are ambiguous

### When Adding Features

**Before implementing:**
1. Check if the necessary tooling exists (build system, test framework, etc.)
2. Understand which workspace the feature belongs to (app vs package)
3. Check if similar patterns exist in the codebase
4. Verify dependencies are available or need to be added

**During implementation:**
1. Follow existing code patterns and conventions
2. Write tests alongside feature code (when testing is set up)
3. Update types/interfaces (if using TypeScript)
4. Keep changes focused and minimal

**After implementation:**
1. Run linters and formatters
2. Run tests to ensure nothing broke
3. Update documentation if needed
4. Commit with conventional commit message
5. Push to feature branch

### When Debugging Issues

1. **Read Error Messages Carefully:** They usually tell you exactly what's wrong
2. **Check Recent Changes:** Use `git diff` and `git log`
3. **Verify Dependencies:** Ensure all packages are installed
4. **Check Configuration:** Verify config files are correct
5. **Isolate the Problem:** Reproduce with minimal example
6. **Search Existing Issues:** Check GitHub issues for similar problems

### Decision-Making Framework

**When you need to make a choice:**

1. **If it's fundamental architecture:** Ask the user (package manager, framework, database)
2. **If it's following a pattern:** Match existing code style
3. **If it's a best practice:** Apply industry standards (TypeScript, ESLint, testing)
4. **If it's unclear:** Ask for clarification rather than guessing

**When proposing solutions:**

1. Present the simplest solution first
2. Mention trade-offs if applicable
3. Explain why you recommend a particular approach
4. Offer alternatives if multiple valid options exist

### Resources and References

When you need to:
- **Learn about a package:** Check its official documentation
- **Understand a pattern:** Look for examples in the codebase
- **Resolve a conflict:** Follow the project's conventions (if established)
- **Make a decision:** Ask the user or propose options with reasoning

---

## Maintenance and Updates

### Keeping This Document Current

As the project evolves, update this document when:
- New tooling is added (package manager, build system, linting)
- Conventions are established or changed
- New workspaces (apps/packages) are added
- CI/CD pipeline is enhanced
- Development workflows change

### Version History

- **2026-01-04:** Initial creation - documented skeleton project state
- *(Future updates will be tracked here)*

---

## Questions or Issues?

If you encounter:
- Missing information in this guide
- Outdated instructions
- Ambiguous conventions
- Questions about architecture

**Action:** Ask the user or project maintainer for clarification, then update this document accordingly.

---

**Remember:** This is a living document. As the Allori project grows and evolves, so should this guide. Keep it accurate, comprehensive, and helpful for all AI assistants working on this codebase.
