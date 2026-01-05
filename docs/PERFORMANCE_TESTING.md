# Performance Testing Guide

This guide provides instructions and examples for performance testing in the Allori monorepo.

## Types of Performance Tests

### 1. Load Testing
Testing how the system performs under expected load.

### 2. Stress Testing
Testing the system's limits by increasing load beyond normal capacity.

### 3. Spike Testing
Testing how the system handles sudden increases in load.

### 4. Endurance Testing
Testing system performance over an extended period.

## Tools

### Frontend Performance

#### Lighthouse CI
Automated performance testing for web applications.

**Installation:**
```bash
npm install -g @lhci/cli
```

**Configuration** (`.lighthouserc.json`):
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Run:**
```bash
lhci autorun
```

### Backend Performance

#### k6 Load Testing
Modern load testing tool built for developers.

**Installation:**
```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Docker
docker pull grafana/k6
```

**Example Test Script** (`load-test.js`):
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
    errors: ['rate<0.1'],             // Custom error rate
  },
};

export default function () {
  // Test GET endpoint
  const getResponse = http.get('http://localhost:3000/api/users');
  
  check(getResponse, {
    'GET status is 200': (r) => r.status === 200,
    'GET response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);

  // Test POST endpoint
  const payload = JSON.stringify({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postResponse = http.post('http://localhost:3000/api/users', payload, params);
  
  check(postResponse, {
    'POST status is 201': (r) => r.status === 201,
    'POST response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(1);
}

// Setup and teardown
export function setup() {
  console.log('Setting up test...');
  // Could initialize test data here
}

export function teardown(data) {
  console.log('Tearing down test...');
  // Could clean up test data here
}
```

**Run:**
```bash
k6 run load-test.js

# With custom VUs and duration
k6 run --vus 10 --duration 30s load-test.js

# With results output
k6 run --out json=results.json load-test.js
```

#### Artillery
Simple and powerful load testing toolkit.

**Installation:**
```bash
npm install -g artillery
```

**Example Configuration** (`artillery-config.yml`):
```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      name: "Sustained load"
    - duration: 60
      arrivalRate: 20
      name: "Spike"
  processor: "./test-helpers.js"

scenarios:
  - name: "User flow"
    flow:
      - get:
          url: "/api/users"
          expect:
            - statusCode: 200
            - contentType: json
            - hasProperty: users
      - post:
          url: "/api/users"
          json:
            name: "Test User"
            email: "test@example.com"
          expect:
            - statusCode: 201
      - think: 2
      - get:
          url: "/api/users/{{ userId }}"
          capture:
            - json: "$.id"
              as: "userId"
```

**Run:**
```bash
artillery run artillery-config.yml

# Generate HTML report
artillery run --output report.json artillery-config.yml
artillery report report.json
```

## Performance Budgets

Define performance budgets for your applications:

### Frontend Budgets
```json
{
  "budgets": [
    {
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 300
        },
        {
          "resourceType": "stylesheet",
          "budget": 100
        },
        {
          "resourceType": "image",
          "budget": 500
        },
        {
          "resourceType": "total",
          "budget": 1000
        }
      ],
      "resourceCounts": [
        {
          "resourceType": "third-party",
          "budget": 10
        }
      ]
    }
  ]
}
```

### Backend Budgets
- API Response Time (p95): < 500ms
- API Response Time (p99): < 1000ms
- Error Rate: < 0.1%
- Throughput: > 100 requests/second
- CPU Usage: < 70%
- Memory Usage: < 80%

## Monitoring Performance in CI/CD

### GitHub Actions Example

```yaml
name: Performance Tests

on:
  pull_request:
    branches: [main]

jobs:
  frontend-performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouseci

  backend-performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start application
        run: |
          docker-compose up -d
          sleep 10
      
      - name: Run k6 tests
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load-test.js
      
      - name: Check performance thresholds
        run: |
          # Parse k6 output and fail if thresholds exceeded
          if grep -q "✗" k6-output.txt; then
            echo "Performance thresholds exceeded!"
            exit 1
          fi
```

## Profiling

### Node.js Profiling

**Built-in Profiler:**
```bash
node --prof app.js
node --prof-process isolate-0x*.log > processed.txt
```

**Clinic.js:**
```bash
npm install -g clinic

# Doctor - detects performance issues
clinic doctor -- node app.js

# Bubbleprof - async operations profiling
clinic bubbleprof -- node app.js

# Flame - CPU profiling
clinic flame -- node app.js
```

### Browser Profiling

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Perform actions to profile
5. Stop recording
6. Analyze the flame chart

**Key metrics to look for:**
- Long tasks (> 50ms)
- Excessive re-renders
- Memory leaks
- Network waterfall

## Best Practices

1. **Run tests regularly**: Include performance tests in CI/CD pipeline
2. **Set realistic budgets**: Based on your user requirements
3. **Test on realistic networks**: Use throttling to simulate 3G/4G
4. **Monitor trends**: Track performance over time, not just point-in-time
5. **Test with production data**: Use production-like data volumes
6. **Profile before optimizing**: Don't guess, measure
7. **Test on target devices**: Mobile, desktop, low-end devices

## Example Performance Test Suite Structure

```
tests/
├── performance/
│   ├── frontend/
│   │   ├── lighthouse.config.js
│   │   └── webpagetest.config.js
│   ├── backend/
│   │   ├── load-test.js (k6)
│   │   ├── stress-test.js (k6)
│   │   └── spike-test.js (k6)
│   ├── e2e/
│   │   └── user-flows.js
│   └── helpers/
│       └── test-data.js
```

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [Artillery Documentation](https://www.artillery.io/docs)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Performance Testing Guide](https://web.dev/vitals-tools/)
- [Clinic.js Documentation](https://clinicjs.org/documentation/)
