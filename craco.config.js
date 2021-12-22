module.exports = {
  jest: {
    configure(jestConfig) {
      jestConfig.collectCoverageFrom = [...jestConfig.collectCoverageFrom, '!src/index.tsx', '!src/reportWebVitals.ts']
      return jestConfig
    },
  },
}