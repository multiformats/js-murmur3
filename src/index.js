import { bytes } from 'multiformats'
import { from } from 'multiformats/hashes/hasher'
// @ts-expect-error no types
import mur from 'murmurhash3js-revisited'

/**
 * @param {number} number
 * @returns {Uint8Array}
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
  encode: (input) => fromNumberTo32BitBuf(mur.x86.hash32(input))
})

export const murmur3128 = from({
  name: 'murmur3-128',
  code: 0x22,
  encode: (input) => bytes.fromHex(mur.x64.hash128(input))
})

// A special-use 0x22 that truncates 64 bits, specifically for use in the UnixFS HAMT
export const murmur364 = from({
  name: 'murmur3-x64-64',
  code: 0x22,
  encode: (input) => bytes.fromHex(mur.x64.hash128(input)).subarray(0, 8)
})
