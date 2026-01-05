# Performance Monitoring Setup Example

This directory contains example configurations for performance monitoring tools.

## Available Examples

### 1. Lighthouse CI Configuration
- File: `../.lighthouserc.json`
- Purpose: Automated performance testing for frontend applications
- Usage: `lhci autorun`

### 2. k6 Load Testing
- File: `../tests/performance/load-test.js`
- Purpose: Backend load and performance testing
- Usage: `k6 run tests/performance/load-test.js`

### 3. ESLint Configuration
- File: `../.eslintrc.json`
- Purpose: Catch performance anti-patterns during development
- Usage: `npm run lint`

## Setting Up Monitoring

### 1. Local Development

#### Real-Time Performance Monitoring
```javascript
// Add to your app entry point
if (typeof window !== 'undefined' && window.performance) {
  // Monitor page load performance
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
  });

  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          console.log('CLS:', clsScore);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}
```

### 2. Production Monitoring

#### Using Sentry Performance Monitoring
```javascript
// Install: npm install @sentry/react @sentry/tracing

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new BrowserTracing()],
  
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions for testing
  
  // Set custom performance thresholds
  beforeSend(event) {
    // Filter out events that don't meet criteria
    return event;
  },
});

// Custom transaction
const transaction = Sentry.startTransaction({
  name: "expensive-operation",
});

// Do work...
transaction.finish();
```

#### Using New Relic
```javascript
// Install: npm install newrelic

// newrelic.js configuration
exports.config = {
  app_name: ['Allori'],
  license_key: 'YOUR_LICENSE_KEY',
  logging: {
    level: 'info'
  },
  // Performance monitoring settings
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    record_sql: 'obfuscated',
  },
  browser_monitoring: {
    enable: true
  }
};

// In your app entry:
require('newrelic');
```

### 3. Custom Performance Metrics

#### Backend (Node.js + Express)
```javascript
const express = require('express');
const app = express();

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    // Send to monitoring service
    // sendToMonitoring({
    //   method: req.method,
    //   path: req.path,
    //   duration,
    //   statusCode: res.statusCode,
    //   timestamp: new Date().toISOString()
    // });
  });
  
  next();
});

// Memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log({
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
  });
}, 60000); // Every minute
```

### 4. CI/CD Performance Gates

#### GitHub Actions Performance Gate
```yaml
# Add to .github/workflows/ci.yml
- name: Performance Gate
  run: |
    # Run performance tests
    npm run performance:lighthouse
    
    # Check bundle size
    BUNDLE_SIZE=$(du -sb dist/main.js | cut -f1)
    MAX_SIZE=$((300 * 1024))  # 300KB
    
    if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
      echo "Bundle size exceeds limit: $BUNDLE_SIZE bytes > $MAX_SIZE bytes"
      exit 1
    fi
    
    # Run load tests
    k6 run --quiet tests/performance/load-test.js
    
    # Check for performance regressions
    if [ -f .performance-baseline.json ]; then
      npm run compare-performance
    fi
```

### 5. Database Query Monitoring

#### Sequelize (SQL)
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres',
  logging: (sql, timing) => {
    if (timing > 100) {
      console.warn(`Slow query (${timing}ms):`, sql);
    }
  },
  benchmark: true,
});

// Query monitoring
sequelize.addHook('beforeQuery', (options) => {
  options.startTime = Date.now();
});

sequelize.addHook('afterQuery', (options) => {
  const duration = Date.now() - options.startTime;
  if (duration > 100) {
    console.warn(`Slow query detected: ${duration}ms`);
    // Send alert
  }
});
```

#### MongoDB
```javascript
const mongoose = require('mongoose');

// Enable query logging
mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query));
});

// Monitor slow queries
mongoose.connection.on('connected', () => {
  const db = mongoose.connection.db;
  db.setProfilingLevel(1, { slowms: 100 }); // Log queries > 100ms
});
```

## Alerting Setup

### Performance Alert Thresholds
```javascript
const PERFORMANCE_THRESHOLDS = {
  // Frontend (milliseconds)
  FCP: 1800,
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTI: 3800,
  
  // Backend (milliseconds)
  API_P95: 500,
  API_P99: 1000,
  
  // Resources
  CPU_PERCENT: 70,
  MEMORY_PERCENT: 80,
  
  // Errors
  ERROR_RATE_PERCENT: 1,
};

function checkPerformance(metrics) {
  const alerts = [];
  
  if (metrics.lcp > PERFORMANCE_THRESHOLDS.LCP) {
    alerts.push(`LCP exceeded: ${metrics.lcp}ms > ${PERFORMANCE_THRESHOLDS.LCP}ms`);
  }
  
  if (metrics.apiP95 > PERFORMANCE_THRESHOLDS.API_P95) {
    alerts.push(`API P95 exceeded: ${metrics.apiP95}ms > ${PERFORMANCE_THRESHOLDS.API_P95}ms`);
  }
  
  if (alerts.length > 0) {
    // Send alerts via Slack, email, PagerDuty, etc.
    sendAlert(alerts);
  }
}
```

## Dashboard Setup

### Grafana + Prometheus Example
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['localhost:3000']
```

```javascript
// Add Prometheus metrics to your Node.js app
const promClient = require('prom-client');
const express = require('express');

const app = express();

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 500, 1000, 2000, 5000]
});

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

## Resources

- [Performance Guidelines](../docs/PERFORMANCE_GUIDELINES.md)
- [Performance Testing](../docs/PERFORMANCE_TESTING.md)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/performance/)
- [New Relic Documentation](https://docs.newrelic.com/)
- [Prometheus Documentation](https://prometheus.io/docs/)
