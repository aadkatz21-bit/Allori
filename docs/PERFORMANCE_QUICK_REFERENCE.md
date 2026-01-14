# Performance Quick Reference

A quick reference guide for common performance optimizations.

## 🚀 Quick Wins

### Frontend
- ✅ Enable gzip/brotli compression
- ✅ Lazy load images (`loading="lazy"`)
- ✅ Use WebP/AVIF image formats
- ✅ Code split routes with dynamic imports
- ✅ Remove unused dependencies
- ✅ Enable tree-shaking

### Backend
- ✅ Add database indexes on queried columns
- ✅ Use connection pooling
- ✅ Enable response caching
- ✅ Implement rate limiting
- ✅ Use CDN for static assets
- ✅ Enable HTTP/2

## 🔍 Profiling Commands

```bash
# Frontend
lighthouse http://localhost:3000 --view
npx webpack-bundle-analyzer dist/stats.json

# Backend (Node.js)
node --prof app.js
node --prof-process isolate-*.log > profile.txt
clinic doctor -- node app.js

# Load testing
k6 run tests/performance/load-test.js
artillery quick --count 10 --num 50 http://localhost:3000
```

## 📊 Performance Budgets

| Metric | Target | Critical |
|--------|--------|----------|
| FCP | < 1.8s | < 3s |
| LCP | < 2.5s | < 4s |
| TBT | < 300ms | < 600ms |
| CLS | < 0.1 | < 0.25 |
| API (p95) | < 500ms | < 1s |
| Bundle | < 300KB | < 500KB |

## 🎯 Common Issues & Fixes

### React Re-renders
```jsx
// ❌ Bad
<Child onClick={() => handleClick()} />

// ✅ Good
const handleClick = useCallback(() => {}, []);
<Child onClick={handleClick} />
```

### N+1 Queries
```javascript
// ❌ Bad
for (const user of users) {
  user.posts = await fetchPosts(user.id);
}

// ✅ Good
const users = await User.findAll({ include: [Post] });
```

### Large Lists
```jsx
// ❌ Bad
{items.map(item => <Item />)}

// ✅ Good
<VirtualList items={items} />
```

### Sequential Async
```javascript
// ❌ Bad
const a = await fetchA();
const b = await fetchB();

// ✅ Good
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

## 🔧 Essential Tools

- **Lighthouse**: Web performance auditing
- **k6**: Load testing
- **Chrome DevTools**: Profiling
- **Clinic.js**: Node.js profiling
- **React DevTools Profiler**: Component profiling

## 📚 Documentation

- [Performance Guidelines](./PERFORMANCE_GUIDELINES.md) - Complete guide
- [Performance Testing](./PERFORMANCE_TESTING.md) - Testing setup
- [Performance Checklist](./PERFORMANCE_CHECKLIST.md) - Review checklist
- [Performance Patterns](./PERFORMANCE_PATTERNS.md) - Code examples
- [ESLint Config](./ESLINT_CONFIG.md) - Linting rules

## 🎓 Key Principles

1. **Measure First** - Profile before optimizing
2. **Set Budgets** - Define acceptable performance
3. **Automate Checks** - Add to CI/CD
4. **Monitor Trends** - Track over time
5. **Optimize Wisely** - Focus on bottlenecks

## ⚡ Performance Tips by Technology

### React
- Use `React.memo` for expensive components
- Implement `useCallback` and `useMemo`
- Virtual scroll long lists
- Code split with lazy loading

### Node.js
- Use async/await properly
- Enable clustering for multi-core
- Stream large files
- Cache expensive operations

### Database
- Index frequently queried columns
- Use explain to analyze queries
- Implement connection pooling
- Cache query results

### API
- Implement pagination
- Use GraphQL for flexible queries
- Enable response compression
- Add proper cache headers

## 🚨 Red Flags

Watch out for:
- Nested loops with large datasets
- `await` inside loops
- Creating functions in render
- Missing database indexes
- No caching strategy
- Synchronous file operations
- Memory leaks from listeners
- N+1 query problems

## 📞 Getting Help

If you notice performance issues:
1. Run profiling tools to identify bottleneck
2. Check the relevant guide in `/docs`
3. Review code against the checklist
4. Measure improvement after changes

---

**Remember**: Premature optimization is the root of all evil. Always measure!
