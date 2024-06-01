import path from 'path'

import { createFsFromVolume, Volume } from 'memfs'
import webpack from 'webpack'

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    module: {
      rules: [{
        test: /\.(sc|c)ss$/,
        use: [
          'css-loader',
          {
            loader: path.resolve(__dirname, '../src/loader.js'),
            options,
          },
        ],
      }],
    },
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
  })

  compiler.outputFileSystem = createFsFromVolume(new Volume())
  compiler.outputFileSystem.join = path.join.bind(path)

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        reject(error)
      }
      if (stats.hasErrors()) {
        reject(stats.toJson().errors)
      }
      resolve(stats)
    })
  })
}
