import loader from '../lib/index.js'

import compiler from './compiler'

const exampleCSS = 'h1 {\n  color: #FF69B4;\n}\n'
const loaderPath = '../lib/index.js'

describe('Integration tests - ESM', () => {

  it('can import the loader', () => {
    expect(loader).toBeDefined()
    expect(typeof loader).toBe('function')
  })

  it('throws an error if className is not provided', async () => {
    expect.assertions(1)

    try {
      await compiler(loaderPath, 'example.css', {})
    } catch (error) {
      expect((error as any[])[0].message).toContain('Error')
    }
  })

  it('encapsulates a css file', async () => {
    expect.assertions(1)

    const stats = await compiler(loaderPath, 'example.css', { className: 'test' })
    const output = stats.toJson({ source: true }).modules?.[0]?.source

    expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, \`.test { ${exampleCSS} }\`, ""]);`)
  })

  it('encapsulates an scss file', async () => {
    expect.assertions(1)

    const stats = await compiler(loaderPath, 'example.scss', { className: 'test' })
    const output = stats.toJson({ source: true }).modules?.[0]?.source

    expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, \`.test { ${exampleCSS} }\`, ""]);`)
  })

})
