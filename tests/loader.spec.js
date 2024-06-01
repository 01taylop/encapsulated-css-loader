import loader from '../src/loader'

import compiler from './compiler'

describe('loader', () => {

  const exampleCSS = 'h1 {\\n  color: #FF69B4;\\n}\\n'

  let mockContext

  beforeEach(() => {
    mockContext = {
      async: () => (error, result) => {
        if (error) {
          throw error
        }
        return result
      },
      getOptions: jest.fn(),
      query: {},
    }
  })

  it('encapsulates CSS in the specified class', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })
    const result = loader.call(mockContext, exampleCSS)
    expect(result).toBe(`.test { ${exampleCSS} }`)
  })

  it('throws an error if className is not valid', () => {
    mockContext.getOptions.mockReturnValue({ className: 1 })
    expect(() => loader.call(mockContext, exampleCSS)).toThrow('Invalid options object. Encapsulated CSS Loader has been initialized using an options object that does not match the API schema.\n - options.className should be a string.\n   -> Define the class name in which you would like to encapsulate your css.')
  })

  it('throws an error if className is not provided', () => {
    mockContext.getOptions.mockReturnValue({})
    expect(() => loader.call(mockContext, exampleCSS)).toThrow('className must be provided and must be a string')
  })

  describe('with Webpack', () => {

    it('encapsulates a css file', async () => {
      const stats = await compiler('example.css', { className: 'test' })
      console.log(stats)
      const output = stats.toJson({ source: true }).modules[0].source

      expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, ".test { ${exampleCSS} }", ""]);`)
    })

    it('encapsulates an scss file', async () => {
      const stats = await compiler('example.scss', { className: 'test' })
      const output = stats.toJson({ source: true }).modules[0].source

      expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, ".test { ${exampleCSS} }", ""]);`)
    })

    it('throws an error if className is not provided', async () => {
      expect(async () => await compiler('example.scss', {})).toThrow('className must be provided and must be a string')
    })

  })

})
