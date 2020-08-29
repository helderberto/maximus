export function is(targetPrototype, value) {
  if (arguments.length === 1) {
    return (_value) => is(targetPrototype, _value)
  }

  return (
    (value != null && value.constructor === targetPrototype) ||
    value instanceof targetPrototype
  )
}
