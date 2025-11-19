# Testing Guide - TLV Business Pulse

Comprehensive testing documentation for the TLV Business Pulse platform.

## Table of Contents

1. [Overview](#overview)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Testing Standards](#testing-standards)
6. [Coverage Requirements](#coverage-requirements)
7. [CI/CD Integration](#cicd-integration)
8. [Debugging Failed Tests](#debugging-failed-tests)

---

## Overview

Our testing strategy ensures the platform operates flawlessly with real business data. We use:

- **Jest** - Unit and integration tests
- **React Testing Library** - Component tests
- **Playwright** - End-to-end tests
- **Custom utilities** - Mock data and test helpers

### Test Categories

1. **Unit Tests** - Individual functions and modules
2. **Integration Tests** - Complete workflows
3. **API Tests** - All API endpoints
4. **E2E Tests** - User journeys
5. **Performance Tests** - Load and response times
6. **Security Tests** - Vulnerability scanning
7. **Validation Tests** - Data quality

---

## Running Tests

### All Tests

```bash
npm test                 # Run all unit/integration tests with coverage
npm run test:ci          # Run tests in CI mode
npm run test:all         # Run unit tests + E2E tests
```

### Specific Test Types

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests
npm run test:e2e
npm run test:e2e:ui     # Run with Playwright UI

# Watch mode (for development)
npm run test:watch
```

### Running Specific Tests

```bash
# Run a specific test file
npm test -- __tests__/ai/generate.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should generate website"

# Run tests in a specific directory
npm test -- __tests__/api/
```

---

## Test Structure

```
tlv-business-pulse/
├── __tests__/
│   ├── ai/
│   │   └── generate.test.ts          # AI generation tests
│   ├── db/
│   │   └── supabase.test.ts          # Database tests
│   ├── data/
│   │   └── tel-aviv-api.test.ts      # Tel Aviv API tests
│   ├── integration/
│   │   ├── generation.test.ts        # Website generation flow
│   │   └── verification.test.ts      # Business verification flow
│   ├── api/
│   │   ├── health.test.ts            # Health check endpoint
│   │   ├── verify.test.ts            # Verification endpoint
│   │   └── businesses.test.ts        # Businesses endpoint
│   ├── performance/
│   │   └── load.test.ts              # Performance benchmarks
│   ├── security/
│   │   └── vulnerabilities.test.ts   # Security tests
│   ├── validation/
│   │   └── data.test.ts              # Data validation
│   └── utils/
│       ├── mock-data.ts              # Mock data generators
│       └── test-helpers.ts           # Test utilities
├── e2e/
│   └── user-flows.spec.ts            # End-to-end tests
├── jest.config.js                     # Jest configuration
├── jest.setup.js                      # Test setup
└── playwright.config.ts               # Playwright configuration
```

---

## Writing Tests

### Unit Test Example

```typescript
import { generateWebsite } from '@/lib/ai/generate';
import { createMockBusinessData } from '../utils/mock-data';

describe('AI Generation - generateWebsite', () => {
  it('should generate a complete website', async () => {
    const business = createMockBusinessData();
    const website = await generateWebsite(business);

    expect(website).toHaveProperty('heroTitle');
    expect(website).toHaveProperty('seoTitle');
    expect(website.seoTitle.length).toBeLessThanOrEqual(60);
  });
});
```

### Integration Test Example

```typescript
describe('Integration - Website Generation Flow', () => {
  it('should complete full workflow', async () => {
    // 1. Fetch business from API
    const businesses = await fetchTelAvivBusinesses(1, 0);

    // 2. Generate website
    const website = await generateWebsite(businesses[0]);

    // 3. Verify output
    expect(website.heroTitle).toBeTruthy();
  });
});
```

### API Test Example

```typescript
import { GET } from '@/app/api/health/route';

describe('API - /api/health', () => {
  it('should return healthy status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TLV Business Pulse/i);
});
```

---

## Testing Standards

### 1. Test Naming Convention

```typescript
// Good ✅
describe('generateWebsite', () => {
  it('should generate SEO metadata', async () => {});
  it('should handle errors gracefully', async () => {});
});

// Bad ❌
describe('Test', () => {
  it('works', async () => {});
});
```

### 2. Test Organization

- Group related tests in `describe` blocks
- Use clear, descriptive test names
- Test one thing per test
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
it('should validate email format', () => {
  // Arrange
  const email = 'test@example.com';

  // Act
  const result = validateEmail(email);

  // Assert
  expect(result).toBe(true);
});
```

### 3. Mock Data

Always use mock data generators:

```typescript
import { createMockBusiness, createMockBusinessData } from '../utils/mock-data';

const business = createMockBusiness({ name: 'Custom Name' });
```

### 4. Assertions

Be specific with assertions:

```typescript
// Good ✅
expect(result.seoTitle.length).toBeLessThanOrEqual(60);
expect(result.keywords.length).toBeGreaterThanOrEqual(3);

// Bad ❌
expect(result).toBeTruthy();
```

### 5. Error Testing

Always test error scenarios:

```typescript
it('should handle API errors', async () => {
  mockAPI.mockRejectedValueOnce(new Error('Network error'));

  await expect(fetchData()).rejects.toThrow('Failed to fetch');
});
```

---

## Coverage Requirements

### Minimum Coverage Thresholds

```javascript
{
  global: {
    branches: 70,    // 70% of branches covered
    functions: 70,   // 70% of functions covered
    lines: 80,       // 80% of lines covered
    statements: 80   // 80% of statements covered
  }
}
```

### Viewing Coverage

```bash
# Generate coverage report
npm test

# View HTML report
open coverage/lcov-report/index.html

# View summary
npm test -- --coverage
```

### Critical Files

These files must have 90%+ coverage:

- `lib/ai/generate.ts` - AI generation
- `lib/data/tel-aviv-api.ts` - Data fetching
- `lib/db/supabase.ts` - Database operations
- All API routes (`app/api/**/route.ts`)

---

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on:

- Every push to any branch
- Every pull request to `main`
- Manual workflow dispatch

### Workflow Steps

1. **Lint** - Code quality checks
2. **Unit Tests** - Jest tests with coverage
3. **Integration Tests** - Full workflow tests
4. **E2E Tests** - Playwright tests
5. **Build** - Verify build succeeds
6. **Security Audit** - Check for vulnerabilities
7. **Summary** - Generate test report

### Pull Request Requirements

PRs must pass:

- ✅ All tests passing
- ✅ Coverage threshold met (80%)
- ✅ No linting errors
- ✅ Build succeeds
- ✅ No critical security vulnerabilities

---

## Debugging Failed Tests

### 1. Read the Error Message

```bash
npm test -- --verbose
```

### 2. Run Single Test

```bash
npm test -- --testNamePattern="specific test"
```

### 3. Use Debug Mode

```typescript
// Add to test
console.log('Debug:', result);
```

### 4. Check Mock Setup

```typescript
// Verify mocks are working
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
```

### 5. Playwright Debugging

```bash
# Run with UI
npm run test:e2e:ui

# Run in debug mode
PWDEBUG=1 npm run test:e2e

# Generate trace
npx playwright show-trace trace.zip
```

### Common Issues

#### Issue: "Cannot find module '@/lib/...'"

**Solution:** Check `moduleNameMapper` in `jest.config.js`

#### Issue: "Timeout exceeded"

**Solution:** Increase timeout for slow tests

```typescript
it('slow test', async () => {
  // ...
}, 10000); // 10 second timeout
```

#### Issue: "Mock not working"

**Solution:** Ensure mock is defined before import

```typescript
jest.mock('axios');
// Must come before import
import { fetchData } from './data';
```

---

## Best Practices

### 1. Keep Tests Fast

- Mock external APIs
- Use in-memory databases for tests
- Avoid unnecessary waits

### 2. Make Tests Deterministic

- Don't rely on external services
- Use fixed dates/times
- Avoid random data in assertions

### 3. Test Edge Cases

- Empty inputs
- Invalid data
- Error conditions
- Boundary values

### 4. Maintain Tests

- Update tests when code changes
- Remove obsolete tests
- Keep coverage high

### 5. Document Complex Tests

```typescript
/**
 * This test verifies the complete business verification flow:
 * 1. Fetches data from Tel Aviv API
 * 2. Cross-references with Companies Registry
 * 3. Calculates quality score
 * 4. Returns verification result
 */
it('should verify business across multiple sources', async () => {
  // ...
});
```

---

## Quality Metrics Dashboard

Generate a comprehensive quality report:

```bash
npm run quality-report
```

This creates `quality-report.json` with:

- Test coverage statistics
- Number of tests (passing/failing)
- Performance benchmarks
- Security scan results
- Code quality metrics

---

## Continuous Improvement

### Regular Tasks

- [ ] Review test coverage weekly
- [ ] Add tests for new features
- [ ] Update tests when bugs are found
- [ ] Refactor slow tests
- [ ] Remove flaky tests
- [ ] Update documentation

### Testing Checklist for New Features

Before merging:

- [ ] Unit tests written
- [ ] Integration tests added
- [ ] API tests updated
- [ ] E2E flow tested
- [ ] Error cases covered
- [ ] Performance tested
- [ ] Documentation updated
- [ ] Coverage threshold met

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://testingjavascript.com/)

---

## Support

For testing questions or issues:

1. Check this documentation
2. Review existing tests for examples
3. Ask in team chat
4. Create an issue in the repository

---

**Last Updated:** 2024-11-19
**Maintained by:** Testing & QA Team
