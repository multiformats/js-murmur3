import { mur } from './deps.js'
import * as Digest from 'multiformats/hashes/digest'

export const name = 'murmur3-32'
export const code = 0x23

/**
 * @param {Uint8Array} input
 * @returns {import('multiformats/hashes/interface').MultihashDigest<typeof code>}
 */
export const digest = input =>
  Digest.create(code, encode(input))

/**
 * @param {Uint8Array} input
 */
export const encode = input => fromNumberTo32BitBuf(mur.x86.hash32(input))

/**
 * @param {number} number
 * @returns {Uint8Array}
 */
const fromNumberTo32BitBuf = (number) => {
  const bytes = new Array(4)
  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }
  return new Uint8Array(bytes)
}
