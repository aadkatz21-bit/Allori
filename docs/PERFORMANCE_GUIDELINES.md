# Performance Guidelines for Allori

This document outlines best practices and guidelines for writing efficient, performant code across the Allori monorepo.

## Table of Contents

1. [General Principles](#general-principles)
2. [Language-Specific Guidelines](#language-specific-guidelines)
3. [Database Optimization](#database-optimization)
4. [Frontend Performance](#frontend-performance)
5. [Backend Performance](#backend-performance)
6. [Common Anti-Patterns](#common-anti-patterns)
7. [Performance Testing](#performance-testing)

## General Principles

### 1. Measure Before Optimizing
- Always profile before optimizing
- Use appropriate tools: Chrome DevTools, Node.js profiler, etc.
- Set performance budgets and monitor them in CI

### 2. Algorithm Complexity
- Be aware of Big O notation for time and space complexity
- Avoid nested loops when possible (O(n²) or worse)
- Use appropriate data structures:
  - `Map`/`Set` for lookups (O(1)) instead of `Array.find()` (O(n))
  - Binary search for sorted data (O(log n))

### 3. Lazy Loading and Code Splitting
- Load resources only when needed
- Split large bundles into smaller chunks
- Implement virtual scrolling for long lists

## Language-Specific Guidelines

### JavaScript/TypeScript

#### Avoid Unnecessary Re-renders (React)
```javascript
// ❌ Bad: Creates new object on every render
function Component() {
  const options = { mode: 'dark' };
  return <Child options={options} />;
}

// ✅ Good: Memoize or move outside component
const OPTIONS = { mode: 'dark' };
function Component() {
  return <Child options={OPTIONS} />;
}
```

#### Use Efficient Array Methods
```javascript
// ❌ Bad: Multiple iterations
const result = arr
  .filter(x => x > 0)
  .map(x => x * 2)
  .filter(x => x < 100);

// ✅ Good: Single iteration with reduce
const result = arr.reduce((acc, x) => {
  if (x > 0) {
    const doubled = x * 2;
    if (doubled < 100) acc.push(doubled);
  }
  return acc;
}, []);
```

#### Debounce and Throttle
```javascript
// ❌ Bad: Function called on every input
<input onChange={handleSearch} />

// ✅ Good: Debounced function
import { debounce } from 'lodash';
const debouncedSearch = debounce(handleSearch, 300);
<input onChange={debouncedSearch} />
```

#### Avoid Memory Leaks
```javascript
// ❌ Bad: Event listener not cleaned up
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ Good: Cleanup function
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Python

#### Use List Comprehensions
```python
# ❌ Bad: Slower loop
result = []
for i in range(1000):
    if i % 2 == 0:
        result.append(i * 2)

# ✅ Good: List comprehension
result = [i * 2 for i in range(1000) if i % 2 == 0]
```

#### Use Generators for Large Datasets
```python
# ❌ Bad: Loads everything into memory
def get_all_records():
    return [process(record) for record in fetch_records()]

# ✅ Good: Generator yields one at a time
def get_all_records():
    for record in fetch_records():
        yield process(record)
```

## Database Optimization

### 1. Query Optimization
- Use indexes on frequently queried columns
- Avoid SELECT *; specify only needed columns
- Use connection pooling
- Implement query result caching where appropriate

### 2. N+1 Query Problem
```javascript
// ❌ Bad: N+1 queries
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Good: Single query with join
const users = await User.findAll({
  include: [{ model: Post }]
});
```

### 3. Batch Operations
```javascript
// ❌ Bad: Individual inserts
for (const item of items) {
  await db.insert(item);
}

// ✅ Good: Bulk insert
await db.bulkInsert(items);
```

## Frontend Performance

### 1. Image Optimization
- Use appropriate formats (WebP, AVIF)
- Implement lazy loading for images
- Serve responsive images with `srcset`
- Compress images before upload

### 2. Bundle Size
- Tree-shake unused dependencies
- Use dynamic imports for route-based code splitting
- Analyze bundle with tools like webpack-bundle-analyzer

### 3. Caching Strategies
- Leverage browser caching with proper Cache-Control headers
- Use service workers for offline support
- Implement stale-while-revalidate pattern

### 4. Rendering Performance
- Minimize layout thrashing
- Use CSS transforms for animations (GPU-accelerated)
- Implement virtual scrolling for long lists (react-window, react-virtualized)
- Use `requestAnimationFrame` for animations

## Backend Performance

### 1. Async Operations
- Use async/await for I/O operations
- Implement proper error handling
- Avoid blocking the event loop

### 2. Caching
```javascript
// Implement multi-layer caching
// 1. In-memory cache (Redis)
// 2. CDN cache
// 3. Browser cache
```

### 3. Rate Limiting
- Implement rate limiting to prevent abuse
- Use queues for heavy processing tasks

### 4. API Response Optimization
- Implement pagination for large datasets
- Use compression (gzip, brotli)
- Return only necessary fields
- Implement GraphQL for flexible queries

## Common Anti-Patterns

### 1. Synchronous File I/O in Node.js
```javascript
// ❌ Bad: Blocks event loop
const data = fs.readFileSync('file.txt');

// ✅ Good: Async I/O
const data = await fs.promises.readFile('file.txt');
```

### 2. Not Using Connection Pooling
```javascript
// ❌ Bad: New connection for each query
async function query() {
  const connection = await createConnection();
  const result = await connection.query('SELECT * FROM users');
  await connection.close();
  return result;
}

// ✅ Good: Use connection pool
const pool = createPool({ /* config */ });
async function query() {
  return pool.query('SELECT * FROM users');
}
```

### 3. Inefficient State Updates
```javascript
// ❌ Bad: Causes multiple re-renders
setState({ count: count + 1 });
setState({ name: newName });
setState({ active: true });

// ✅ Good: Batch updates
setState(prev => ({
  ...prev,
  count: prev.count + 1,
  name: newName,
  active: true
}));
```

### 4. Not Cleaning Up Subscriptions
```javascript
// ❌ Bad: Memory leak
const interval = setInterval(() => {
  // do something
}, 1000);

// ✅ Good: Clean up
const interval = setInterval(() => {
  // do something
}, 1000);

// Later or in cleanup:
clearInterval(interval);
```

## Performance Testing

### 1. Load Testing
- Use tools like k6, Apache JMeter, or Artillery
- Test under realistic load conditions
- Monitor resource usage (CPU, memory, network)

### 2. Performance Budgets
Set and monitor performance budgets:
- Time to First Byte (TTFB): < 600ms
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Total Blocking Time (TBT): < 300ms
- Cumulative Layout Shift (CLS): < 0.1

### 3. Continuous Monitoring
- Implement performance monitoring in CI/CD
- Use tools like Lighthouse CI
- Set up alerts for performance regressions

### 4. Profiling
- Use Chrome DevTools Performance tab
- Node.js built-in profiler: `node --prof`
- Clinic.js for Node.js applications
- React DevTools Profiler

## Tools and Resources

### Monitoring and Analysis
- **Lighthouse**: Web performance auditing
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Performance profiling
- **Bundle analyzers**: webpack-bundle-analyzer, source-map-explorer

### Testing
- **k6**: Modern load testing tool
- **Artillery**: Load testing and smoke testing
- **Lighthouse CI**: Automated performance testing

### Runtime Performance
- **Clinic.js**: Node.js performance profiling
- **New Relic/DataDog**: Application performance monitoring
- **Sentry**: Error tracking and performance monitoring

## References

1. [Web.dev Performance](https://web.dev/performance/)
2. [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
3. [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
4. [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

**Remember**: Premature optimization is the root of all evil. Always measure first, then optimize based on data.
