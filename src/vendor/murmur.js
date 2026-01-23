/**
 * Based on https://github.com/timepp/murmurhash
 */

/* eslint-disable default-case */
/* eslint-disable camelcase */

// 64-bit operations using {lo, hi} pairs for x64 variant
/**
 * @typedef {{lo: number, hi: number}} u64
 */

/**
 * @param {u64} a
 * @param {u64} b
 * @returns {u64}
 */
function add64 (a, b) {
  const lo = (a.lo + b.lo) >>> 0
  const hi = (a.hi + b.hi + (lo < a.lo ? 1 : 0)) >>> 0
  return { lo, hi }
}
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add32 (a, b) {
  return (a + b) >>> 0
}
/**
 * @param {u64} a
 * @param {u64} b
 * @returns {u64}
 */
function mul64 (a, b) {
  // Split into 16-bit chunks
  const al = a.lo & 0xffff
  const ah = a.lo >>> 16
  const bl = b.lo & 0xffff
  const bh = b.lo >>> 16

  const p0 = al * bl
  const p1 = al * bh
  const p2 = ah * bl
  const p3 = ah * bh

  const lo1 = ((p0 >>> 16) + (p1 & 0xffff) + (p2 & 0xffff)) >>> 0
  const lo = ((lo1 << 16) | (p0 & 0xffff)) >>> 0

  const hi0 = p3 + (p1 >>> 16) + (p2 >>> 16) + (lo1 >>> 16)
  const hi1 = Math.imul(a.lo, b.hi)
  const hi2 = Math.imul(a.hi, b.lo)
  const hi = (hi0 + hi1 + hi2) >>> 0

  return { lo, hi }
}
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function mul32 (a, b) {
  return Math.imul(a, b) >>> 0
}
/**
 * @param {u64} x
 * @param {number} n
 * @returns {u64}
 */
function rotl64 (x, n) {
  if (n === 0) { return x }
  if (n === 32) { return { lo: x.hi, hi: x.lo } }
  if (n < 32) {
    const lo = ((x.lo << n) | (x.hi >>> (32 - n))) >>> 0
    const hi = ((x.hi << n) | (x.lo >>> (32 - n))) >>> 0
    return { lo, hi }
  }
  n -= 32
  const lo = ((x.hi << n) | (x.lo >>> (32 - n))) >>> 0
  const hi = ((x.lo << n) | (x.hi >>> (32 - n))) >>> 0
  return { lo, hi }
}

/**
 * @param {u64} a
 * @param {u64} b
 * @returns {u64}
 */
function xor64 (a, b) {
  return { lo: (a.lo ^ b.lo) >>> 0, hi: (a.hi ^ b.hi) >>> 0 }
}

/**
 * @param {u64} x
 * @param {number} n
 * @returns {u64}
 */
function shr64 (x, n) {
  if (n === 0) { return x }
  if (n < 32) {
    const lo = ((x.lo >>> n) | (x.hi << (32 - n))) >>> 0
    const hi = x.hi >>> n
    return { lo, hi }
  }
  return { lo: x.hi >>> (n - 32), hi: 0 }
}

/**
 * @param {number} lo
 * @param {number} hi
 * @returns {u64}
 */
function u64 (lo, hi) {
  return { lo: lo >>> 0, hi: hi >>> 0 }
}
/**
 * @param {number} x
 * @param {number} r
 * @returns {number}
 */
function rotl32 (x, r) {
  return ((x << r) | (x >>> (32 - r))) >>> 0
}
/**
 * @param {Uint8Array} key
 * @param {number} i
 * @returns {u64}
 */
function getBlock64 (key, i) {
  const offset = i * 8
  const lo =
    key[offset] |
    (key[offset + 1] << 8) |
    (key[offset + 2] << 16) |
    (key[offset + 3] << 24)
  const hi =
    key[offset + 4] |
    (key[offset + 5] << 8) |
    (key[offset + 6] << 16) |
    (key[offset + 7] << 24)
  return { lo: lo >>> 0, hi: hi >>> 0 }
}
/**
 * @param {Uint8Array} key
 * @param {number} i
 * @returns {number}
 */
