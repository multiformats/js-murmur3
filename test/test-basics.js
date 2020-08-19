/* globals describe, it */
import main from '@multiformats/murmur3'
import assert from 'assert'
import multiformats from 'multiformats/basics.js'
const test = it
const same = assert.deepStrictEqual

const { bytes } = multiformats
const { multihash } = multiformats
multihash.add(main)

const fixture = bytes.fromString('testFixture')

for (const { name, code } of main(multiformats)) {
  describe(name, () => {
    test('encode', async () => {
      const hashed = await multihash.hash(fixture, name)
      await multihash.validate(hashed, fixture)
      const duplicate = await multihash.hash(fixture, code)
      same(hashed, duplicate)
    })
  })
}
