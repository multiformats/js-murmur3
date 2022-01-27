
import * as mur32 from './murmur32.js'
import * as mur128 from './murmur128.js'

/** @type {import('multiformats/hashes/interface').SyncMultihashHasher<0x23>} */
export const murmur332 = mur32

/** @type {import('multiformats/hashes/interface').SyncMultihashHasher<0x22>} */
export const murmur3128 = mur128
