import loader from '..'

describe('encapsulated-css-loader', () => {

  let mockContext: any

  beforeEach(() => {
    mockContext = {
      getOptions: jest.fn(),
    }
  })

  it('throws error when className is missing', () => {
    mockContext.getOptions.mockReturnValue({})

    expect(() => {
      loader.call(mockContext, 'h1 { color: red; }')
    }).toThrow()
  })

  it('throws an error when className is not a string', () => {
    mockContext.getOptions.mockReturnValue({ className: 123 })

    expect(() => {
      loader.call(mockContext, 'h1 { color: red; }')
    }).toThrow(/should be a string/)
  })

  it('throws an error when strategy is not a valid value', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test', strategy: 'invalid' })

    expect(() => {
      loader.call(mockContext, 'h1 { color: red; }')
    }).toThrow()
  })

  it('encapsulates CSS with the specified class name', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = 'h1 { color: red; }'
    const result = loader.call(mockContext, source)

    expect(result).toBe('.test { h1 { color: red; } }')
  })

  it('encapsulates CSS with the class strategy explicitly set', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test', strategy: 'class' })

    const source = 'h1 { color: red; }'
    const result = loader.call(mockContext, source)

    expect(result).toBe('.test { h1 { color: red; } }')
  })

  it('encapsulates CSS with the scope strategy', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test', strategy: 'scope' })

    const source = 'h1 { color: red; }'
    const result = loader.call(mockContext, source)

    expect(result).toBe('@scope (.test) { h1 { color: red; } }')
  })

  it('handles empty CSS', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const result = loader.call(mockContext, '')

    expect(result).toBe('.test {  }')
  })

  it('handles empty CSS with the scope strategy', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test', strategy: 'scope' })

    const result = loader.call(mockContext, '')

    expect(result).toBe('@scope (.test) {  }')
  })

  it('preserves CSS formatting', () => {
    mockContext.getOptions.mockReturnValue({ className: 'wrapper' })

    const source = 'h1 {\n  color: blue;\n  font-size: 16px;\n}'
    const result = loader.call(mockContext, source)

    expect(result).toBe(`.wrapper { ${source} }`)
  })

  it('extracts @use directives to top level with class strategy', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = "@use 'sass:math';\nh1 { color: red; }"
    const result = loader.call(mockContext, source)

    expect(result).toBe("@use 'sass:math';\n\n.test { h1 { color: red; } }")
  })

  it('extracts @use directives with namespace aliases', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = "@use 'sass:math' as math;\nh1 { color: red; }"
    const result = loader.call(mockContext, source)

    expect(result).toBe("@use 'sass:math' as math;\n\n.test { h1 { color: red; } }")
  })

  it('extracts @import directives to top level', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = "@import 'variables';\nh1 { color: red; }"
    const result = loader.call(mockContext, source)

    expect(result).toBe("@import 'variables';\n\n.test { h1 { color: red; } }")
  })

  it('extracts @forward directives with show clause', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = "@forward 'tokens' show $color-red;\nh1 { color: red; }"
    const result = loader.call(mockContext, source)

    expect(result).toBe("@forward 'tokens' show $color-red;\n\n.test { h1 { color: red; } }")
  })

  it('extracts multiple at-rules preserving order', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = "@charset 'UTF-8';\n@forward 'tokens';\n@use 'sass:math';\nh1 { color: red; }"
    const result = loader.call(mockContext, source)

    expect(result).toBe("@charset 'UTF-8';\n@forward 'tokens';\n@use 'sass:math';\n\n.test { h1 { color: red; } }")
  })

  it('extracts @use directives to top level with scope strategy', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test', strategy: 'scope' })

    const source = "@use 'sass:math';\nh1 { color: red; }"
    const result = loader.call(mockContext, source)

    expect(result).toBe("@use 'sass:math';\n\n@scope (.test) { h1 { color: red; } }")
  })

  it('handles source with only at-rules', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = "@use 'sass:math';"
    const result = loader.call(mockContext, source)

    expect(result).toBe("@use 'sass:math';\n\n.test {  }")
  })

})
