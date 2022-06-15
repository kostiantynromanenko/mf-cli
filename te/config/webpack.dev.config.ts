import { Configuration as WebpackConfiguration, container as WebpackContainer } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

import { dependencies } from '../package.json';
import commonConfig from './webpack.common.config';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = merge(commonConfig, {
  mode: 'development',
  plugins: [
    new WebpackContainer.ModuleFederationPlugin({
      name: 'te',
      filename: 'entryFile.js',
      exposes: {
        './App': './src/App'
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies['react']
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom']
        }
      }
    })
  ],
  devServer: {
    historyApiFallback: true,
    hot: true
  },
  devtool: 'inline-source-map'
});

export default config;
