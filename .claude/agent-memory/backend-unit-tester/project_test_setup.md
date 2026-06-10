---
name: project-test-setup
description: Jest + Babel setup decisions for VaquitApp backend unit tests
metadata:
  type: project
---

Backend uses `"type": "module"` (ESM). Jest + Babel are configured to transform ESM to CJS for tests.

**Key decision:** `babel.config.js` must be named `babel.config.cjs` — NOT `.js` — because the package is ESM and Node would try to parse `module.exports` as ESM syntax, crashing before Babel can load.

**Why:** The `"type": "module"` in package.json causes Node to treat all `.js` files as ESM. A `babel.config.js` using `module.exports` breaks immediately. Renaming to `.cjs` opts that file out of ESM treatment.

**How to apply:** Whenever setting up Babel in a project with `"type": "module"`, always create `babel.config.cjs` not `babel.config.js`.

**npm install note:** The machine has SSL certificate issues (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`). Use `npm install --strict-ssl=false` to bypass. This is a local network/proxy issue, not a code problem.

**Jest config** lives in `package.json` under `"jest"` key:
```json
"jest": {
  "testEnvironment": "node",
  "transform": {
    "^.+\\.js$": "babel-jest"
  }
}
```

**Test files location:** `backend/__tests__/` (four files, one per controller).

Related: [[mock-patterns-esm]]
