exports.config = {
  bundles: [
    { components: ['st-fetch'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}