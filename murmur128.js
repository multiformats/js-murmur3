import { mur } from './deps.js'
import { bytes } from 'multiformats'
import * as Digest from 'multiformats/hashes/digest'

export const name = 'murmur3-128'
export const code = 0x22

/**
 * @param {Uint8Array} input
 * @returns {import('multiformats/hashes/interface').MultihashDigest<typeof code>}
 */
export const digest = (input) =>
  Digest.create(code, encode(input))

/**
 * @param {Uint8Array} input
 */
export const encode = (input) =>
  bytes.fromHex(mur.x64.hash128(input))
