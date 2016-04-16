import { join } from 'path';

export default function makeConfig(context) {
  return {
    webpackAssetsFilePath: join(context, '../build/webpack-assets.json'),
    webpackStatsFilePath: join(context, '../build/webpack-stats.json'),
    assets: {
      images: {
        extensions: ['png', 'jpg', 'gif', 'ico', 'svg'],
      },
    },
  };
}
