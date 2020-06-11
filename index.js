import mur from 'murmurhash3js-revisited'

const fromNumberTo32BitBuf = number => {
  const bytes = new Array(4)
  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }
  return new Uint8Array(bytes)
}

const create = multiformats => {
  const { bytes } = multiformats
  const { fromHex } = bytes
  const hashes = [
    { name: 'murmur3-128', code: 0x22, encode: data => fromHex(mur.x64.hash128(data)) },
    { name: 'murmur3-32', code: 0x23, encode: data => fromNumberTo32BitBuf(mur.x86.hash32(data)) }
  ]
  return hashes
}

export default create
