const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'android/*', 'ios/*'],
  },
  {
    rules: {
      // The app's copy voice writes plain apostrophes ("don't",
      // "isn't", "You're") throughout — that's a deliberate style
      // choice (see design docs), not a bug. A raw apostrophe in JSX
      // text renders correctly; there's nothing to escape.
      'react/no-unescaped-entities': 'off',
      // This codebase's standard data-fetching shape is: a useCallback
      // `refresh()` that setLoading/setError/setData, called once from
      // useEffect on mount and again on demand (pull-to-refresh, retry
      // buttons). eslint-plugin-react-hooks' newer React-Compiler-era
      // rule flags every one of those call sites even though the
      // pattern is correct and doesn't cause the render loop the rule
      // exists to catch — there's no unconditional setState in the
      // effect body itself, only inside an awaited async callback.
      // Rewriting ~15 hooks to dodge a false positive isn't worth
      // losing the shared refresh() every screen's retry/pull-to-refresh
      // depends on.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
