---
name: mock-patterns-esm
description: Jest mock patterns for VaquitApp ESM controllers (Babel-transformed to CJS)
metadata:
  type: project
---

When Babel transforms ESM default exports to CJS for Jest, `import Foo from '...'` becomes a reference to `module.default`. All `jest.mock()` factory functions that replace default-export modules must use `{ __esModule: true, default: ... }`.

**Pattern for mocking default-export objects (transporter, cloudinary, repositories):**
```js
jest.mock('../config/mail.config.js', () => {
  const mockTransporter = { sendMail: jest.fn() };
  return { __esModule: true, default: mockTransporter };
});

jest.mock('../config/cloudinary.config.js', () => {
  const mockCloudinary = { uploader: { upload: jest.fn() } };
  return { __esModule: true, default: mockCloudinary };
});
```

**Pattern for mocking Mongoose model default exports:**
```js
jest.mock('../models/groupMember.model.js', () => {
  const mockGroupMember = { find: jest.fn() };
  return { __esModule: true, default: mockGroupMember };
});
```

**Pattern for mocking repository modules (class instances as default export):**
`jest.mock('../repository/auth.repository.js')` with no factory works — Jest auto-mocks the module and replaces all methods with `jest.fn()`. The auto-mock respects the default export correctly because Babel's interop adds the `default` property.

**res/req mock helpers used across all test files:**
```js
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};
```

Related: [[project-test-setup]]
