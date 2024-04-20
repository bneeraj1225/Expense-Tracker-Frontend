module.exports = {
    moduleNameMapper: {
      '\\.css$': 'expense-tracker/__mocks__/styleMock.js',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!react-toastify)',
      "/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)"
    ],    
  };
  