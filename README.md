# @multiformats/murmur3

[![multiformats.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://multiformats.io)
[![codecov](https://img.shields.io/codecov/c/github/multiformats/js-murmur3.svg?style=flat-square)](https://codecov.io/gh/multiformats/js-murmur3)
[![CI](https://img.shields.io/github/actions/workflow/status/multiformats/js-murmur3/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/multiformats/js-murmur3/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Multiformats Murmur3 implementations

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

`MultihashHashers`s are exported from this library, they produce `MultihashDigest`s. Details about these can be found in the [multiformats multihash interface definitions](https://github.com/multiformats/js-multiformats/blob/master/src/hashes/interface.ts).

```js
import * as Block from 'multiformats/block'
import * as codec from '@ipld/dag-cbor'
import { murmur3128 as hasher } from '@multiformats/murmur3'

async function run () {
  const value = { hello: 'world' }
  const block = await Block.encode({ value, hasher, codec })
  console.log(block.cid)
  // -> CID(bafyseebn7ksk6khsn4an2lzmae6wm4qk)
}

run().catch(console.error)
```

## Usage

The `@multiformats/murmur3` package exports `murmur332` and `murmur3128` `MultihashHasher`s. The Multicodecs [table](https://github.com/multiformats/multicodec/blob/master/table.csv) defines these multihashes.

The `murmur3-32`, multicodec code `0x23`, may be imported as:

```js
import { murmur332 } from '@multiformats/murmur3'
```

The `murmur3-128`, multicodec code `0x22`, may be imported as:

```js
import { murmur3128 } from '@multiformats/murmur3'
```

The `murmur3-x64-64` (which is first 64-bits of `murmur3-128` used in UnixFS directory sharding), multicodec code `0x22`, may be imported as:

```js
import { murmur364 } from '@multiformats/murmur3'
```

# Install

```console
$ npm i @multiformats/murmur3
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `MultiformatsMurmur3` in the global namespace.

```html
<script src="https://unpkg.com/@multiformats/murmur3/dist/index.min.js"></script>
```

# API Docs

- <https://multiformats.github.io/js-murmur3>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/multiformats/js-murmur3/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/multiformats/js-murmur3/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