function getBlock32 (key, i) {
  const offset = i * 4
  return (
    key[offset] |
    (key[offset + 1] << 8) |
    (key[offset + 2] << 16) |
    (key[offset + 3] << 24)
  ) >>> 0
}
/**
 * @param {u64} k
 * @returns {u64}
 */
function fmix64 (k) {
  k = xor64(k, shr64(k, 33))
  k = mul64(k, u64(0xed558ccd, 0xff51afd7))
  k = xor64(k, shr64(k, 33))
  k = mul64(k, u64(0x1a85ec53, 0xc4ceb9fe))
  k = xor64(k, shr64(k, 33))
  return k
}
/**
 * @param {number} k
 * @returns {number}
 */
function fmix32 (k) {
  k ^= k >>> 16
  k = mul32(k, 0x85ebca6b)
  k ^= k >>> 13
  k = mul32(k, 0xc2b2ae35)
  k ^= k >>> 16
  return k
}
/**
 * Generate murmurhash3 x64 128-bit hash
 *
 * @param {Uint8Array} key - original data
 * @param {number} [seed] - seed value (defaults to 0)
 * @returns {Uint8Array} the hash value as 16 bytes
 */
export function murmurHash3_x64_128 (key, seed = 0) {
  let h1 = u64(seed, 0)
  let h2 = u64(seed, 0)
  const length = key.length
  const blocks = Math.floor(length / 16)
  const c1 = u64(0x114253d5, 0x87c37b91)
  const c2 = u64(0x2745937f, 0x4cf5ad43)

  // Body
  for (let i = 0; i < blocks; i++) {
    let k1 = getBlock64(key, i * 2)
    let k2 = getBlock64(key, i * 2 + 1)

    k1 = mul64(k1, c1)
    k1 = rotl64(k1, 31)
    k1 = mul64(k1, c2)
    h1 = xor64(h1, k1)

    h1 = rotl64(h1, 27)
    h1 = add64(h1, h2)
    h1 = add64(mul64(h1, u64(5, 0)), u64(0x52dce729, 0))

    k2 = mul64(k2, c2)
    k2 = rotl64(k2, 33)
    k2 = mul64(k2, c1)
    h2 = xor64(h2, k2)

    h2 = rotl64(h2, 31)
    h2 = add64(h2, h1)
    h2 = add64(mul64(h2, u64(5, 0)), u64(0x38495ab5, 0))
  }

  // Tail
  let k1 = u64(0, 0)
  let k2 = u64(0, 0)
  const tail = key.slice(blocks * 16)

  switch (tail.length) {
    case 15:
      k2 = xor64(k2, u64(0, tail[14] << 16)) // fallthrough
    case 14:
      k2 = xor64(k2, u64(0, tail[13] << 8)) // fallthrough
    case 13:
      k2 = xor64(k2, u64(0, tail[12])) // fallthrough
    case 12:
      k2 = xor64(k2, u64(tail[11] << 24, 0)) // fallthrough
    case 11:
      k2 = xor64(k2, u64(tail[10] << 16, 0)) // fallthrough
    case 10:
      k2 = xor64(k2, u64(tail[9] << 8, 0)) // fallthrough
    case 9:
      k2 = xor64(k2, u64(tail[8], 0))
      k2 = mul64(k2, c2)
      k2 = rotl64(k2, 33)
      k2 = mul64(k2, c1)
      h2 = xor64(h2, k2) // fallthrough
    case 8:
      k1 = xor64(k1, u64(0, tail[7] << 24)) // fallthrough
    case 7:
      k1 = xor64(k1, u64(0, tail[6] << 16)) // fallthrough
    case 6:
      k1 = xor64(k1, u64(0, tail[5] << 8)) // fallthrough
    case 5:
      k1 = xor64(k1, u64(0, tail[4])) // fallthrough
    case 4:
      k1 = xor64(k1, u64(tail[3] << 24, 0)) // fallthrough
    case 3:
      k1 = xor64(k1, u64(tail[2] << 16, 0)) // fallthrough
    case 2:
      k1 = xor64(k1, u64(tail[1] << 8, 0)) // fallthrough
    case 1:
      k1 = xor64(k1, u64(tail[0], 0))
      k1 = mul64(k1, c1)
      k1 = rotl64(k1, 31)
      k1 = mul64(k1, c2)
      h1 = xor64(h1, k1)
  }

  // Finalization
  const len64 = u64(length, 0)
  h1 = xor64(h1, len64)
  h2 = xor64(h2, len64)

  h1 = add64(h1, h2)
  h2 = add64(h2, h1)

  h1 = fmix64(h1)
  h2 = fmix64(h2)

  h1 = add64(h1, h2)
  h2 = add64(h2, h1)

  // Convert to Uint8Array (big-endian byte order)
  return new Uint8Array([
    (h1.hi >>> 24) & 0xff, (h1.hi >>> 16) & 0xff, (h1.hi >>> 8) & 0xff, h1.hi & 0xff,
    (h1.lo >>> 24) & 0xff, (h1.lo >>> 16) & 0xff, (h1.lo >>> 8) & 0xff, h1.lo & 0xff,
    (h2.hi >>> 24) & 0xff, (h2.hi >>> 16) & 0xff, (h2.hi >>> 8) & 0xff, h2.hi & 0xff,
    (h2.lo >>> 24) & 0xff, (h2.lo >>> 16) & 0xff, (h2.lo >>> 8) & 0xff, h2.lo & 0xff
  ])
}
/**
 * Generate murmurhash3 x86 128-bit hash
 *
 * @param {Uint8Array} key - original data
 * @param {number} [seed] - seed value (defaults to 0)
 * @returns {Uint8Array} the hash value as 16 bytes
 */
