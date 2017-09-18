exports.config = {
  bundles: [
    { components: ['st-fetch', 'demo-fetch'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}