exports.config = {
  namespace: 'fetch',
  generateDistribution: true,
  bundles: [
    { components: ['st-fetch'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}