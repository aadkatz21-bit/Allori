import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTimeTrend = new Trend('response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users for 1 minute
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'], // 95% under 500ms, 99% under 1s
    'http_req_failed': ['rate<0.01'],                  // Error rate under 1%
    'errors': ['rate<0.05'],                           // Custom error rate under 5%
  },
};

// Test data
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export function setup() {
  console.log(`Starting load test against ${BASE_URL}`);
  
  // Verify the service is available
  const res = http.get(`${BASE_URL}/health`);
  if (res.status !== 200) {
    console.error('Service health check failed');
    return { skip: true };
  }
  
  return { skip: false };
}

export default function (data) {
  if (data.skip) {
    console.log('Skipping test due to failed setup');
    return;
  }

  // Test 1: GET endpoint
  const getResponse = http.get(`${BASE_URL}/api/users`);
  
  const getCheckResults = check(getResponse, {
    'GET status is 200': (r) => r.status === 200,
    'GET response has users': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.users);
      } catch (e) {
        return false;
      }
    },
    'GET response time < 500ms': (r) => r.timings.duration < 500,
    'GET response size reasonable': (r) => r.body.length < 1000000, // < 1MB
  });
  
  if (!getCheckResults) {
    errorRate.add(1);
  }
  
  responseTimeTrend.add(getResponse.timings.duration);
  
  sleep(1);

  // Test 2: POST endpoint
  const payload = JSON.stringify({
    name: `User-${Date.now()}`,
    email: `user-${Date.now()}@example.com`,
    metadata: {
      createdAt: new Date().toISOString(),
      source: 'load-test',
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postResponse = http.post(`${BASE_URL}/api/users`, payload, params);
  
  const postCheckResults = check(postResponse, {
    'POST status is 201': (r) => r.status === 201,
    'POST response has id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id !== undefined;
      } catch (e) {
        return false;
      }
    },
    'POST response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  if (!postCheckResults) {
    errorRate.add(1);
  }
  
  responseTimeTrend.add(postResponse.timings.duration);
  
  sleep(1);

  // Test 3: GET specific resource (if POST was successful)
  if (postResponse.status === 201) {
    try {
      const postBody = JSON.parse(postResponse.body);
      const userId = postBody.id;
      
      const getUserResponse = http.get(`${BASE_URL}/api/users/${userId}`);
      
      check(getUserResponse, {
        'GET user status is 200': (r) => r.status === 200,
        'GET user response matches': (r) => {
          try {
            const body = JSON.parse(r.body);
            return body.id === userId;
          } catch (e) {
            return false;
          }
        },
      }) || errorRate.add(1);
      
      responseTimeTrend.add(getUserResponse.timings.duration);
    } catch (e) {
      console.error('Failed to parse POST response:', e);
      errorRate.add(1);
    }
  }

  sleep(2);
}

export function teardown(data) {
  if (!data.skip) {
    console.log('Load test completed successfully');
  }
}

// Handle summary to provide custom output
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
  };
}

function textSummary(data, options = {}) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;
  
  let output = '\n';
  output += `${indent}Checks................: ${data.metrics.checks.passes}/${data.metrics.checks.fails + data.metrics.checks.passes} passed\n`;
  output += `${indent}HTTP req duration.....: avg=${data.metrics.http_req_duration.values.avg.toFixed(2)}ms p(95)=${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  output += `${indent}HTTP req failed.......: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%\n`;
  output += `${indent}Iterations............: ${data.metrics.iterations.values.count}\n`;
  output += `${indent}VUs...................: ${data.metrics.vus.values.value}\n`;
  
  return output;
}
