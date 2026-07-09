/**
 * @packageDocumentation
 *
 * `MultihashHashers`s are exported from this library, they produce `MultihashDigest`s. Details about these can be found in the [multiformats multihash interface definitions](https://github.com/multiformats/js-multiformats/blob/master/src/hashes/interface.ts).
 *
 * ```js
 * import * as Block from 'multiformats/block'
 * import * as codec from '@ipld/dag-cbor'
 * import { murmur3128 as hasher } from '@multiformats/murmur3'
 *
 * async function run () {
 *   const value = { hello: 'world' }
 *   const block = await Block.encode({ value, hasher, codec })
 *   console.log(block.cid)
 *   // -> CID(bafyseebn7ksk6khsn4an2lzmae6wm4qk)
 * }
 *
 * run().catch(console.error)
 * ```
 *
 * ## Usage
 *
 * The `@multiformats/murmur3` package exports `murmur332` and `murmur3128` `MultihashHasher`s. The Multicodecs [table](https://github.com/multiformats/multicodec/blob/master/table.csv) defines these multihashes.
 *
 * The `murmur3-32`, multicodec code `0x23`, may be imported as:
 *
 * ```js
 * import { murmur332 } from '@multiformats/murmur3'
 * ```
 *
 * The `murmur3-128`, multicodec code `0x22`, may be imported as:
 *
 * ```js
 * import { murmur3128 } from '@multiformats/murmur3'
 * ```
 *
 * The `murmur3-x64-64` (which is first 64-bits of `murmur3-128` used in UnixFS directory sharding), multicodec code `0x22`, may be imported as:
 *
 * ```js
 * import { murmur364 } from '@multiformats/murmur3'
 * ```
 */
import { from } from 'multiformats/hashes/hasher'
import * as mur from './vendor/murmur.js'

/**
 * @param {number} number
 * @returns {Uint8Array<ArrayBuffer>}
 */
function fromNumberTo32BitBuf (number) {
  const bytes = new Array(4)
  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }
  return new Uint8Array(bytes)
}

export const murmur332 = from({
  name: 'murmur3-32',
  code: 0x23,
  encode: (input) =>
    fromNumberTo32BitBuf(mur.murmurHash3_x86_32(input))
})

export const murmur3128 = from({
  name: 'murmur3-128',
  code: 0x22,
  encode: (input) =>
    mur.murmurHash3_x64_128(input)
})

/**
 * A special-use 0x22 that truncates 64 bits, specifically for use in the UnixFS
 * HAMT
 */
export const murmur364 = from({
  name: 'murmur3-x64-64',
  code: 0x22,
  encode: (input) =>
    mur.murmurHash3_x64_128(input).subarray(0, 8)
})
