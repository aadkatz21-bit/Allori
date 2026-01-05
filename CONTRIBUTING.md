# Contributing to Allori

Thank you for your interest in contributing to Allori! This guide will help you get started.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Performance Guidelines](#performance-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Allori.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests and linting
6. Submit a pull request

## Performance Guidelines

⚡ **Performance is a priority** in this project. All contributions should consider performance impact.

### Before Submitting

- [ ] Run linting: `npm run lint`
- [ ] Check for performance anti-patterns (see [Performance Checklist](docs/PERFORMANCE_CHECKLIST.md))
- [ ] Profile your changes if they affect critical paths
- [ ] Ensure bundle size hasn't increased significantly
- [ ] Run performance tests if applicable

### Performance Review Checklist

Your PR will be reviewed for:
- Algorithm efficiency (time complexity)
- Memory usage
- Unnecessary re-renders (React)
- Database query optimization
- Proper async/await usage
- Caching implementation
- Resource cleanup

See [Performance Guidelines](docs/PERFORMANCE_GUIDELINES.md) for details.

## Pull Request Process

1. **Update Documentation**: If your changes affect public APIs or add features, update the docs
2. **Add Tests**: Include tests for new functionality
3. **Run Linting**: `npm run lint:fix`
4. **Check Performance**: 
   ```bash
   npm run performance:lighthouse  # For frontend changes
   npm run performance:load        # For backend changes
   ```
5. **Write Clear Commit Messages**:
   - Use present tense ("Add feature" not "Added feature")
   - Reference issues: "Fix #123: Optimize user query"
   - Include performance impact if relevant: "Reduce bundle size by 50KB"

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Breaking change
- [ ] Documentation update

## Performance Impact
- Bundle size change: +/- X KB
- Performance metrics: (include before/after if relevant)
- Load time impact: (if measurable)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Performance tests pass (if applicable)
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Performance impact assessed
```

## Coding Standards

### General Principles

1. **Write readable code** - Clarity over cleverness
2. **Keep it simple** - Don't over-engineer
3. **Test your code** - Include unit and integration tests
4. **Document complex logic** - Help future maintainers
5. **Optimize wisely** - Measure before optimizing

### JavaScript/TypeScript

- Use ESLint configuration provided (`.eslintrc.json`)
- Prefer `const` over `let`, avoid `var`
- Use async/await over raw Promises
- Avoid `any` in TypeScript
- Use meaningful variable names

### React

- Use functional components with hooks
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Clean up effects properly
- Avoid creating functions in JSX

### Performance Patterns

Follow patterns in [Performance Patterns](docs/PERFORMANCE_PATTERNS.md):
- Use appropriate data structures
- Avoid N+1 queries
- Implement proper caching
- Use connection pooling
- Parallelize independent async operations

### Database

- Add indexes for queried columns
- Use parameterized queries (prevent SQL injection)
- Implement pagination for large datasets
- Use transactions for related operations

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.spec.js
```

### Performance Tests

```bash
# Frontend performance
npm run performance:lighthouse

# Backend load testing
npm run performance:load

# Profile Node.js application
npm run profile
```

## Documentation

When adding features, update:
- README.md - If it affects getting started or main features
- API documentation - For API changes
- Code comments - For complex logic
- Performance docs - If introducing new patterns

## Getting Help

- Check [Performance Guidelines](docs/PERFORMANCE_GUIDELINES.md)
- Review [Performance Patterns](docs/PERFORMANCE_PATTERNS.md)
- See [Performance Testing](docs/PERFORMANCE_TESTING.md)
- Open a discussion for questions
- Create an issue for bugs

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Allori! 🎉
