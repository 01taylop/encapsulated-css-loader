# 🎨 Encapsulated CSS Loader

[![CodeQL Analysis](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/codeql-analysis.yml)
[![Test](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/test.yml/badge.svg)](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/test.yml)

![Node Versions Supported](https://img.shields.io/static/v1?label=node&message=>=18.18.0&color=blue)

A Webpack loader to encapsulate CSS with a given class name to prevent styles from leaking between modules. Ideal for micro-frontend architectures where multiple teams contribute to the same UI.

- [Motivation](#motivation)
- [Example](#example)
- [Usage](#usage)
  - [Installation](#installation)
  - [Configuration](#configuration)

## Motivation

In micro-frontend architectures, different teams develop and deploy modules that render on the same page. This can cause CSS rules to unintentionally impact other modules. `encapsulated-css-loader` solves this by encapsulating CSS within a unique class name, ensuring style isolation.

This loader is ideal for a decentralised build process, using something unique to the module (e.g., repository name) as the encapsulation class name. When rendering the module, apply the same unique class name to ensure that CSS rules are scoped correctly.

While there are other solutions, such as [CSS Modules](https://css-tricks.com/css-modules-part-1-need/), there is no guarantee how teams will build and develop their modules. Therefore encapsulating CSS at the highest level - in the Webpack configuration - was considered the fastest, safest, and more robust solution.

## Example

**example.scss:**

```scss
h1 {
  color: red;
}

.example {
  background-color: #FF69B4;

  p {
    color: #570861;
  }
}
```

**example.scss after encapsulation, using "test" as the class name:**

```css
.test h1 {
  color: red;
}

.test .example {
  background-color: #FF69B4;
}

.test .example p {
  color: #570861;
}
```

> Please note: The loader does not work for SASS files.

## Usage

### Installation

First, install the package as a dev dependency along with `sass-loader`:

```bash
# Using yarn
yarn add -D encapsulated-css-loader sass-loader

# Using npm
npm install -D encapsulated-css-loader sass-loader
```

### Configuration

1. Webpack loaders run in reverse order - from bottom to top - so `encapsulated-css-loader` should be the first loader to run. Pass in the desired `className` to encapsulate the CSS.

2. The next loader must be `sass-loader` - even if you are not using SCSS in your project.

3. Configure any other CSS loaders - such as `postcss`, `css-loader`, and `style-loader` - as required.

```webpack.config.js
{
  module: {
    rules: [

      // Bundle styles and process with PostCSS.
      {
        test: /\.(sc|c)ss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: ['postcss-preset-env'] } } },
          { loader: 'sass-loader', options: { sourceMap: true } },
          { loader: 'encapsulated-css-loader', options: { className: 'test' } },
        ],
      },

    ]
  }
}
```
