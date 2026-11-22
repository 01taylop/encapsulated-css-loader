import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import webpack from 'webpack'

import type { Stats } from 'webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compiler = (loaderPath: string, fixture: string, options = {}): Promise<Stats> => {
  const webpackCompiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    module: {
      rules: [{
        test: /\.(sc|c)ss$/,
        use: [
          'css-loader',
          {
            loader: path.resolve(__dirname, loaderPath),
            options,
          },
        ],
      }],
    },
    output: {
      path: tmpdir(),
    },
  })

  if (!webpackCompiler) {
    throw new Error('Webpack compiler creation failed')
  }

  return new Promise((resolve, reject) => {
    webpackCompiler.run((error, stats) => {
      if (error) {
        reject(error)
      }
      if (stats?.hasErrors()) {
        reject(stats.toJson().errors)
      }
      resolve(stats!)
    })
  })
}

export {
  compiler,
}
