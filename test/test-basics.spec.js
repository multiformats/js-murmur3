/* eslint-env mocha */
import { assert } from 'aegir/chai'
import { bytes, varint } from 'multiformats'
import * as murmur3 from '../src/index.js'

const fixtures = [
  ['murmur3-32', 'beep boop', '2304243ddb9e'],
  ['murmur3-128', 'beep boop', '2210acfe9c5bbf88f075c0c4df0464430ead']
]

describe('Digests', () => {
  for (const [name, input, expectedDigest] of fixtures) {
    it(name, async () => {
      // @ts-expect-error cannot use string to index murmur3
      const hasher = murmur3[name.replace('-', '')]
      const hash = await hasher.digest(bytes.fromString(input))
      assert.strictEqual(hash.code, hasher.code)
      assert.strictEqual(bytes.toHex(hash.bytes), expectedDigest)
    })
  }
})

describe('Hashers', () => {
  const fixture = bytes.fromString('testFixture')

  it('murmur3-32', async () => {
    const hash = await murmur3.murmur332.digest(fixture)
    assert.strictEqual(murmur3.murmur332.code, 0x23)
    assert.strictEqual(hash.code, murmur3.murmur332.code)
    assert.strictEqual(bytes.toHex(hash.bytes), '2304e7285ca1')

    const [code, offset] = varint.decode(hash.bytes)
    assert.equal(code, murmur3.murmur332.code)
    const [size] = varint.decode(hash.bytes, offset)
    assert.equal(size, 32 / 8)
  })

  it('murmur3-128', async () => {
    const hash = await murmur3.murmur3128.digest(fixture)
    assert.strictEqual(murmur3.murmur3128.code, 0x22)
    assert.strictEqual(hash.code, murmur3.murmur3128.code)
    assert.strictEqual(
      bytes.toHex(hash.bytes),
      '2210df48782b0b497325f116d6589ef4c112'
    )

    const [code, offset] = varint.decode(hash.bytes)
    assert.equal(code, murmur3.murmur3128.code)
    const [size] = varint.decode(hash.bytes, offset)
    assert.equal(size, 128 / 8)
  })
  it('murmur3-64', async () => {
    const hash = await murmur3.murmur364.digest(fixture)
    assert.strictEqual(murmur3.murmur364.code, 0x22)
    assert.strictEqual(hash.code, murmur3.murmur364.code)
    assert.deepEqual(
      [...(await murmur3.murmur3128.encode(fixture)).slice(0, 8)],
      [...(await murmur3.murmur364.encode(fixture))]
    )

    const [code, offset] = varint.decode(hash.bytes)
    assert.equal(code, murmur3.murmur364.code)
    const [size] = varint.decode(hash.bytes, offset)
    assert.equal(size, 64 / 8)
  })
})
