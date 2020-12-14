export const isEmpty = (value) => {
  return (
    value === null ||
    value === '' ||
    typeof value === 'undefined' ||
    Object.keys(value).length === 0
  )
}
