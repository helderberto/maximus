<div align="center">
  <h1>⚔️ Maximus</h1>

  <p>Lightweight functional JavaScript utilities</p>

  <p>The acronym "MXS" is used in this project to refer to the package name "Maximus"</p>

  <p><a href="#install">Install</a> • <a href="https://helderburato.github.io/maximus/#/">Documentation</a> • <a href="#contribute">Contribute</a></p>

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

  <img src="https://raw.githubusercontent.com/helderburato/maximus/main/banner.jpg" alt="Maximus Banner" />
</div>

## Why Maximus?

We noticed that there are several packages that provide functionalities using functional programming, the Maximus objective is not to overlay robust tools like [Ramda](https://ramdajs.com/) and [Lodash](https://lodash.com/), but for cases where you don't need everything that is offered in these great and appreciated packages.

Some utilities are repeated in the projects we work on and are commonly necessary to rewrite or copy-paste.

Based on this, we aim to focus on small utilities to facilitate the use of functional approach, manipulation of Arrays and Objects.

## Install

Using NPM or Yarn:

```sh
$ npm i --save mxs OR yarn add mxs
```

In Node.js:

```javascript
const MXS = require('mxs)
```

Directly in the browser:

```html
<script src="path/to/your/mxs.js"></script>
```

## Usage

```javascript
import * as MXS from 'mxs'

const result = MXS.compose(
  (withMiddleName) => `${withMiddleName} Meridius`,
  (name) => `${name} Décimus`
)('Maximus')

console.log(result) // => 'Maximus Décimus Meridius'
```

## Contribute

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT License](LICENSE) © Maximus
