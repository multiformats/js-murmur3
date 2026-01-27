/* eslint-disable camelcase */
/* eslint-env mocha */
import { assert } from 'aegir/chai'
import { toHex } from 'multiformats/bytes'
import {
  murmurHash3_x86_32,
  murmurHash3_x86_128,
  murmurHash3_x64_128
} from '../src/vendor/murmur.js'

const encoder = new TextEncoder()

/**
 * Convert a string to UTF-8 Uint8Array
 *
 * @param {string} str
 * @returns {Uint8Array}
 */
function utf8Bytes (str) {
  return encoder.encode(str)
}

describe('murmurHash3_x86_32', () => {
  /**
   * @param {string} input
   * @param {number} seed
   * @param {number} expected
   */
  function check (input, seed, expected) {
    const result = murmurHash3_x86_32(utf8Bytes(input), seed) >>> 0
    assert.strictEqual(
      result,
      expected,
      `x86_32("${input}", ${seed}) should be ${expected}`
    )
  }

  it('hashes known strings correctly', () => {
    check('I will not buy this record, it is scratched.', 0, 2832214938)
    check('My hovercraft is full of eels.', 0, 2953494853)
  })

  it('handles different seeds', () => {
    check('My hovercraft is full of eels.', 25, 2520298415)
    check('My hovercraft is full of eels.', 128, 2204470254)
  })

  it('handles empty string', () => {
    check('', 0, 0)
    check('', 1, 1364076727)
  })

  it('handles incrementing string lengths', () => {
    check('0', 0, 3530670207)
    check('01', 0, 1642882560)
    check('012', 0, 3966566284)
    check('0123', 0, 3558446240)
    check('01234', 0, 433070448)
  })

  it('handles multibyte UTF-8 characters', () => {
    check('utf-8 supported 🌈', 0, 2018897981)
    check('這個有效', 0, 3018595841)
  })
})

describe('murmurHash3_x86_128', () => {
  /**
   * @param {string} input
   * @param {number} seed
   * @param {string} expected
   */
  function check (input, seed, expected) {
    const result = murmurHash3_x86_128(utf8Bytes(input), seed)
    const hex = toHex(result)
    assert.strictEqual(
      hex,
      expected,
      `x86_128("${input}", ${seed}) should be ${expected}`
    )
  }

  it('hashes known strings correctly', () => {
    check(
      "I will not buy this tobacconist's, it is scratched.",
      0,
      '9b5b7ba2ef3f7866889adeaf00f3f98e'
    )
  })

  it('handles empty string', () => {
    check('', 0, '00000000000000000000000000000000')
    check('', 1, '88c4adec54d201b954d201b954d201b9')
  })

  it('handles incrementing string lengths', () => {
    check('0', 0, '0ab2409ea5eb34f8a5eb34f8a5eb34f8')
    check('01', 0, '0f87acb4674f3b21674f3b21674f3b21')
    check('012', 0, 'cd94fea54c13d78e4c13d78e4c13d78e')
    check('0123', 0, 'dc378fea485d3536485d3536485d3536')
    check('01234', 0, '35c5b3ee7b3b211600ae108800ae1088')
    check('012345', 0, 'db26dc756ce1944bf825536af825536a')
    check('0123456', 0, 'b708d0a186d15c02495d053b495d053b')
    check('01234567', 0, 'aa22bf849216040263b83c5e63b83c5e')
    check('012345678', 0, '571b5f6775d48126d0205c304ca675dc')
    check('0123456789', 0, '0017a61e2e528b33a5443f2057a11235')
    check('0123456789a', 0, '38a2ed0f921f15e42caa7f97a971884f')
    check('0123456789ab', 0, 'cfaa93f9b6982a7e53412b5d04d3d08f')
    check('0123456789abc', 0, 'c970af1dcc6d9d01dd00c683fc11eee3')
    check('0123456789abcd', 0, '6f34d20ac0a5114dae0d83c563f51794')
    check('0123456789abcde', 0, '3c76c46d4d0818c0add433daa78673fa')
    check('0123456789abcdef', 0, 'fb7d440936aed30a48ad1d9b572b3bfd')
  })

  it('handles multibyte UTF-8 characters', () => {
    check('utf-8 supported 🌈', 0, '796479ed1bbff85b29e39731d1967a07')
    check('這個有效', 0, '5ee7e60516f613aa76048cdc7a1493e3')
  })
})

describe('murmurHash3_x64_128', () => {
  /**
   * @param {string} input
   * @param {number} seed
   * @param {string} expected
   */
  function check (input, seed, expected) {
    const result = murmurHash3_x64_128(utf8Bytes(input), seed)
    const hex = toHex(result)
    assert.strictEqual(
      hex,
      expected,
      `x64_128("${input}", ${seed}) should be ${expected}`
    )
  }

  it('hashes known strings correctly', () => {
    check(
      'I will not buy this record, it is scratched.',
      0,
      'c382657f9a06c49d4a71fdc6d9b0d48f'
    )
    check(
      "I will not buy this tobacconist's, it is scratched.",
      0,
      'd30654abbd8227e367d73523f0079673'
    )
    check(
      'My hovercraft is full of eels.',
      0,
      '03e5e14d358c16d1e5ae86df7ed5cfcb'
    )
  })

  it('handles different seeds', () => {
    check(
      'My hovercraft is full of eels.',
      25,
      'e85cec5bbbe05ddefccbf1b933fff845'
    )
    check(
      'My hovercraft is full of eels.',
      128,
      '898223700c20009cf8b163b4519c7a35'
    )
  })

  it('handles empty string', () => {
    check('', 0, '00000000000000000000000000000000')
    check('', 1, '4610abe56eff5cb551622daa78f83583')
  })

  it('handles incrementing string lengths', () => {
    check('0', 0, '2ac9debed546a3803a8de9e53c875e09')
    check('01', 0, '649e4eaa7fc1708ee6945110230f2ad6')
    check('012', 0, 'ce68f60d7c353bdb00364cd5936bf18a')
    check('0123', 0, '0f95757ce7f38254b4c67c9e6f12ab4b')
    check('01234', 0, '0f04e459497f3fc1eccc6223a28dd613')
    check('012345', 0, '88c0a92586be0a2781062d6137728244')
    check('0123456', 0, '13eb9fb82606f7a6b4ebef492fdef34e')
    check('01234567', 0, '8236039b7387354dc3369387d8964920')
    check('012345678', 0, '4c1e87519fe738ba72a17af899d597f1')
    check('0123456789', 0, '3f9652ac3effeb248027a17cf2990b07')
    check('0123456789a', 0, '4bc3eacd29d386297cb2d9e797da9c92')
    check('0123456789ab', 0, '66352b8cee9e3ca7a9edf0b381a8fc58')
    check('0123456789abc', 0, '5eb2f8db4265931e801ce853e61d0ab7')
    check('0123456789abcd', 0, '07a4a014dd59f71aaaf437854cd22231')
    check('0123456789abcde', 0, 'a62dd5f6c0bf23514fccf50c7c544cf0')
    check('0123456789abcdef', 0, '4be06d94cf4ad1a787c35b5c63a708da')
  })

  it('handles multibyte UTF-8 characters', () => {
    check('utf-8 supported 🌈', 0, '61dacbe7a7080feea406afcde9477eed')
    check('這個有效', 0, 'a5df1c1a469c566b03c818b95419ed65')
  })
})
