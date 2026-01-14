# Common Performance Patterns and Solutions

This document provides practical examples of common performance issues and their solutions.

## Frontend Patterns

### 1. Efficient React Component Updates

#### Problem: Unnecessary Re-renders
```jsx
// ❌ Bad: Component re-renders on every parent render
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id}
          user={user}
          onClick={() => handleUserClick(user.id)}  // New function every render!
        />
      ))}
    </div>
  );
}
```

#### Solution: Memoization
```jsx
// ✅ Good: Optimized with React.memo and useCallback
const UserCard = React.memo(({ user, onClick }) => {
  return <div onClick={onClick}>{user.name}</div>;
});

function UserList({ users }) {
  const handleUserClick = useCallback((userId) => {
    // Handle click
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id}
          user={user}
          onClick={() => handleUserClick(user.id)}
        />
      ))}
    </div>
  );
}
```

### 2. Virtual Scrolling for Large Lists

#### Problem: Rendering 10,000+ Items
```jsx
// ❌ Bad: Renders all items, causes lag
function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Solution: Virtual Scrolling
```jsx
// ✅ Good: Only renders visible items
import { FixedSizeList } from 'react-window';

function ProductList({ products }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={products.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 3. Debouncing Input Events

#### Problem: Too Many API Calls
```jsx
// ❌ Bad: API call on every keystroke
function SearchBox() {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchResults(value);  // Called on every keystroke!
  };

  return <input value={query} onChange={handleChange} />;
}
```

#### Solution: Debounced Search
```jsx
// ✅ Good: Debounced API calls
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

function SearchBox() {
  const [query, setQuery] = useState('');

  const debouncedFetch = useMemo(
    () => debounce((value) => fetchResults(value), 300),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetch(value);
  };

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  return <input value={query} onChange={handleChange} />;
}
```

### 4. Image Optimization

#### Problem: Large, Unoptimized Images
```jsx
// ❌ Bad: Large images loaded eagerly
function Gallery({ images }) {
  return (
    <div>
      {images.map(img => (
        <img key={img.id} src={img.url} alt={img.title} />
      ))}
    </div>
  );
}
```

#### Solution: Responsive, Lazy-Loaded Images
```jsx
// ✅ Good: Optimized images with lazy loading
function Gallery({ images }) {
  return (
    <div>
      {images.map(img => (
        <picture key={img.id}>
          <source 
            srcSet={`${img.url}?w=400&format=webp 400w, 
                     ${img.url}?w=800&format=webp 800w`}
            type="image/webp"
          />
          <img
            src={`${img.url}?w=800`}
            srcSet={`${img.url}?w=400 400w, ${img.url}?w=800 800w`}
            sizes="(max-width: 768px) 400px, 800px"
            loading="lazy"
            alt={img.title}
          />
        </picture>
      ))}
    </div>
  );
}
```

## Backend Patterns

### 1. Avoiding N+1 Queries

#### Problem: Multiple Database Queries
```javascript
// ❌ Bad: N+1 query problem
async function getUsersWithPosts() {
  const users = await User.findAll();
  
  for (const user of users) {
    user.posts = await Post.findAll({ where: { userId: user.id } });
  }
  
  return users;
}
```

#### Solution: Single Query with Join
```javascript
// ✅ Good: Single query with eager loading
async function getUsersWithPosts() {
  return User.findAll({
    include: [{
      model: Post,
      as: 'posts'
    }]
  });
}

// Or with DataLoader for GraphQL
const postLoader = new DataLoader(async (userIds) => {
  const posts = await Post.findAll({
    where: { userId: { [Op.in]: userIds } }
  });
  
  return userIds.map(id => 
    posts.filter(post => post.userId === id)
  );
});
```

### 2. Efficient Pagination

#### Problem: Offset-Based Pagination at Scale
```javascript
// ❌ Bad: Slow for large offsets
async function getProducts(page, pageSize) {
  const offset = (page - 1) * pageSize;
  return Product.findAll({
    offset,
    limit: pageSize
  });
}
```

#### Solution: Cursor-Based Pagination
```javascript
// ✅ Good: Cursor-based pagination
async function getProducts(cursor, pageSize) {
  const where = cursor ? { id: { [Op.gt]: cursor } } : {};
  
  const products = await Product.findAll({
    where,
    limit: pageSize + 1,  // Fetch one extra to check if there's a next page
    order: [['id', 'ASC']]
  });
  
  const hasNextPage = products.length > pageSize;
  const items = hasNextPage ? products.slice(0, -1) : products;
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;
  
  return { items, nextCursor, hasNextPage };
}
```

### 3. Caching Strategy

#### Problem: Repeated Expensive Computations
```javascript
// ❌ Bad: Computes on every request
app.get('/api/stats', async (req, res) => {
  const stats = await calculateExpensiveStats();  // Takes 2 seconds
  res.json(stats);
});
```

#### Solution: Multi-Layer Caching
```javascript
// ✅ Good: Multi-layer cache
const NodeCache = require('node-cache');
const memoryCache = new NodeCache({ stdTTL: 300 });  // 5 minutes

app.get('/api/stats', async (req, res) => {
  // Layer 1: Memory cache
  let stats = memoryCache.get('stats');
  
  if (!stats) {
    // Layer 2: Redis cache
    stats = await redis.get('stats');
    
    if (!stats) {
      // Layer 3: Compute and cache
      stats = await calculateExpensiveStats();
      
      // Cache in Redis (15 minutes)
      await redis.setex('stats', 900, JSON.stringify(stats));
    } else {
      stats = JSON.parse(stats);
    }
    
    // Cache in memory
    memoryCache.set('stats', stats);
  }
  
  res.json(stats);
});
```

### 4. Parallel Async Operations

#### Problem: Sequential Async Calls
```javascript
// ❌ Bad: Sequential execution (slow)
async function getUserData(userId) {
  const user = await fetchUser(userId);           // 100ms
  const posts = await fetchUserPosts(userId);     // 150ms
  const comments = await fetchUserComments(userId); // 120ms
  
  return { user, posts, comments };
  // Total time: ~370ms
}
```

#### Solution: Parallel Execution
```javascript
// ✅ Good: Parallel execution (fast)
async function getUserData(userId) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId)
  ]);
  
  return { user, posts, comments };
  // Total time: ~150ms (longest operation)
}

// ✅ Better: With error handling
async function getUserData(userId) {
  const [userResult, postsResult, commentsResult] = await Promise.allSettled([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId)
  ]);
  
  return {
    user: userResult.status === 'fulfilled' ? userResult.value : null,
    posts: postsResult.status === 'fulfilled' ? postsResult.value : [],
    comments: commentsResult.status === 'fulfilled' ? commentsResult.value : []
  };
}
```

### 5. Database Connection Pooling

#### Problem: Creating New Connections
```javascript
// ❌ Bad: New connection for each query
async function getUser(id) {
  const connection = await mysql.createConnection(config);
  const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
  await connection.end();
  return rows[0];
}
```

#### Solution: Connection Pool
```javascript
// ✅ Good: Use connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getUser(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}
```

## JavaScript Patterns

### 1. Array Operations Optimization

#### Problem: Multiple Array Iterations
```javascript
// ❌ Bad: Multiple passes over the array
const activeUsers = users.filter(u => u.isActive);
const premiumUsers = activeUsers.filter(u => u.isPremium);
const userNames = premiumUsers.map(u => u.name);
// 3 iterations
```

#### Solution: Single Pass with Reduce
```javascript
// ✅ Good: Single iteration
const userNames = users.reduce((acc, user) => {
  if (user.isActive && user.isPremium) {
    acc.push(user.name);
  }
  return acc;
}, []);
// 1 iteration
```

### 2. Object Lookup Optimization

#### Problem: Array.find() in Loop
```javascript
// ❌ Bad: O(n²) complexity
function enrichOrders(orders, products) {
  return orders.map(order => ({
    ...order,
    product: products.find(p => p.id === order.productId)
  }));
}
```

#### Solution: Map for O(1) Lookup
```javascript
// ✅ Good: O(n) complexity
function enrichOrders(orders, products) {
  const productMap = new Map(products.map(p => [p.id, p]));
  
  return orders.map(order => ({
    ...order,
    product: productMap.get(order.productId)
  }));
}
```

### 3. Memoization for Expensive Calculations

#### Problem: Repeated Calculations
```javascript
// ❌ Bad: Recalculates every time
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// fibonacci(40) takes seconds
```

#### Solution: Memoization
```javascript
// ✅ Good: Memoized version
function fibonacci() {
  const cache = new Map();
  
  return function fib(n) {
    if (n <= 1) return n;
    
    if (cache.has(n)) {
      return cache.get(n);
    }
    
    const result = fib(n - 1) + fib(n - 2);
    cache.set(n, result);
    return result;
  };
}

const fib = fibonacci();
// fibonacci(40) is instant
```

### 4. Web Workers for Heavy Computation

#### Problem: Blocking Main Thread
```javascript
// ❌ Bad: Blocks UI for seconds
function processLargeDataset(data) {
  // Heavy computation
  return data.map(item => expensiveOperation(item));
}

button.onclick = () => {
  const result = processLargeDataset(hugeArray);  // UI freezes
  updateUI(result);
};
```

#### Solution: Web Worker
```javascript
// ✅ Good: Offload to worker
// worker.js
self.onmessage = (e) => {
  const result = e.data.map(item => expensiveOperation(item));
  self.postMessage(result);
};

// main.js
const worker = new Worker('worker.js');

button.onclick = () => {
  worker.postMessage(hugeArray);  // UI stays responsive
};

worker.onmessage = (e) => {
  updateUI(e.data);
};
```

## Summary

Key takeaways:
1. **Minimize re-renders** in React with memoization
2. **Virtualize long lists** to render only visible items
3. **Debounce/throttle** frequent events
4. **Optimize images** with lazy loading and responsive formats
5. **Avoid N+1 queries** with proper joins or batching
6. **Use cursor-based pagination** for large datasets
7. **Implement caching** at multiple layers
8. **Parallelize async operations** with Promise.all
9. **Use connection pooling** for databases
10. **Choose appropriate data structures** (Map vs Array)
11. **Memoize expensive calculations**
12. **Offload heavy work** to Web Workers

Remember: Always measure before and after optimization to verify improvements!
