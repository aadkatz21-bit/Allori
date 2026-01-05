# Performance Optimization Checklist

Use this checklist when reviewing code for performance issues or optimizing existing code.

## Pre-Optimization

- [ ] Profile the application to identify actual bottlenecks
- [ ] Set performance baselines and goals
- [ ] Identify critical user paths
- [ ] Determine acceptable performance budgets

## Code Review Checklist

### General

- [ ] Algorithms use appropriate time complexity (avoid O(n²) when O(n log n) or O(n) is possible)
- [ ] Appropriate data structures are used (Map/Set for lookups vs Array)
- [ ] No unnecessary computations inside loops
- [ ] Expensive operations are memoized or cached when appropriate
- [ ] Resources are properly cleaned up (event listeners, timers, connections)
- [ ] No memory leaks (check for lingering references, closures)

### Frontend Specific

#### React/Component Performance

- [ ] Components don't create new objects/arrays/functions in render
- [ ] Large lists use virtualization (react-window, react-virtualized)
- [ ] Expensive computations use `useMemo`
- [ ] Callbacks use `useCallback` to prevent re-renders
- [ ] Context providers don't create new objects on every render
- [ ] Component dependencies in hooks are correct (no missing deps)
- [ ] Appropriate component split (not too granular, not too large)
- [ ] Keys for lists are stable and unique (not array indices)

#### Images and Assets

- [ ] Images are optimized and compressed
- [ ] Appropriate image formats used (WebP, AVIF)
- [ ] Images use lazy loading
- [ ] Responsive images implemented with srcset
- [ ] SVGs are optimized (SVGO)
- [ ] Icons use sprite sheets or icon fonts
- [ ] Large assets are served from CDN

#### Bundle and Loading

- [ ] Code splitting implemented for routes
- [ ] Dynamic imports used for heavy components
- [ ] Tree-shaking configured properly
- [ ] Bundle size is within budget (< 300KB main bundle)
- [ ] No unused dependencies in package.json
- [ ] Dependencies are up-to-date
- [ ] Polyfills are only included when necessary

#### Network and API

- [ ] API responses are paginated for large datasets
- [ ] Appropriate caching strategies implemented
- [ ] Request deduplication for identical requests
- [ ] Debouncing/throttling for frequent events (search, scroll)
- [ ] Compression enabled (gzip, brotli)
- [ ] GraphQL queries request only needed fields

#### Rendering

- [ ] No layout thrashing (batch DOM reads/writes)
- [ ] Animations use CSS transforms (GPU-accelerated)
- [ ] `requestAnimationFrame` used for JS animations
- [ ] Intersection Observer used for visibility detection
- [ ] No forced synchronous layouts
- [ ] CSS contained with `contain` property where appropriate

### Backend Specific

#### Database

- [ ] Indexes exist on frequently queried columns
- [ ] N+1 queries eliminated (use joins or batch loading)
- [ ] Query only necessary columns (avoid SELECT *)
- [ ] Pagination implemented for large result sets
- [ ] Connection pooling configured
- [ ] Query result caching where appropriate
- [ ] Appropriate batch sizes for bulk operations

#### API Design

- [ ] Endpoints return only necessary data
- [ ] Response compression enabled
- [ ] Caching headers properly configured
- [ ] Rate limiting implemented
- [ ] Bulk operations available for batch updates
- [ ] Webhooks preferred over polling where possible

#### Async Operations

- [ ] I/O operations are non-blocking
- [ ] Parallel processing used where appropriate (Promise.all)
- [ ] No `await` in loops (use Promise.all instead)
- [ ] Long-running tasks use background jobs/queues
- [ ] Proper error handling for async operations
- [ ] No blocking the event loop in Node.js

#### Caching

- [ ] Multi-layer caching strategy implemented
- [ ] Cache invalidation strategy defined
- [ ] Appropriate TTLs configured
- [ ] Memory cache (Redis) for frequently accessed data
- [ ] CDN caching for static assets
- [ ] Application-level caching where appropriate

#### Memory Management

- [ ] No memory leaks from unclosed connections
- [ ] Event emitters cleaned up properly
- [ ] Large objects released when no longer needed
- [ ] Streams used for large file processing
- [ ] Appropriate data structures for memory efficiency

### JavaScript/TypeScript Specific

- [ ] Avoid synchronous operations in Node.js (fs.readFileSync, etc.)
- [ ] Use const/let instead of var (block scoping)
- [ ] Array methods appropriate for use case:
  - `for` loop for simple iterations
  - `reduce` for complex transformations
  - `map/filter` for simple transformations
- [ ] Generators used for large datasets
- [ ] String concatenation uses template literals
- [ ] Object destructuring used efficiently
- [ ] No unnecessary type coercions
- [ ] Regular expressions compiled once, not in loops

### Python Specific

- [ ] List comprehensions used instead of loops where appropriate
- [ ] Generators used for large datasets
- [ ] Appropriate data structures (set for membership tests)
- [ ] `with` statements for resource management
- [ ] Built-in functions used (sum, map, filter)
- [ ] NumPy used for numerical computations
- [ ] String operations use appropriate methods (join vs concatenation)

## Testing Checklist

- [ ] Performance tests exist for critical paths
- [ ] Load tests verify system handles expected traffic
- [ ] Performance budgets defined and monitored
- [ ] CI/CD includes performance testing
- [ ] Performance metrics tracked over time
- [ ] Lighthouse CI or similar tool integrated

## Monitoring Checklist

- [ ] Application Performance Monitoring (APM) configured
- [ ] Key metrics tracked:
  - Response times (p50, p95, p99)
  - Error rates
  - Throughput
  - Resource utilization (CPU, memory)
- [ ] Alerts configured for performance degradation
- [ ] User-centric metrics tracked (Core Web Vitals)
- [ ] Database query performance monitored
- [ ] Logs aggregated and searchable

## Post-Deployment

- [ ] Monitor for performance regressions
- [ ] Compare metrics to baseline
- [ ] User feedback collected
- [ ] A/B test performance changes if possible
- [ ] Document performance improvements
- [ ] Update performance baselines

## Common Anti-Patterns to Watch For

### Frontend
- ❌ Creating functions/objects in render
- ❌ Not cleaning up effects
- ❌ Missing dependencies in hooks
- ❌ Using array index as key
- ❌ Not virtualizing long lists
- ❌ Prop drilling (use Context)
- ❌ Synchronous file operations

### Backend
- ❌ N+1 queries
- ❌ Not using connection pooling
- ❌ Blocking event loop
- ❌ Missing database indexes
- ❌ No caching strategy
- ❌ Not implementing rate limiting
- ❌ Synchronous operations

### General
- ❌ Premature optimization
- ❌ Not measuring before optimizing
- ❌ Nested loops with high complexity
- ❌ Memory leaks
- ❌ Not cleaning up resources
- ❌ Inefficient algorithms
- ❌ Not leveraging built-in optimizations

## Tools to Use

### Profiling
- Chrome DevTools Performance tab
- React DevTools Profiler
- Node.js --prof flag
- Clinic.js
- Python cProfile

### Testing
- Lighthouse CI
- k6
- Artillery
- WebPageTest
- JMeter

### Monitoring
- New Relic
- Datadog
- Sentry
- Prometheus + Grafana
- Google Analytics

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Performance Guidelines](./PERFORMANCE_GUIDELINES.md)
- [Performance Testing](./PERFORMANCE_TESTING.md)
- [ESLint Configuration](./ESLINT_CONFIG.md)

---

Remember: **Measure, don't guess.** Always profile before and after optimization to verify improvements.
