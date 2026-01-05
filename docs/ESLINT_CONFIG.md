# ESLint Configuration for Performance

This ESLint configuration is designed to catch common performance anti-patterns and encourage best practices.

## Performance-Related Rules

### General JavaScript/TypeScript Rules

1. **no-await-in-loop** (warn): Warns about using `await` inside loops, which can cause sequential execution instead of parallel
   ```javascript
   // Avoid
   for (const item of items) {
     await processItem(item); // Sequential
   }
   
   // Prefer
   await Promise.all(items.map(item => processItem(item))); // Parallel
   ```

2. **no-return-await** (warn): Redundant `return await` adds unnecessary tick to event loop
   ```javascript
   // Avoid
   async function foo() {
     return await bar();
   }
   
   // Prefer
   async function foo() {
     return bar();
   }
   ```

3. **no-useless-call** (error): Prevents unnecessary `.call()` and `.apply()`

4. **no-useless-concat** (warn): Prevents inefficient string concatenation

5. **prefer-spread** (warn): Spread operator is more efficient than `.apply()`

6. **prefer-template** (warn): Template literals are more efficient than string concatenation

### React-Specific Rules

1. **react/jsx-no-bind** (warn): Creating functions in JSX causes unnecessary re-renders
   ```javascript
   // Avoid
   <button onClick={() => handleClick(id)}>Click</button>
   
   // Prefer - memoize or use useCallback
   const handleClickMemoized = useCallback(() => handleClick(id), [id]);
   <button onClick={handleClickMemoized}>Click</button>
   ```

2. **react/no-array-index-key** (warn): Using array index as key can cause performance issues

3. **react/jsx-no-constructed-context-values** (error): Creating new objects in context provider causes re-renders

4. **react-hooks/exhaustive-deps** (warn): Missing dependencies can cause stale closures and bugs

### TypeScript Rules

1. **@typescript-eslint/prefer-for-of** (warn): `for...of` is more efficient than indexed loops for arrays

2. **@typescript-eslint/prefer-includes** (warn): `.includes()` is more efficient than `.indexOf() !== -1`

3. **@typescript-eslint/prefer-optional-chain** (warn): Optional chaining is more efficient than nested checks

4. **@typescript-eslint/prefer-nullish-coalescing** (warn): Nullish coalescing is clearer and handles edge cases better

## Usage

### Install Dependencies

For JavaScript projects:
```bash
npm install --save-dev eslint
```

For TypeScript projects:
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

For React projects, also install:
```bash
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
```

### Run ESLint

```bash
# Check for issues
npx eslint .

# Fix auto-fixable issues
npx eslint . --fix

# Check specific files
npx eslint src/**/*.{js,ts,jsx,tsx}
```

### IDE Integration

Most modern IDEs (VS Code, WebStorm, etc.) support ESLint integration for real-time feedback.

**VS Code**: Install the ESLint extension and add to settings.json:
```json
{
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

## Customization

You can customize these rules per project by creating a local `.eslintrc.json` in your package directory that extends the root configuration:

```json
{
  "extends": "../../.eslintrc.json",
  "rules": {
    "no-console": "off"
  }
}
```

## Additional Plugins to Consider

- **eslint-plugin-sonarjs**: Detects code complexity and duplications
- **eslint-plugin-unicorn**: Various additional rules for better practices
- **eslint-plugin-import**: Ensures proper module imports/exports
