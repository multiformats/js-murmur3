# js-murmur3

Multiformats hash functions for MurmurHash3

```js
import { create } from 'multiformats'
import murmur2 from '@multiformats/murmur3'

const multiformats = create()
const { multihash } = multiformats
multihash.add(murmur3)
const data = new Uint8Array([...someData])
const hash = await multihash.hash(data, 'murmur3-128')
```

This package contains hashing functions for `murmur3-128` and `murmur3-32`.