export function murmurHash3_x86_128 (key, seed = 0) {
  let h1 = seed >>> 0
  let h2 = seed >>> 0
  let h3 = seed >>> 0
  let h4 = seed >>> 0
  const length = key.length
  const blocks = Math.floor(length / 16)
  const c1 = 0x239b961b
  const c2 = 0xab0e9789
  const c3 = 0x38b34ae5
  const c4 = 0xa1e38b93
  // body
  for (let i = 0; i < blocks; i++) {
    let k1 = getBlock32(key, i * 4)
    let k2 = getBlock32(key, i * 4 + 1)
    let k3 = getBlock32(key, i * 4 + 2)
    let k4 = getBlock32(key, i * 4 + 3)
    k1 = mul32(k1, c1)
    k1 = rotl32(k1, 15)
    k1 = mul32(k1, c2)
    h1 ^= k1
    h1 = rotl32(h1, 19)
    h1 = add32(h1, h2)
    h1 = add32(mul32(h1, 5), 0x561ccd1b)
    k2 = mul32(k2, c2)
    k2 = rotl32(k2, 16)
    k2 = mul32(k2, c3)
    h2 ^= k2
    h2 = rotl32(h2, 17)
    h2 = add32(h2, h3)
    h2 = add32(mul32(h2, 5), 0x0bcaa747)
    k3 = mul32(k3, c3)
    k3 = rotl32(k3, 17)
    k3 = mul32(k3, c4)
    h3 ^= k3
    h3 = rotl32(h3, 15)
    h3 = add32(h3, h4)
    h3 = add32(mul32(h3, 5), 0x96cd1c35)
    k4 = mul32(k4, c4)
    k4 = rotl32(k4, 18)
    k4 = mul32(k4, c1)
    h4 ^= k4
    h4 = rotl32(h4, 13)
    h4 = add32(h4, h1)
    h4 = add32(mul32(h4, 5), 0x32ac3b17)
  }
  const tail = key.slice(blocks * 16)
  let k1 = 0
  let k2 = 0
  let k3 = 0
  let k4 = 0
  switch (tail.length) {
    case 15:
      k4 ^= tail[14] << 16 // fallthrough
    case 14:
      k4 ^= tail[13] << 8 // fallthrough
    case 13:
      k4 ^= tail[12]
      k4 = mul32(k4, c4)
      k4 = rotl32(k4, 18)
      k4 = mul32(k4, c1)
      h4 ^= k4 // fallthrough
    case 12:
      k3 ^= tail[11] << 24 // fallthrough
    case 11:
      k3 ^= tail[10] << 16 // fallthrough
    case 10:
      k3 ^= tail[9] << 8 // fallthrough
    case 9:
      k3 ^= tail[8]
      k3 = mul32(k3, c3)
      k3 = rotl32(k3, 17)
      k3 = mul32(k3, c4)
      h3 ^= k3 // fallthrough
    case 8:
      k2 ^= tail[7] << 24 // fallthrough
    case 7:
      k2 ^= tail[6] << 16 // fallthrough
    case 6:
      k2 ^= tail[5] << 8 // fallthrough
    case 5:
      k2 ^= tail[4]
      k2 = mul32(k2, c2)
      k2 = rotl32(k2, 16)
      k2 = mul32(k2, c3)
      h2 ^= k2 // fallthrough
    case 4:
      k1 ^= tail[3] << 24 // fallthrough
    case 3:
      k1 ^= tail[2] << 16 // fallthrough
    case 2:
      k1 ^= tail[1] << 8 // fallthrough
    case 1:
      k1 ^= tail[0]
      k1 = mul32(k1, c1)
      k1 = rotl32(k1, 15)
      k1 = mul32(k1, c2)
      h1 ^= k1
  }
  // finalization
  h1 ^= length
  h2 ^= length
  h3 ^= length
  h4 ^= length
  h1 = add32(h1, h2)
  h1 = add32(h1, h3)
  h1 = add32(h1, h4)
  h2 = add32(h2, h1)
  h3 = add32(h3, h1)
  h4 = add32(h4, h1)
  h1 = fmix32(h1)
  h2 = fmix32(h2)
  h3 = fmix32(h3)
  h4 = fmix32(h4)
  h1 = add32(h1, h2)
  h1 = add32(h1, h3)
  h1 = add32(h1, h4)
  h2 = add32(h2, h1)
  h3 = add32(h3, h1)
  h4 = add32(h4, h1)
  // Convert to Uint8Array (big-endian byte order)
  return new Uint8Array([
    (h1 >>> 24) & 0xff, (h1 >>> 16) & 0xff, (h1 >>> 8) & 0xff, h1 & 0xff,
    (h2 >>> 24) & 0xff, (h2 >>> 16) & 0xff, (h2 >>> 8) & 0xff, h2 & 0xff,
    (h3 >>> 24) & 0xff, (h3 >>> 16) & 0xff, (h3 >>> 8) & 0xff, h3 & 0xff,
    (h4 >>> 24) & 0xff, (h4 >>> 16) & 0xff, (h4 >>> 8) & 0xff, h4 & 0xff
  ])
}
/**
 * Generate murmurhash3 x86 32-bit hash
 *
 * @param {Uint8Array} key - original data
 * @param {number} [seed] - seed value (defaults to 0)
 * @returns {number} the hash value as a number
 */
export function murmurHash3_x86_32 (key, seed = 0) {
  let h1 = seed >>> 0
  const length = key.length
  const blocks = Math.floor(length / 4)
  const c1 = 0xcc9e2d51
  const c2 = 0x1b873593
  // body
  for (let i = 0; i < blocks; i++) {
    let k1 = getBlock32(key, i)
    k1 = mul32(k1, c1)
    k1 = rotl32(k1, 15)
    k1 = mul32(k1, c2)
    h1 ^= k1
    h1 = rotl32(h1, 13)
    h1 = add32(mul32(h1, 5), 0xe6546b64)
  }
  const tail = key.slice(blocks * 4)
  let k1 = 0
  switch (tail.length) {
    case 3:
      k1 ^= tail[2] << 16 // fallthrough
    case 2:
      k1 ^= tail[1] << 8 // fallthrough
    case 1:
      k1 ^= tail[0]
      k1 = mul32(k1, c1)
      k1 = rotl32(k1, 15)
      k1 = mul32(k1, c2)
      h1 ^= k1
  }
  // finalization
  h1 ^= length
  h1 = fmix32(h1)
  return h1
}
