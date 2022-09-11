import Ajv from 'ajv'

let instance: Ajv

export function useValidator () {
  if (!instance) {
    instance = new Ajv({
      keywords: ['kind', 'modifier'],
      allErrors: true
    })
  }

  return instance
}
