export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Level: 0=off, 1=warning, 2=error
    'scope-empty': [2, 'never'], // Require scope in all commits
  },
};
