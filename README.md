# Allori Repository

This repository serves as the foundation for the Allori project. It follows a monorepo structure with separate directories for applications, packages, and documentation.

## Performance-First Development

This repository is configured with comprehensive performance best practices, tooling, and guidelines to ensure efficient and performant code.

### Documentation

- **[Performance Guidelines](docs/PERFORMANCE_GUIDELINES.md)** - Comprehensive guide covering performance best practices across languages and frameworks
- **[Performance Testing](docs/PERFORMANCE_TESTING.md)** - Instructions for load testing, profiling, and monitoring
- **[Performance Checklist](docs/PERFORMANCE_CHECKLIST.md)** - Code review checklist for performance optimization
- **[ESLint Configuration](docs/ESLINT_CONFIG.md)** - Linting rules to catch performance anti-patterns

### Quick Start

#### Linting for Performance Issues
```bash
npm install
npm run lint
```

#### Running Performance Tests
```bash
# Frontend performance (Lighthouse)
npm run performance:lighthouse

# Backend load testing (k6)
npm run performance:load
```

### Performance Standards

This repository enforces the following performance budgets:

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Total Blocking Time (TBT)**: < 300ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **API Response Time (p95)**: < 500ms
- **Main Bundle Size**: < 300KB

### CI/CD

Performance tests run automatically on every pull request. The CI pipeline includes:
- ESLint for catching performance anti-patterns
- Lighthouse CI for frontend performance
- k6 load tests for backend performance
- Bundle size analysis

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.
