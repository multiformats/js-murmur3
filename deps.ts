interface Mur {
  x86: {
    hash32(input:Uint8Array): number
  }
  x64: {
    hash128(input:Uint8Array): string
  }
}

export var mur:Mur
