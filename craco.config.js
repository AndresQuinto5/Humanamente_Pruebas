// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.module.rules.push({
          test: /\.json$/,
          loader: 'json-loader',
          type: 'javascript/auto',
        });
        return webpackConfig;
      },
    },
  };
  