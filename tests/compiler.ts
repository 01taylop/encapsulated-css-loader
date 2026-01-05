import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import webpack, { type Stats } from 'webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default (loaderPath: string, fixture: string, options = {}): Promise<Stats> => {
  const compiler = webpack({
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

  if (!compiler) {
    throw new Error('Webpack compiler creation failed')
  }

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
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
