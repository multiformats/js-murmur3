# js-murmur3

Multiformats hash functions for MurmurHash3

```js
const { multihash } = require('multiformats')()
const murmur3 = require('@multiformats/murmur3')
multihash.add(murmur3)

const data = new Uint8Array([...someData])
const hash = await multihash.hash(data, 'murmur3-128')
```
