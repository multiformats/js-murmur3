// @ts-nocheck
// Exported library has no type defs which makes TS unhappy. To workaround this
// we define `deps.ts` and ignore this file. That way TS picks types and provides
// inference.
import mur from 'murmurhash3js-revisited'
export { mur }
