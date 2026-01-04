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

  it('encapsulates CSS with the specified class name', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const source = 'h1 { color: red; }'
    const result = loader.call(mockContext, source)

    expect(result).toBe('.test { h1 { color: red; } }')
  })

  it('handles empty CSS', () => {
    mockContext.getOptions.mockReturnValue({ className: 'test' })

    const result = loader.call(mockContext, '')

    expect(result).toBe('.test {  }')
  })

  it('preserves CSS formatting', () => {
    mockContext.getOptions.mockReturnValue({ className: 'wrapper' })

    const source = 'h1 {\n  color: blue;\n  font-size: 16px;\n}'
    const result = loader.call(mockContext, source)

    expect(result).toBe(`.wrapper { ${source} }`)
  })

})
