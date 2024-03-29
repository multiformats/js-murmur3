/* eslint-disable no-console */

import * as codec from '@ipld/dag-cbor'
import * as Block from 'multiformats/block'
import { murmur3128 as hasher } from './src/index.js'

async function run () {
  const value = { hello: 'world' }
  const block = await Block.encode({ value, hasher, codec })
  console.log(block.cid)
  // -> CID(bafyseebn7ksk6khsn4an2lzmae6wm4qk)
}

run().catch(console.error)
